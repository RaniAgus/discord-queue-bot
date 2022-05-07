import { MessageButton } from 'discord.js';
import { InternalBotError } from '../exceptions/internal-bot.error';
import { IButtonHandler } from '../models/core/button-handler.model';
import { IButtonInteraction } from '../models/core/button-interaction.model';

export const remove: IButtonHandler = {
  get data(): MessageButton {
    return new MessageButton()
      .setCustomId('remove')
      .setLabel('Salir')
      .setStyle('SECONDARY')
      .setEmoji('⏹️');
  },
  hasPermissions(_: IButtonInteraction): boolean {
    return true;
  },
  async handle({
    app, message, member, interaction,
  }: IButtonInteraction): Promise<void> {
    if (message === null || member === null) {
      throw new InternalBotError('Ocurrió un error al intentar quitarte de la fila.');
    }

    const queue = await app.queues.get(message);
    queue.remove(member);

    return interaction.reply({
      content: `Saliste de la fila ${queue.name} con éxito.`,
      ephemeral: true,
    });
  },
};
