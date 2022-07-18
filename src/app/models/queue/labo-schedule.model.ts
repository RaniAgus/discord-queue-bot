import { EmbedField } from 'discord.js';
import { Time } from '../../utils/time';
import { BotGuildMember } from '../discord/guild-member.model';
import { LaboGroup } from './labo-group.model';
import { QueueMember } from './queue-member.model';

export class LaboSchedule {
  constructor(
    public time: Time,
    public groups: LaboGroup[] = [],
  ) {}

  private get waitingGroups(): LaboGroup[] {
    return this.groups
      .filter((it) => !it.isEmpty())
      .sort((g1, g2) => g1.compareTo(g2));
  }

  getField(): EmbedField {
    return {
      name: `Horario ${this.time.format('HH:mm')}`,
      value: this.isEmpty()
        ? this.groups.map((it) => it.toRow()).join('\n')
        : this.waitingGroups.map((it) => it.toRow()).join('\n'),
      inline: false,
    };
  }

  isEmpty(): boolean {
    return this.groups.every((it) => it.isEmpty());
  }

  hasMember(member: BotGuildMember): boolean {
    return this.groups.some((it) => it.hasMember(member));
  }

  findGroupByName(name: string): LaboGroup | undefined {
    return this.groups.find((it) => it.name === name);
  }

  findGroupByMember(member: BotGuildMember): LaboGroup | undefined {
    return this.groups.find((it) => it.hasMember(member));
  }

  compareTo(other: LaboSchedule) {
    return this.time.isBefore(other.time) ? -1 : 1;
  }

  nextMembers(): QueueMember[] {
    return this.waitingGroups[0]?.splice() ?? [];
  }
}
