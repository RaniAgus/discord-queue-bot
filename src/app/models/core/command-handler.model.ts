import { ToAPIApplicationCommandOptions } from 'discord.js';
import { BotCommandInteraction } from './command-interaction.model';
import { BotBaseHandler } from './base-handler.model';

export type BotCommand = {
  name: string;
  description: string;
  options: ToAPIApplicationCommandOptions[];
};

export interface BotCommandHandler extends BotBaseHandler<BotCommand, BotCommandInteraction> {
  data: BotCommand
  hasPermissions(interaction: BotCommandInteraction): boolean
  handle(interaction: BotCommandInteraction): Promise<void>
}
