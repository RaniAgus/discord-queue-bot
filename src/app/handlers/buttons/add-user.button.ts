import { MessageButton } from 'discord.js';
import { InternalBotError } from '../../exceptions/internal-bot.error';
import { memberAddedReply } from '../../replies/member-added.reply';
import { BotButtonHandler } from '../../models/core/button-handler.model';
import { BotButtonInteraction } from '../../models/core/button-interaction.model';
import { QueueMember } from '../../models/queue/queue-member.model';
import { getCurrentTime } from '../../utils/time';

export const addUser: BotButtonHandler = {
  get data(): MessageButton {
    return new MessageButton()
      .setCustomId('addUser')
      .setLabel('Entrar')
      .setStyle('SUCCESS')
      .setEmoji('▶️');
  },
  hasPermissions(_: BotButtonInteraction): boolean {
    return true;
  },
  async handle({
    interaction, message, app, member,
  }: BotButtonInteraction): Promise<void> {
    if (member === null) {
      throw new InternalBotError('Ocurrió un error al intentar agregar un miembro a la fila.');
    }

    const queue = await app.queueService.get(message);
    const queueMember = new QueueMember(member, getCurrentTime());

    queue.add(queueMember);
    message.sendToThread(memberAddedReply({ queue, queueMember }));

    return interaction.reply({
      content: `Ingresaste a la fila ${queue.name} con éxito.`,
      ephemeral: true,
    });
  },
};
