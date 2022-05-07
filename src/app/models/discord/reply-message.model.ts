import {
  MessageEmbed, MessageActionRow, MessageAttachment, MessageButton,
} from 'discord.js';

export interface IReplyMessage {
  content?: string | null;
  ephemeral?: boolean;
  embeds?: MessageEmbed[];
  components?: MessageActionRow[];
  files?: MessageAttachment[];
}

export class YADBReplyMessage implements IReplyMessage {
  content?: string | null;

  ephemeral?: boolean;

  embeds: MessageEmbed[] = [];

  components: MessageActionRow[];

  files: MessageAttachment[];

  public constructor(options?: IReplyMessage) {
    this.content = options?.content;
    this.ephemeral = options?.ephemeral;
    this.embeds = options?.embeds ?? [];
    this.components = options?.components ?? [];
    this.files = options?.files ?? [];
  }

  public setContent(content: string): this {
    this.content = content.length > 0 ? content : null;
    return this;
  }

  public setEphemeral(ephemeral: boolean): this {
    this.ephemeral = ephemeral;
    return this;
  }

  public addEmbed(embed: MessageEmbed): this {
    this.embeds.push(embed);
    return this;
  }

  public addButtonsRow(buttons: MessageButton[]): this {
    this.components.push(new MessageActionRow().addComponents(buttons));
    return this;
  }

  public addAttachment(attachment: string, name?: string): this {
    this.files.push(new MessageAttachment(attachment, name));
    return this;
  }
}
