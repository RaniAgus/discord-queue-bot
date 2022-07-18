import { MessageButton } from 'discord.js';
import { Dictionary } from '../models/collection.model';
import { BotReplyMessage, BotReplyMessageBuilder } from '../models/discord/reply-message.model';

type MentionUserReplyOptions = {
  buttons: Dictionary<MessageButton>
  tag: string
};

export function mentionUserReply({ buttons, tag }: MentionUserReplyOptions): BotReplyMessage {
  return new BotReplyMessageBuilder()
    .setContent(`${tag}, ¡seguís vos! Conectate a un canal de voz para que podamos ayudarte.`)
    .addButtonsRow(buttons.getMultiple('accept'));
}
