import { MessageButton, MessageEmbed } from 'discord.js';
import { YADBCollection } from '../models/collection.model';
import { IMessage } from '../models/discord/guild-message.model';
import { IReplyMessage, YADBReplyMessage } from '../models/discord/reply-message.model';
import { IQueueMember, YADBQueueMember } from '../models/queue/queue-user.model';
import { IQueue, YADBQueue } from '../models/queue/queue.model';

const NO_USERS_LABEL = 'No hay nadie en la fila.';

type TQueueReplyOptions = {
  buttons: YADBCollection<MessageButton>,
  queue: IQueue,
  withAttachment?: boolean,
};

export function queueReply({ queue, buttons, withAttachment }: TQueueReplyOptions): IReplyMessage {
  const embed = new MessageEmbed()
    .setAuthor(
      `Fila "${queue.name}"`,
      'attachment://utn-logo.png',
      'https://www.youtube.com/watch?v=xvFZjo5PgG0',
    )
    .setColor('#f80434')
    .setFooter(!queue.isClosed
      ? 'Usá los botones para entrar o salir de la fila.' : 'La fila se encuentra cerrada.');

  if (!queue.isTerminated) {
    embed.addField('En espera', queue.members.join('\n') || NO_USERS_LABEL);
  }

  const message = new YADBReplyMessage()
    .setContent(queue.name)
    .addEmbed(embed)
    .addButtonsRow(
      queue.isTerminated ? buttons.getMultiple('erase') : [
        buttons.get('next').setDisabled(queue.isTerminated),
        buttons.get('add').setDisabled(queue.isClosed),
        buttons.get('remove').setDisabled(queue.isTerminated),
        buttons.get('close').setDisabled(queue.isClosed),
      ],
    );

  return withAttachment
    ? message.addAttachment('./assets/utn-logo.png', 'utn-logo.png') : message;
}

const fetchQueueMembers = async (message: IMessage): Promise<IQueueMember[]> => {
  const memberList = message.getEmbedField(0).value.split('\n');
  if (memberList[0] === NO_USERS_LABEL) {
    return [];
  }

  return Promise.all(memberList.map(async (memberStr) => {
    const { id, arrival } = YADBQueueMember.of(memberStr);
    const member = await message.fetchGuildMember(id);

    return new YADBQueueMember(member, arrival);
  }));
};

export async function fetchQueue(message: IMessage): Promise<IQueue> {
  const members = await fetchQueueMembers(message);
  const isClosed = message.isActionDisabled('close');

  return new YADBQueue({
    id: message.id, name: message.content, members, isClosed,
  });
}
