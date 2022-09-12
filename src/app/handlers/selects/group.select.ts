import { SelectMenuBuilder } from 'discord.js';
import { InternalBotError } from '../../exceptions/internal-bot.error';
import { BotSelectHandler } from '../../models/core/select-handler.model';
import { BotSelectInteraction } from '../../models/core/select-interaction.model';
import { BotReplyMessageBuilder } from '../../models/discord/reply-message.model';
import { QueueMember } from '../../models/queue/queue-member.model';
import { memberAddedReply } from '../../replies/member-added.reply';
import { getCurrentTime } from '../../utils/time';

export const group: BotSelectHandler = {
  get data(): SelectMenuBuilder {
    return new SelectMenuBuilder()
      .setCustomId('group')
      .setPlaceholder('Seleccionar grupo...');
  },
  hasPermissions(_: BotSelectInteraction): boolean {
    return true;
  },
  async handle({
    interaction, reference, member, app, values: [groupName],
  }: BotSelectInteraction): Promise<void> {
    if (reference === null || member === null) {
      throw new InternalBotError('Ocurrió un error al intentar unirse a la fila.');
    }

    const queue = await app.queueService.get(reference);
    const queueMember = new QueueMember(member, getCurrentTime(), groupName);

    queue.add(queueMember);
    reference.sendToThread(memberAddedReply({ queue, queueMember }));

    await interaction.update(
      new BotReplyMessageBuilder()
        .setContent(`Ingresaste a la fila ${queue.name} con éxito.`)
        .setEphemeral(true),
    );
  },
};
