import { MessageButton } from 'discord.js';
import { IButtonInteraction } from './button-interaction.model';

export interface IButtonHandler {
  data: MessageButton,
  hasPermissions(interaction: IButtonInteraction): boolean
  handle(interaction: IButtonInteraction): Promise<void>
}
