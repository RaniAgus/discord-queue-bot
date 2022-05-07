import { MessageButton } from 'discord.js';
import { InternalBotError } from '../exceptions/internal-bot.error';
import { IButtonHandler } from '../models/core/button-handler.model';
import { IButtonInteraction } from '../models/core/button-interaction.model';

export const accept: IButtonHandler = {
  get data(): MessageButton {
    return new MessageButton()
      .setCustomId('accept')
      .setLabel('Aceptar')
      .setStyle('PRIMARY')
      .setEmoji('🚀');
  },
  hasPermissions({ member, message }: IButtonInteraction): boolean {
    return member !== null && (
      member.isAdmin || message.mentionedMembers.includes(member.tag)
    );
  },
  async handle({ message }: IButtonInteraction): Promise<void> {
    if (message === null) {
      throw new InternalBotError('Ocurrió un error al intentar aceptar el mensaje.');
    }
    await message.delete();
  },
};
