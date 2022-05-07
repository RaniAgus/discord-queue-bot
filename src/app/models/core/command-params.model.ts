import { APIRole } from 'discord-api-types/v9';
import {
  VoiceChannel, Role, CommandInteractionOptionResolver, GuildMember,
} from 'discord.js';
import { InternalBotError } from '../../exceptions/internal-bot.error';
import { IGuildMember, YADBGuildMember } from '../discord/guild-member.model';

export interface ICommandParams {
  getString: (key: string) => string
  getVoice: (key: string) => VoiceChannel
  getRole: (key: string) => Role | APIRole | null
  getMember: (key: string) => IGuildMember
}

export class YADBCommandParams {
  constructor(private resolver: Omit<CommandInteractionOptionResolver, 'getMessage' | 'getFocused'>) {}

  getString(key: string): string {
    const value = this.resolver.getString(key);
    if (value === null) {
      throw new InternalBotError(`Falta parámetro ${key}.`);
    }
    return value;
  }

  getVoice(key: string): VoiceChannel {
    const value = this.resolver.getChannel(key);
    if (value === null) {
      throw new InternalBotError(`Falta parámetro ${key}.`);
    }
    if (!(value instanceof VoiceChannel)) {
      throw new InternalBotError('El canal seleccionado no es de voz');
    }
    return value;
  }

  getRole(key: string): Role | APIRole | null {
    return this.resolver.getRole(key) || null;
  }

  getMember(key: string): IGuildMember {
    const member = this.resolver.getMember(key);
    if (member === null) {
      throw new InternalBotError(`Falta parámetro ${key}.`);
    }
    if (!(member instanceof GuildMember)) {
      throw new InternalBotError(`Ocurrió un error al obtener el parámetro ${key}.`);
    }
    return new YADBGuildMember(member);
  }
}
