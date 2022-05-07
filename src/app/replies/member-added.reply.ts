import { MessageEmbed } from 'discord.js';
import { IGuildMember } from '../models/discord/guild-member.model';
import { IReplyMessage, YADBReplyMessage } from '../models/discord/reply-message.model';
import { IQueue } from '../models/queue/queue.model';

type TMemberAddedReplyOptions = {
  member: IGuildMember
  queue: IQueue
};

export function memberAddedReply({ queue, member }: TMemberAddedReplyOptions): IReplyMessage {
  return new YADBReplyMessage().addEmbed(
    new MessageEmbed()
      .setAuthor('▶️ Usuario agregado', member.avatarUrl)
      .setDescription(`${member.nickname} ingresó a la fila "${queue.name}" a las ${member.queueArrival.format('HH:mm:ss')}`)
      .setFooter(`Queue ID: ${queue.id} • User ID: ${member.id}`),
  );
}
