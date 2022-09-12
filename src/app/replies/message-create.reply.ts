import { ButtonBuilder } from 'discord.js';
import { Dictionary } from '../models/collection.model';
import { BotReplyMessage, BotReplyMessageBuilder } from '../models/discord/reply-message.model';
import { markdown } from '../utils/string';

type MessageCreateOptions = {
  buttons: Dictionary<ButtonBuilder>
  title: string
  content: string
};

export function messageCreateReply(options: MessageCreateOptions): BotReplyMessage {
  return new BotReplyMessageBuilder()
    .setContent(markdown(`## ${options.title} ##\n\n${options.content}`, 'markdown'))
    .setComponents(options.buttons.getMultiple('send', 'erase'));
}
