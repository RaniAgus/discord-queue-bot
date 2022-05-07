import { GuildMember } from 'discord.js';
import { Time, parseTime } from '../../utils/time';
import env from '../../environment';
import { InternalBotError } from '../../exceptions/internal-bot.error';

export interface IGuildMember {
  id: string
  tag: string
  nickname: string
  avatarUrl: string
  isAdmin: boolean
  isConnectedInVoiceChannel: boolean
  voiceChannelTag: string | null
  queueArrival: Time
  setArrival(queueArrival: Time): this
}

export class YADBGuildMember implements IGuildMember {
  private _queueArrival: Time | null = null;

  constructor(private member: GuildMember) {}

  get id(): string {
    return this.member.id;
  }

  get tag(): string {
    return `<@${this.id}>`;
  }

  get nickname(): string {
    return this.member.nickname ?? this.member.user.username;
  }

  get avatarUrl(): string {
    return this.member.displayAvatarURL();
  }

  get isAdmin(): boolean {
    return this.member.roles.cache.hasAny(...env.ADMIN_ROLES);
  }

  get isConnectedInVoiceChannel(): boolean {
    return this.member.voice.channelId !== null;
  }

  get voiceChannelTag(): string | null {
    return this.isConnectedInVoiceChannel
      ? `<#${this.member.voice.channelId}>` : null;
  }

  get queueArrival(): Time {
    if (!this._queueArrival) {
      throw new InternalBotError(`No se encontró a ${this.nickname} en ninguna fila.`);
    }
    return this._queueArrival;
  }

  setArrival(queueArrival: Time): this {
    this._queueArrival = queueArrival;
    return this;
  }

  toString(): string {
    return `\`${this.queueArrival.format('HH:mm')}\` ${this.tag} ${this.voiceChannelTag ?? '--'}`;
  }
}

export function parseMember(text: string): { id: string, queueArrival: Time } {
  const [time, id] = text.split(/`| |<@|>/).filter((s) => s);

  return { queueArrival: parseTime(time, 'HH:mm'), id };
}
