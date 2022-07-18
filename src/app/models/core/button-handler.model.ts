import { MessageButton } from 'discord.js';
import { BotButtonInteraction } from './button-interaction.model';
import { BotBaseHandler } from './base-handler.model';

export interface BotButtonHandler extends BotBaseHandler<MessageButton, BotButtonInteraction> {
  data: MessageButton,
  hasPermissions(interaction: BotButtonInteraction): boolean
  handle(interaction: BotButtonInteraction): Promise<void>
}
