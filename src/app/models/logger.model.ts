import { Message, TextBasedChannel } from 'discord.js';
import { errorReplyContentForLog } from '../replies/error.reply';
import { chunkString, markdown, stringify } from '../utils/string';

const DISCORD_MAX_MSG_LENGTH = 2000;

export class LogChannel {
  private logChannel: TextBasedChannel | null = null;

  setChannel(channel: TextBasedChannel): void {
    this.logChannel = channel;
  }

  async log(text: string, language = ''): Promise<Message<boolean>[]> {
    const result: Promise<Message<boolean>>[] = [];
    const maxlen = DISCORD_MAX_MSG_LENGTH - language.length - 8;

    if (this.logChannel === null) {
      throw Error('El canal logger no está definido.');
    }

    chunkString(text, maxlen).forEach((chunk) => {
      this.logChannel?.send(markdown(chunk, language));
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
