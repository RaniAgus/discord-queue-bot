import { GuildMember } from 'discord.js';
import { BotVoiceChannel } from './voice-channel.model';
import { env } from '../../environment';
import { LayerEightError } from '../../exceptions/layer-eight.error';

export class BotGuildMember {
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

  get voiceChannel(): BotVoiceChannel {
    if (!this.member.voice.channel) {
      throw new LayerEightError(`${this.nickname}, ¡no te has conectado a ningún canal de voz!`);
    }
    return new BotVoiceChannel(this.member.voice.channel);
  }
}
