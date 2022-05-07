import { APIEmbed, APIEmbedField } from 'discord-api-types/v9';
import {
  EmbedField,
  Guild,
  Message,
  MessageActionRowComponent,
  MessageEmbed,
  MessageMentions,
  StartThreadOptions,
  ThreadChannel,
} from 'discord.js';
import { InternalBotError } from '../../exceptions/internal-bot.error';
import { YADBCollection } from '../collection.model';
import { IGuildMember, YADBGuildMember } from './guild-member.model';
import { IReplyMessage } from './reply-message.model';

export interface IMessage {
  id: string
  createdTimestamp: number
  content: string
  mentionedMembers: string[]
  createThread: (options: StartThreadOptions) => Promise<ThreadChannel>
  sendToThread: (message: IReplyMessage) => Promise<Message<boolean>>
  edit: (reply: IReplyMessage) => Promise<IMessage>
  getEmbedField: (index: number) => EmbedField | APIEmbedField
  fetchGuildMember: (id: string) => Promise<IGuildMember>
  isActionDisabled: (customId: string) => boolean
  delete: () => Promise<Message<boolean>>
}

export class YADBMessage implements IMessage {
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
    return this.message.content.match(MessageMentions.USERS_PATTERN)?.map((s) => s) || [];
  }

  createThread(options: StartThreadOptions): Promise<ThreadChannel> {
    return this.message.startThread(options);
  }

  sendToThread(message: IReplyMessage): Promise<Message<boolean>> {
    return this.thread.send(message);
  }

  async edit(reply: IReplyMessage): Promise<IMessage> {
    return this.message.edit(reply).then((m) => new YADBMessage(m));
  }

  getEmbedField(index: number): EmbedField | APIEmbedField {
    if (!this.embed.fields || !this.embed.fields[index]) {
      throw new InternalBotError(`No se encontró el campo nro. ${index} del embed del mensaje #${this.id}.`);
    }
    return this.embed.fields[index];
  }

  async fetchGuildMember(id: string): Promise<IGuildMember> {
    let member = this.guild.members.cache.get(id);
    member ??= await this.guild.members.fetch(id);
    if (!member) {
      throw new InternalBotError(`No se pudo encontrar a #${id} en el servidor #${this.guild.id}.`);
    }
    return new YADBGuildMember(member);
  }

  isActionDisabled(customId: string): boolean {
    return this.actions.get(customId).disabled;
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

  private get embed(): MessageEmbed | APIEmbed {
    const [embed] = this.message.embeds;
    if (!embed) {
      throw new InternalBotError(`El mensaje #${this.id} no posee ningún embed.`);
    }
    return embed;
  }

  private get actions(): YADBCollection<MessageActionRowComponent> {
    const actions = new YADBCollection<MessageActionRowComponent>();
    this.message.components.forEach((actionRow) => {
      actionRow.components.forEach((action) => {
        if (action.customId !== null) {
          actions.set(action.customId, action);
        }
      });
    });

    return actions;
  }
}
