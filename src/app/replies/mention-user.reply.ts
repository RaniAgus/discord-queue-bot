import { MessageButton } from 'discord.js';
import { YADBCollection } from '../models/collection.model';
import { IReplyMessage, YADBReplyMessage } from '../models/discord/reply-message.model';

type TMentionUserReplyOptions = {
  buttons: YADBCollection<MessageButton>
  tag: string
};

export function mentionUserReply({ buttons, tag }: TMentionUserReplyOptions): IReplyMessage {
  return new YADBReplyMessage()
    .setContent(`${tag}, ¡seguís vos! Conectate a un canal de voz para que podamos ayudarte.`)
    .addButtonsRow(buttons.getMultiple('accept'));
}
