import { split } from '../../utils/string';
import { parseTime, Time } from '../../utils/time';
import { BotGuildMember } from '../discord/guild-member.model';
import { QueueMember } from './queue-member.model';

export class LaboGroup {
  constructor(
    public name: string,
    public members: QueueMember[] = [],
  ) {}

  private get arrival(): Time | undefined {
    return this.members[0]?.arrival;
  }

  toRow(): string {
    return this.isEmpty()
      ? this.name
      : `\`${this.arrival?.format('HH:mm')}\` "${this.name}": ${this.members.map((it) => it.member.tag).join(' ')}`;
  }

  isEmpty(): boolean {
    return this.members.length <= 0;
  }

  hasMember(member: BotGuildMember): boolean {
    return this.indexOf(member) >= 0;
  }

  add(queueMember: QueueMember) {
    this.members.push(queueMember);
  }

  remove(member: BotGuildMember): QueueMember {
    const [queueMember] = this.members.splice(this.indexOf(member), 1);
    return queueMember;
  }

  splice(): QueueMember[] {
    return this.members.splice(0, this.members.length);
  }

  compareTo(other: LaboGroup) {
    return this.arrival?.isBefore(other.arrival) ? -1 : 1;
  }

  private indexOf(member: BotGuildMember) {
    return this.members.findIndex((it) => it.member.id === member.id);
  }

  static async of(
    text: string,
    fetchMember: (id: string) => Promise<BotGuildMember>,
  ): Promise<QueueMember[]> {
    const [groupData, groupName, members] = text.split('"');
    const arrival = parseTime(groupData.replace(/`| /g, ''), 'HH:mm');
    return Promise.all(
      split(members, ['`', ' ', '<', '@', '>', ':']).map(
        async (id) => new QueueMember(await fetchMember(id), arrival, groupName),
      ),
    );
  }
}
