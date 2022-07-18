import { MessageSelectMenu } from 'discord.js';
import { BotBaseHandler } from './base-handler.model';
import { BotSelectInteraction } from './select-interaction.model';

export interface BotSelectHandler extends BotBaseHandler<MessageSelectMenu, BotSelectInteraction> {
  data: MessageSelectMenu
  hasPermissions(interaction: BotSelectInteraction): boolean
  handle(interaction: BotSelectInteraction): Promise<void>
}
