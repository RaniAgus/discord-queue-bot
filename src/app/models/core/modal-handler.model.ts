import { ModalBuilder } from 'discord.js';
import { BotBaseHandler } from './base-handler.model';
import { BotModalInteraction } from './modal-interaction.model';

export interface BotModalHandler extends BotBaseHandler<ModalBuilder, BotModalInteraction> {
  data: ModalBuilder
  hasPermissions(interaction: BotModalInteraction): boolean
  handle(interaction: BotModalInteraction): Promise<void>
}
