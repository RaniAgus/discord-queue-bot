import { SelectMenuInteraction } from 'discord.js';
import { BotGuildMember } from '../discord/guild-member.model';
import { BotInteraction } from '../discord/interaction.model';
import { App } from './app.model';

export interface BotBaseInteraction {
  app: App
  interaction: BotInteraction | SelectMenuInteraction
  member: BotGuildMember | null
}
