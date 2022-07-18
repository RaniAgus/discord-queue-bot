import { Message, TextBasedChannel, TextChannel } from 'discord.js';
import { InternalBotError } from '../../exceptions/internal-bot.error';
import { BotMessage } from './guild-message.model';
import { BotReplyMessage } from './reply-message.model';

export class BotTextChannel {
  constructor(private channel: TextBasedChannel) {}

  async fetchMessage(id: string): Promise<BotMessage> {
    const m = this.channel.messages.cache.get(id)
      || await this.channel.messages.fetch(id);

    return new BotMessage(m);
  }

  async send(message: BotReplyMessage): Promise<Message<boolean>> {
    return this.textChannel.send(message);
  }

  private get textChannel(): TextChannel {
    if (!(this.channel instanceof TextChannel)) {
      throw new InternalBotError(`El canal ${this.channel?.id} no se encuentra en ningún servidor.`);
    }
    return this.channel;
  }
}
