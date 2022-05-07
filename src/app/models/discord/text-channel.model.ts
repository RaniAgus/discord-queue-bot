import { Message, TextBasedChannels, TextChannel } from 'discord.js';
import { InternalBotError } from '../../exceptions/internal-bot.error';
import { LayerEightError } from '../../exceptions/layer-eight.error';
import { asMilliseconds, Duration } from '../../utils/time';
import { IGuildMember } from './guild-member.model';
import { IMessage, YADBMessage } from './guild-message.model';
import { IReplyMessage } from './reply-message.model';

export interface ITextChannel {
  fetchMessage: (id: string) => Promise<IMessage>
  askMember: (member: IGuildMember, timeout: Duration) => Promise<Message>
  send: (message: IReplyMessage) => Promise<Message<boolean>>
}

export class YADBTextChannel implements ITextChannel {
  constructor(private _channel: TextBasedChannels) {}

  async fetchMessage(id: string): Promise<YADBMessage> {
    const m = this._channel.messages.cache.get(id)
      || await this._channel.messages.fetch(id);

    return new YADBMessage(m);
  }

  async askMember(member: IGuildMember, timeout: Duration): Promise<Message> {
    this.channel.permissionOverwrites.create(member.id, { SEND_MESSAGES: true });

    try {
      // La collection siempre devuelve un elemento
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const userInput = (
        await this.channel.awaitMessages({
          filter: (m: Message) => m.author.id === member.id,
          time: asMilliseconds(timeout),
          max: 1,
          errors: ['time'],
        })
      ).first()!;

      await userInput.delete();
      return userInput;
    } catch {
      throw new LayerEightError(`${member.nickname}, ¡se acabó el tiempo para ingresar la respuesta! Podés intentarlo nuevamente.`);
    } finally {
      this.channel.permissionOverwrites.delete(member.id);
    }
  }

  async send(message: IReplyMessage): Promise<Message<boolean>> {
    return this.channel.send(message);
  }

  private get channel(): TextChannel {
    if (!(this._channel instanceof TextChannel)) {
      throw new InternalBotError(`El canal ${this._channel?.id} no se encuentra en ningún servidor.`);
    }
    return this._channel;
  }
}
