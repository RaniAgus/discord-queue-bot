import { ButtonBuilder } from 'discord.js';
import { Dictionary } from '../models/collection.model';
import { BotReplyMessage, BotReplyMessageBuilder } from '../models/discord/reply-message.model';

type MessageSendOptions = {
  buttons: Dictionary<ButtonBuilder>
  content: string
};

export function messageSendReply({ content, buttons }: MessageSendOptions): BotReplyMessage {
  return new BotReplyMessageBuilder()
    .setContent(content)
    .setComponents(buttons.getMultiple('erase'));
}
