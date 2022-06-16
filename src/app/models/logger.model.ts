import { Message, TextBasedChannels } from 'discord.js';
import { errorReplyContentForLog } from '../replies/error.reply';
import { chunkString, markdown, stringify } from '../utils/string';

const DISCORD_MAX_MSG_LENGTH = 2000;

export interface ILogger {
  setChannel(channel: TextBasedChannels): void
  log(text: string, language?: string): Promise<Message<boolean>[]>
  logError(error: unknown): Promise<Message<boolean>[]>
  logJSON(object: unknown): Promise<Message<boolean>[]>
}

export class YADBLogger implements ILogger {
  private logChannel?: TextBasedChannels;

  setChannel(channel: TextBasedChannels): void {
    this.logChannel = channel;
  }

  async log(text: string, language = ''): Promise<Message<boolean>[]> {
    const result: Promise<Message<boolean>>[] = [];
    const maxlen = DISCORD_MAX_MSG_LENGTH - language.length - 8;

    chunkString(text, maxlen).forEach((chunk) => {
      if (!this.logChannel) {
        throw Error('El canal logger no está definido.');
      }
      this.logChannel.send(markdown(chunk, language));
    });

    return Promise.all(result);
  }

  async logError(error: unknown): Promise<Message<boolean>[]> {
    return this.log(errorReplyContentForLog(error), 'json');
  }

  async logJSON(object: unknown): Promise<Message<boolean>[]> {
    return this.log(stringify(object), 'json');
  }
}
