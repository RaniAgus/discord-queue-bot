import { MessageSelectOptionData } from 'discord.js';
import axios from 'axios';
import { parseTime } from '../../utils/time';
import { LaboGroup } from './labo-group.model';
import { LaboSchedule } from './labo-schedule.model';
import { env } from '../../environment';

export type Group = {
  name: string,
  schedule: string
};

export class GroupService {
  private cache: Group[] = [];

  private get groups(): Group[] | Promise<Group[]> {
    if (this.shouldLoadGroups) {
      return this.loadGroups().then(() => this.cache);
    }
    return this.cache;
  }

  private get shouldLoadGroups(): boolean {
    return this.cache.length === 0;
  }

  async loadGroups(): Promise<void> {
    this.cache = (await axios.get<Group[]>(env.GROUPS_URL)).data;
  }

  async getSchedules(): Promise<MessageSelectOptionData[]> {
    return [...new Set((await this.groups).map((it) => it.schedule))]
      .sort((h1, h2) => (parseTime(h1, 'HH:mm').isBefore(parseTime(h2, 'HH:mm')) ? -1 : 1))
      .map((it) => ({ label: it, value: it }));
  }

  async getGroupOptions(assignedSchedule: string): Promise<MessageSelectOptionData[]> {
    return (await this.groups)
      .filter((it) => it.schedule === assignedSchedule)
      .map((it) => ({
        label: it.name,
        value: it.name,
        description: `Horario: ${it.schedule}`,
      }));
  }

  async getLaboSchedules(): Promise<LaboSchedule[]> {
    return (await this.groups)
      .reduce(this.reducer, [])
      .sort((s1, s2) => s1.compareTo(s2));
  }

  private reducer(schedules: LaboSchedule[], group: Group): LaboSchedule[] {
    const time = parseTime(group.schedule, 'HH:mm');
    let schedule = schedules.find((it) => it.time.isSame(time));
    if (!schedule) {
      schedule = new LaboSchedule(time);
      schedules.push(schedule);
    }
    schedule.groups.push(new LaboGroup(group.name));

    return schedules;
  }
}
