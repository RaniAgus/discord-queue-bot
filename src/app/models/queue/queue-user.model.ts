import { parseTime, Time } from '../../utils/time';
import { IGuildMember } from '../discord/guild-member.model';

export interface IQueueMember {
  member: IGuildMember;
  arrival: Time;
}

export class YADBQueueMember implements IQueueMember {
  constructor(
    public member: IGuildMember,
    public arrival: Time,
  ) {}

  toString(): string {
    return `\`${this.arrival.format('HH:mm')}\` ${this.member.tag} ${this.member.voiceChannelTag ?? '--'}`;
  }

  static of(text: string): { id: string, arrival: Time } {
    const [time, id] = text.split(/`| |<@|>/).filter((s) => s);

    return { arrival: parseTime(time, 'HH:mm'), id };
  }
}
