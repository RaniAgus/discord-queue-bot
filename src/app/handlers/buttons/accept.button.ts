import { MessageButton } from 'discord.js';
import { BotButtonHandler } from '../../models/core/button-handler.model';
import { BotButtonInteraction } from '../../models/core/button-interaction.model';

export const accept: BotButtonHandler = {
  get data(): MessageButton {
    return new MessageButton()
      .setCustomId('accept')
      .setLabel('Aceptar')
      .setStyle('PRIMARY')
      .setEmoji('🚀');
  },
  hasPermissions({ member, message }: BotButtonInteraction): boolean {
    return (member !== null) && (member.isAdmin || message.mentionedMembers.includes(member.tag));
  },
  async handle({ message }: BotButtonInteraction): Promise<void> {
    await message.delete();
  },
};
