import { EmbedField, EmbedFooterData, ButtonBuilder } from 'discord.js';
import { InternalBotError } from '../../exceptions/internal-bot.error';
import { queueNextGroupReply } from '../../replies/queue-next-group.reply';
import { Dictionary } from '../collection.model';
import { BotGuildMember } from '../discord/guild-member.model';
import { BotMessage } from '../discord/guild-message.model';
import { LaboGroup } from './labo-group.model';
import { LaboSchedule } from './labo-schedule.model';
import { QueueMember } from './queue-member.model';
import { Queue, QueueType } from './queue.model';

const NO_GROUPS_EMBED: EmbedField = {
  name: 'En espera',
  value: 'No hay ningún grupo en la fila.',
  inline: false,
};

type LaboQueueOptions = {
  id: string,
  name: string,
  schedules: LaboSchedule[],
  members: QueueMember[],
  isClosed?: boolean
};

export class LaboQueue extends Queue {
  private schedules: LaboSchedule[];

  constructor(options: LaboQueueOptions) {
    super(options.id, options.name, options.isClosed);
    this.schedules = options.schedules;
    options.members.forEach((it) => this.addMember(it));
  }

  getType(): QueueType {
    return 'LABORATORY';
  }

  getFields(): EmbedField[] {
    const fields = this.schedules
      .filter((it) => !it.isEmpty())
      .map((it) => it.getField());

    return fields.length > 0 ? fields : [NO_GROUPS_EMBED];
  }

  getFooter(): EmbedFooterData {
    return {
      text: !this.isClosed
        ? 'Usen los botones para agregar o quitar a su grupo de la fila.\n'
        + 'En caso de haber varios miembros del mismo grupo a la vez, '
        + 'se mostrará el horario del primero en haber ingresado. '
        + 'Se notificará a todos cuando llegue su turno.\n'
        : 'La fila se encuentra cerrada.',
    };
  }

  getButtonsRow(buttons: Dictionary<ButtonBuilder>): ButtonBuilder[] {
    return this.isTerminated ? buttons.getMultiple('erase') : [
      buttons.get('next').setDisabled(this.isTerminated),
      buttons.get('addGroup').setDisabled(this.isClosed),
      buttons.get('remove').setDisabled(this.isTerminated),
      buttons.get('close').setDisabled(this.isClosed),
    ];
  }

  isEmpty(): boolean {
    return this.schedules.every((it) => it.isEmpty());
  }

  hasMember(member: BotGuildMember): boolean {
    return this.schedules.some((it) => it.hasMember(member));
  }

  addMember(queueMember: QueueMember): void {
    if (!queueMember.groupName) {
      throw new InternalBotError(
        `El miembro ${queueMember.member.nickname} no ingresó ningún nombre de grupo`,
      );
    }
    this.findGroupByName(queueMember.groupName).add(queueMember);
  }

  removeMember(member: BotGuildMember): QueueMember {
    return this.findGroupByMember(member).remove(member);
  }

  nextMembers(): QueueMember[] {
    const [schedule] = this.schedules.filter((it) => !it.isEmpty());
    return schedule?.nextMembers() ?? [];
  }

  nextMessage(next: QueueMember[], buttons: Dictionary<ButtonBuilder>) {
    return queueNextGroupReply({ buttons, members: next });
  }

  private findGroupByName(name: string): LaboGroup {
    const [group] = this.schedules
      .flatMap((it) => it.findGroupByName(name))
      .filter((it) => it !== undefined);
    if (!group) {
      throw new InternalBotError(`No se encontró el grupo: ${name}`);
    }
    return group;
  }

  private findGroupByMember(member: BotGuildMember): LaboGroup {
    const [group] = this.schedules
      .flatMap((it) => it.findGroupByMember(member))
      .filter((it) => it !== undefined);
    if (!group) {
      throw new InternalBotError(`No se encontró el grupo para: ${member.nickname}`);
    }

    return group;
  }

  static async of(message: BotMessage): Promise<QueueMember[]> {
    const fields = message.getEmbedFields();
    const memberList = fields.flatMap((it) => it.value.split('\n'));
    if (memberList[0] === NO_GROUPS_EMBED.value) {
      return [];
    }

    return Promise
      .all(memberList.flatMap(
        (memberStr) => LaboGroup.of(memberStr, (id) => message.fetchGuildMember(id)),
      ))
      .then((members) => members.flatMap((it) => it));
  }
}
