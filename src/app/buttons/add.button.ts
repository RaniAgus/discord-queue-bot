import { MessageButton } from 'discord.js';
import { InternalBotError } from '../exceptions/internal-bot.error';
import { memberAddedReply } from '../replies/member-added.reply';
import { IButtonHandler } from '../models/core/button-handler.model';
import { IButtonInteraction } from '../models/core/button-interaction.model';

export const add: IButtonHandler = {
  get data(): MessageButton {
    return new MessageButton()
      .setCustomId('add')
      .setLabel('Entrar')
      .setStyle('SUCCESS')
      .setEmoji('▶️');
  },
  hasPermissions(_: IButtonInteraction): boolean {
    return true;
  },
  async handle({
    interaction, message, app, member,
  }: IButtonInteraction): Promise<void> {
    if (message === null || member === null) {
      throw new InternalBotError('Ocurrió un error al intentar agregarte a la fila.');
    }

    const queue = await app.queues.get(message);

    queue.add(member);
    message.sendToThread(memberAddedReply({ queue, member }));

    return interaction.reply({
      content: `Ingresaste a la fila ${queue.name} con éxito.`,
      ephemeral: true,
    });
  },
};
