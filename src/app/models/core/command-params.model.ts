import {
  VoiceChannel, Role, CommandInteractionOptionResolver, GuildMember, APIRole,
} from 'discord.js';
import { InternalBotError } from '../../exceptions/internal-bot.error';
import { BotGuildMember } from '../discord/guild-member.model';

export class BotCommandParams {
  constructor(private resolver: CommandInteractionOptionResolver) {}

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

  getMember(key: string): BotGuildMember {
    const member = this.resolver.getMember(key);
    if (member === null) {
      throw new InternalBotError(`Falta parámetro ${key}.`);
    }
    if (!(member instanceof GuildMember)) {
      throw new InternalBotError(`Ocurrió un error al obtener el parámetro ${key}.`);
    }
    return new BotGuildMember(member);
  }
}
