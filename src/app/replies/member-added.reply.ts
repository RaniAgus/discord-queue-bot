import { MessageEmbed } from 'discord.js';
import { IReplyMessage, YADBReplyMessage } from '../models/discord/reply-message.model';
import { IQueueMember } from '../models/queue/queue-user.model';
import { IQueue } from '../models/queue/queue.model';

type TMemberAddedReplyOptions = {
  queueMember: IQueueMember
  queue: IQueue
};

export function memberAddedReply(
  { queue, queueMember: { member, arrival } }: TMemberAddedReplyOptions,
): IReplyMessage {
  return new YADBReplyMessage().addEmbed(
    new MessageEmbed()
      .setAuthor('▶️ Usuario agregado', member.avatarUrl)
      .setDescription(`${member.nickname} ingresó a la fila "${queue.name}" a las ${arrival.format('HH:mm:ss')}`)
      .setFooter(`Queue ID: ${queue.id} • User ID: ${member.id}`),
  );
}
