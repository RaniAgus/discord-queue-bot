import { ButtonInteraction, CommandInteraction, Message } from 'discord.js';
import { InternalBotError } from '../../exceptions/internal-bot.error';
import { IMessage, YADBMessage } from './guild-message.model';
import { IReplyMessage } from './reply-message.model';

export interface IInteraction {
  ping: number
  createdTimestamp: number
  isInGuild: boolean
  deferReply(): Promise<IMessage>
  reply(reply: IReplyMessage): Promise<void>
  replyAndFetch(reply: IReplyMessage): Promise<IMessage>
  editReply(reply: IReplyMessage): Promise<void>
  followUp(reply: IReplyMessage): Promise<void>
}

export class YADBInteraction implements IInteraction {
  constructor(private interaction: ButtonInteraction | CommandInteraction) {}

  get isInGuild(): boolean {
    return this.interaction.inGuild();
  }

  get ping(): number {
    return this.interaction.client.ws.ping;
  }

  get createdTimestamp(): number {
    return this.interaction.createdTimestamp;
  }

  async deferReply(): Promise<IMessage> {
    const message = await this.interaction.deferReply({ fetchReply: true });
    if (!(message instanceof Message)) {
      throw new InternalBotError('Ocurrió un error al diferir la respuesta.');
    }
    return new YADBMessage(message);
  }

  async reply(reply: IReplyMessage): Promise<void> {
    return this.interaction.reply(reply);
  }

  async replyAndFetch(reply: IReplyMessage): Promise<IMessage> {
    const message = await this.interaction.reply({ ...reply, fetchReply: true });
    if (!(message instanceof Message)) {
      throw new InternalBotError('Ocurrió un error al obtener la respuesta enviada.');
    }
    return new YADBMessage(message);
  }

  async editReply(reply: IReplyMessage): Promise<void> {
    await this.interaction.editReply(reply);
  }

  async followUp(reply: IReplyMessage): Promise<void> {
    await this.interaction.followUp(reply);
  }
}
