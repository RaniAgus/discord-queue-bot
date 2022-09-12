import { SelectMenuBuilder } from 'discord.js';
import { BotBaseHandler } from './base-handler.model';
import { BotSelectInteraction } from './select-interaction.model';

export interface BotSelectHandler extends BotBaseHandler<SelectMenuBuilder, BotSelectInteraction> {
  data: SelectMenuBuilder
  hasPermissions(interaction: BotSelectInteraction): boolean
  handle(interaction: BotSelectInteraction): Promise<void>
}
