import { MessageButton } from 'discord.js';
import { InternalBotError } from '../exceptions/internal-bot.error';
import { IButtonHandler } from '../models/core/button-handler.model';
import { IButtonInteraction } from '../models/core/button-interaction.model';

export const deleteBtn: IButtonHandler = {
  get data(): MessageButton {
    return new MessageButton()
      .setCustomId('delete')
      .setLabel('Eliminar')
      .setStyle('DANGER')
      .setEmoji('🗑️');
  },
  hasPermissions({ interaction, member }: IButtonInteraction): boolean {
    return !interaction.isInGuild || (member !== null && member.isAdmin);
  },
  async handle({ textChannel, message }: IButtonInteraction): Promise<void> {
    if (!textChannel || !message) {
      throw new InternalBotError('Ocurrió un error al intentar borrar el mensaje.');
    }

    await message.delete();
  },
};
