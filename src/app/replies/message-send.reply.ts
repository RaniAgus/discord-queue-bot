import { MessageButton } from 'discord.js';
import { Dictionary } from '../models/collection.model';
import { BotReplyMessage, BotReplyMessageBuilder } from '../models/discord/reply-message.model';

type MessageSendOptions = {
  buttons: Dictionary<MessageButton>
  content: string
};

export function messageSendReply({ content, buttons }: MessageSendOptions): BotReplyMessage {
  return new BotReplyMessageBuilder()
    .setContent(content)
    .addButtonsRow(buttons.getMultiple('erase'));
}
