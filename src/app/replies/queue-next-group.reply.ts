import { ButtonBuilder } from 'discord.js';
import { Dictionary } from '../models/collection.model';
import { BotReplyMessage, BotReplyMessageBuilder } from '../models/discord/reply-message.model';
import { QueueMember } from '../models/queue/queue-member.model';

type QueueNextReplyOptions = {
  buttons: Dictionary<ButtonBuilder>
  members: QueueMember[]
};

export function queueNextGroupReply({ members, buttons }: QueueNextReplyOptions): BotReplyMessage {
  return new BotReplyMessageBuilder()
    .setContent(
      `\`"${members[0].groupName}"\`, son el siguiente grupo en la fila.\n`
      + `${members.map(((it) => it.member.tag)).join(' ')} `
      + 'por favor anúnciense en el laboratorio para poder asignarles las máquinas.',
    )
    .setComponents(buttons.getMultiple('accept'));
}
