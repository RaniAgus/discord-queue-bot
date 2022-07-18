import {
  MessageEmbed,
  MessageActionRow,
  MessageAttachment,
  MessageButton,
  MessageSelectMenu,
  MessageActionRowComponentResolvable,
} from 'discord.js';

export interface BotReplyMessage {
  content?: string | null;
  ephemeral?: boolean;
  embeds?: MessageEmbed[];
  components?: MessageActionRow[];
  files?: MessageAttachment[];
}

export class BotReplyMessageBuilder implements BotReplyMessage {
  content?: string | null;

  ephemeral?: boolean;

  embeds: MessageEmbed[];

  components: MessageActionRow[];

  files: MessageAttachment[];

  constructor(options?: BotReplyMessage) {
    this.content = options?.content;
    this.ephemeral = options?.ephemeral;
    this.embeds = options?.embeds ?? [];
    this.components = options?.components ?? [];
    this.files = options?.files ?? [];
  }

  setContent(content: string): this {
    this.content = content.length > 0 ? content : null;
    return this;
  }

  setEphemeral(ephemeral: boolean): this {
    this.ephemeral = ephemeral;
    return this;
  }

  addEmbed(embed: MessageEmbed): this {
    this.embeds.push(embed);
    return this;
  }

  addButtonsRow(buttons: MessageButton[]): this {
    this.addComponents(buttons);
    return this;
  }

  addSelectMenuRow(selects: MessageSelectMenu[]): this {
    this.addComponents(selects);
    return this;
  }

  private addComponents(components: MessageActionRowComponentResolvable[]) {
    if (components.length > 0) {
      this.components.push(new MessageActionRow().addComponents(components));
    }
  }
}
