import { MessageEmbed } from 'discord.js';
import { BotReplyMessage, BotReplyMessageBuilder } from '../models/discord/reply-message.model';
import { QueueMember } from '../models/queue/queue-member.model';
import { Queue } from '../models/queue/queue.model';

type MemberAddedReplyOptions = {
  queueMember: QueueMember
  queue: Queue
};

export function memberAddedReply({ queueMember, queue }: MemberAddedReplyOptions): BotReplyMessage {
  return new BotReplyMessageBuilder().addEmbed(
    new MessageEmbed()
      .setAuthor({
        name: '▶️ Usuario agregado',
        iconURL: queueMember.member.avatarUrl,
      })
      .setDescription(
        `${queueMember.member.nickname} ingresó a la fila "${queue.name}" `
        + `a las ${queueMember.arrival.format('HH:mm:ss')}`,
      )
      .setFooter({
        text: `Queue ID: ${queue.id} • User ID: ${queueMember.member.id}`,
      }),
  );
}
