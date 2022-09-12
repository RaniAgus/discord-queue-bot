import { ButtonBuilder, ButtonStyle } from 'discord.js';
import { BotButtonHandler } from '../../models/core/button-handler.model';
import { BotButtonInteraction } from '../../models/core/button-interaction.model';

export const close: BotButtonHandler = {
  get data(): ButtonBuilder {
    return new ButtonBuilder()
      .setCustomId('close')
      .setLabel('Cerrar')
      .setStyle(ButtonStyle.Danger)
      .setEmoji('⏏️');
  },
  hasPermissions({ member }: BotButtonInteraction): boolean {
    return member !== null && member.isAdmin;
  },
  async handle({ app, message, interaction }: BotButtonInteraction): Promise<void> {
    const queue = await app.queueService.get(message);
    queue.close();

    return interaction.reply({
      content: `La fila ${queue.name} ha sido cerrada con éxito.`,
      ephemeral: true,
    });
  },
};
