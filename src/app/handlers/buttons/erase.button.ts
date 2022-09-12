import { ButtonBuilder, ButtonStyle } from 'discord.js';
import { BotButtonHandler } from '../../models/core/button-handler.model';
import { BotButtonInteraction } from '../../models/core/button-interaction.model';

// No puedo llamarlo 'delete' porque es palabra reservada :(
export const erase: BotButtonHandler = {
  get data(): ButtonBuilder {
    return new ButtonBuilder()
      .setCustomId('erase')
      .setLabel('Eliminar')
      .setStyle(ButtonStyle.Danger)
      .setEmoji('🗑️');
  },
  hasPermissions({ interaction, member }: BotButtonInteraction): boolean {
    return !interaction.isInGuild || (member !== null && member.isAdmin);
  },
  async handle({ message }: BotButtonInteraction): Promise<void> {
    await message.delete();
  },
};
