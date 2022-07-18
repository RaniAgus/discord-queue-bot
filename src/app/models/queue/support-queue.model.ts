import { EmbedField, EmbedFooterData, MessageButton } from 'discord.js';
import { queueNextReply } from '../../replies/queue-next.reply';
import { Dictionary } from '../collection.model';
import { BotGuildMember } from '../discord/guild-member.model';
import { BotMessage } from '../discord/guild-message.model';
import { QueueMember } from './queue-member.model';
import { Queue, QueueType } from './queue.model';

const NO_USERS_LABEL = 'No hay nadie en la fila.';

type SupportQueueOptions = {
  id: string,
  name: string,
  members: QueueMember[],
  isClosed?: boolean
};

export class SupportQueue extends Queue {
  protected members: QueueMember[];

  constructor(options: SupportQueueOptions) {
    super(options.id, options.name, options.isClosed);
    this.members = options.members;
  }

  getType(): QueueType {
    return 'SUPPORT';
  }

  getFields(): EmbedField[] {
    return !this.isTerminated ? [{
      name: 'En espera',
      value: this.members.map((member) => member.toRow()).join('\n') || NO_USERS_LABEL,
      inline: false,
    }] : [];
  }

  getFooter(): EmbedFooterData {
    return {
      text: this.isClosed
        ? 'La fila se encuentra cerrada.'
        : 'Usá los botones para entrar o salir de la fila.',
    };
  }

  getAddButtonId(): string {
    return 'addUser';
  }

  isEmpty(): boolean {
    return this.members.length === 0;
  }

  hasMember(member: BotGuildMember): boolean {
    return this._indexOf(member.id) >= 0;
  }

  addMember(queueMember: QueueMember): void {
    this.members.push(queueMember);
  }

  removeMember({ id }: BotGuildMember): QueueMember {
    const index = this._indexOf(id);
    const [queueMember] = this.members.splice(index, 1);
    return queueMember;
  }

  nextMembers(): QueueMember[] {
    const next = this.members.shift();
    return next ? [next] : [];
  }

  nextMessage([next]: QueueMember[], buttons: Dictionary<MessageButton>) {
    return queueNextReply({ buttons, member: next.member });
  }

  private _indexOf(id: string): number {
    return this.members.findIndex((m) => m.member.id === id);
  }

  static async of(message: BotMessage): Promise<QueueMember[]> {
    const [field] = message.getEmbedFields();
    const memberList = field.value.split('\n');
    if (memberList[0] === NO_USERS_LABEL) {
      return [];
    }

    return Promise.all(memberList.map(
      (memberStr) => QueueMember.of(memberStr, (id) => message.fetchGuildMember(id)),
    ));
  }
}
