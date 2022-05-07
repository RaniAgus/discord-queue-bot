import { MessageButton } from 'discord.js';
import { InternalBotError } from '../exceptions/internal-bot.error';
import { IButtonHandler } from '../models/core/button-handler.model';
import { IButtonInteraction } from '../models/core/button-interaction.model';

export const close: IButtonHandler = {
  get data(): MessageButton {
    return new MessageButton()
      .setCustomId('close')
      .setLabel('Cerrar')
      .setStyle('DANGER')
      .setEmoji('⏏️');
  },
  hasPermissions({ member }: IButtonInteraction): boolean {
    return member !== null && member.isAdmin;
  },
  async handle({ app, message, interaction }: IButtonInteraction): Promise<void> {
    if (message === null) {
      throw new InternalBotError('Ocurrió un error al intentar cerrar la fila.');
    }

    const queue = await app.queues.get(message);
    queue.close();

    return interaction.reply({
      content: `La fila ${queue.name} ha sido cerrada con éxito.`,
      ephemeral: true,
    });
  },
};
