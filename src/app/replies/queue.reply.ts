import { ButtonBuilder, EmbedBuilder } from 'discord.js';
import { Dictionary } from '../models/collection.model';
import { BotMessage } from '../models/discord/guild-message.model';
import { BotReplyMessage, BotReplyMessageBuilder } from '../models/discord/reply-message.model';
import { SupportQueue } from '../models/queue/support-queue.model';
import { InternalBotError } from '../exceptions/internal-bot.error';
import { Queue, QueueType } from '../models/queue/queue.model';
import { LaboQueue } from '../models/queue/labo-queue.model';
import { GroupService } from '../models/queue/group.service';

type QueueReplyOptions = {
  buttons: Dictionary<ButtonBuilder>,
  queue: Queue,
};

export function queueReply({ queue, buttons }: QueueReplyOptions): BotReplyMessage {
  return new BotReplyMessageBuilder()
    .setContent(queue.getType())
    .setEmbed(
      new EmbedBuilder()
        .setAuthor({
          name: `Fila "${queue.name}"`,
          url: 'https://www.youtube.com/watch?v=xvFZjo5PgG0',
        })
        .setColor('#f80434')
        .setFooter(queue.getFooter())
        .setFields(queue.getFields()),
    )
    .setComponents(queue.getButtonsRow(buttons));
}

export async function fetchQueue(message: BotMessage, groupService: GroupService): Promise<Queue> {
  const [, name] = message.getEmbedAuthor().split('"');
  const type = message.content as QueueType;
  const isClosed = message.isActionDisabled('close');

  const options = { id: message.id, name, isClosed };

  if (type === 'SUPPORT') {
    return new SupportQueue({
      ...options,
      members: await SupportQueue.of(message),
    });
  }

  if (type === 'LABORATORY') {
    return new LaboQueue({
      ...options,
      members: await LaboQueue.of(message),
      schedules: await groupService.getLaboSchedules(),
    });
  }

  throw new InternalBotError('No es posible recuperar los datos de la fila');
}
