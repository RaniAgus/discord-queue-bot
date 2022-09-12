import {
  ButtonInteraction, CommandInteraction, Message, ModalBuilder, ModalSubmitInteraction,
} from 'discord.js';
import { InternalBotError } from '../../exceptions/internal-bot.error';
import { BotMessage } from './guild-message.model';
import { BotReplyMessage } from './reply-message.model';

export class BotInteraction {
  constructor(
    private interaction: ButtonInteraction | CommandInteraction | ModalSubmitInteraction,
  ) {}

  get isInGuild(): boolean {
    return this.interaction.inGuild();
  }

  get ping(): number {
    return this.interaction.client.ws.ping;
  }

  get createdTimestamp(): number {
    return this.interaction.createdTimestamp;
  }

  async deferReply(): Promise<BotMessage> {
    return this.interaction.deferReply({ fetchReply: true })
      .then((message) => new BotMessage(message));
  }

  async reply(reply: BotReplyMessage): Promise<void> {
    await this.interaction.reply(reply);
  }

  async replyAndFetch(reply: BotReplyMessage): Promise<BotMessage> {
    const message = await this.interaction.reply({ ...reply, fetchReply: true });
    if (!(message instanceof Message)) {
      throw new InternalBotError('Ocurrió un error al obtener la respuesta enviada.');
    }
    return new BotMessage(message);
  }

  async editReply(reply: BotReplyMessage): Promise<void> {
    await this.interaction.editReply(reply);
  }

  async followUp(reply: BotReplyMessage): Promise<void> {
    await this.interaction.followUp(reply);
  }

  async showModal(modal: ModalBuilder): Promise<void> {
    if (this.interaction instanceof ModalSubmitInteraction) {
      throw new InternalBotError('¡No puede mostrarse un modal sobre otro!');
    }
    return this.interaction.showModal(modal);
  }
}
