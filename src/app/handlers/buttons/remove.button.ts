import { MessageButton } from 'discord.js';
import { InternalBotError } from '../../exceptions/internal-bot.error';
import { BotButtonHandler } from '../../models/core/button-handler.model';
import { BotButtonInteraction } from '../../models/core/button-interaction.model';

export const remove: BotButtonHandler = {
  get data(): MessageButton {
    return new MessageButton()
      .setCustomId('remove')
      .setLabel('Salir')
      .setStyle('SECONDARY')
      .setEmoji('⏹️');
  },
  hasPermissions(_: BotButtonInteraction): boolean {
    return true;
  },
  async handle({
    app, message, member, interaction,
  }: BotButtonInteraction): Promise<void> {
    if (member === null) {
      throw new InternalBotError('Ocurrió un error al intentar quitar a un miembro de la fila.');
    }

    const queue = await app.queueService.get(message);
    queue.remove(member);

    return interaction.reply({
      content: `Saliste de la fila ${queue.name} con éxito.`,
      ephemeral: true,
    });
  },
};
