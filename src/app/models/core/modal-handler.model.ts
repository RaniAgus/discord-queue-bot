import { Modal } from 'discord.js';
import { BotBaseHandler } from './base-handler.model';
import { BotModalInteraction } from './modal-interaction.model';

export interface BotModalHandler extends BotBaseHandler<Modal, BotModalInteraction> {
  data: Modal
  hasPermissions(interaction: BotModalInteraction): boolean
  handle(interaction: BotModalInteraction): Promise<void>
}
