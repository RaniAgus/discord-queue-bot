import { split } from '../../utils/string';
import { parseTime, Time } from '../../utils/time';
import { BotGuildMember } from '../discord/guild-member.model';

export class QueueMember {
  constructor(
    public member: BotGuildMember,
    public arrival: Time,
    public groupName?: string,
  ) {}

  toRow(): string {
    return `\`${this.arrival.format('HH:mm')}\` ${this.member.tag} ${this.member.voiceChannelTag ?? '--'}`;
  }

  static async of(
    text: string,
    fetchMember: (id: string) => Promise<BotGuildMember>,
  ): Promise<QueueMember> {
    const [time, id] = split(text, ['`', ' ', '<', '@', '>', '#']);
    return new QueueMember(await fetchMember(id), parseTime(time, 'HH:mm'));
  }
}
