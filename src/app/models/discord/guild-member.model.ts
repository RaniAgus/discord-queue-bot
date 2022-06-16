import { GuildMember } from 'discord.js';
import env from '../../environment';

export interface IGuildMember {
  id: string
  tag: string
  nickname: string
  avatarUrl: string
  isAdmin: boolean
  isConnectedInVoiceChannel: boolean
  voiceChannelTag: string | null
}

export class YADBGuildMember implements IGuildMember {
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
}
