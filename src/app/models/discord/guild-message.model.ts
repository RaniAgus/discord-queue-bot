import {
  EmbedField,
  Guild,
  Message,
  MessageActionRowComponent,
  MessageMentions,
  StartThreadOptions,
  ThreadChannel,
  APIEmbedField,
  Embed,
} from 'discord.js';
import { InternalBotError } from '../../exceptions/internal-bot.error';
import { Dictionary } from '../collection.model';
import { BotGuildMember } from './guild-member.model';
import { BotReplyMessage } from './reply-message.model';

export class BotMessage {
  constructor(private message: Message<boolean>) {}

  get id(): string {
    return this.message.id;
  }

  get createdTimestamp(): number {
    return this.message.createdTimestamp;
  }

  get content(): string {
    return this.message.content;
  }

  get mentionedMembers(): string[] {
    return this.message.content.match(MessageMentions.UsersPattern)?.map((s) => s) || [];
  }

  createThread(options: StartThreadOptions): Promise<ThreadChannel> {
    return this.message.startThread(options);
  }

  sendToThread(message: BotReplyMessage): Promise<Message<boolean>> {
    return this.thread.send(message);
  }

  async edit(reply: BotReplyMessage): Promise<BotMessage> {
    return this.message.edit(reply)
      .then((m) => new BotMessage(m));
  }

  getEmbedAuthor(): string {
    return this.embed.author?.name ?? '';
  }

  getEmbedFields(): EmbedField[] | APIEmbedField[] {
    if (!this.embed.fields || this.embed.fields.length === 0) {
      throw new InternalBotError('El mensaje no tiene ningún contenido embebido.');
    }
    return this.embed.fields;
  }

  async fetchGuildMember(id: string): Promise<BotGuildMember> {
    let member = this.guild.members.cache.get(id);
    member ??= await this.guild.members.fetch(id);
    if (!member) {
      throw new InternalBotError(`No se pudo encontrar a #${id} en el servidor #${this.guild.id}.`);
    }
    return new BotGuildMember(member);
  }

  isActionDisabled(customId: string): boolean {
    return this.actions.get(customId).disabled ?? false;
  }

  delete(): Promise<Message<boolean>> {
    return this.message.delete();
  }

  private get thread(): ThreadChannel {
    if (this.message.thread === null) {
      throw new InternalBotError(`No se pudo obtener un hilo para el mensaje #${this.id}.`);
    }
    return this.message.thread;
  }

  private get guild(): Guild {
    const { guild } = this.message;
    if (guild === null) {
      throw new InternalBotError(`No se pudo obtener el servidor del mensaje #${this.id}.`);
    }
    return guild;
  }

  private get embed(): Embed {
    const [embed] = this.message.embeds;
    if (!embed) {
      throw new InternalBotError(`El mensaje #${this.id} no posee ningún embed.`);
    }
    return embed;
  }

  private get actions(): Dictionary<MessageActionRowComponent> {
    const actions = new Dictionary<MessageActionRowComponent>();
    this.message.components.forEach((actionRow) => actionRow.components
      .forEach((action) => action.customId && actions.set(action.customId, action)));

    return actions;
  }
}
