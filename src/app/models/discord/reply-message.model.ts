import {
  EmbedBuilder,
  AttachmentBuilder,
  InteractionUpdateOptions,
  InteractionReplyOptions,
  ActionRowBuilder,
  APIMessageActionRowComponent,
  APIActionRowComponent,
  MessageActionRowComponentBuilder,
} from 'discord.js';

export interface BotReplyMessage {
  content?: string | null;
  ephemeral?: boolean;
  embeds?: EmbedBuilder[];
  components?: APIActionRowComponent<APIMessageActionRowComponent>[];
  files?: AttachmentBuilder[];
}

export class BotReplyMessageBuilder
implements InteractionReplyOptions, InteractionUpdateOptions {
  content?: string | null;

  ephemeral?: boolean;

  embeds: EmbedBuilder[];

  components: APIActionRowComponent<APIMessageActionRowComponent>[];

  files: AttachmentBuilder[];

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

  setEmbed(embed: EmbedBuilder): this {
    this.embeds = [embed];
    return this;
  }

  setComponents(components: MessageActionRowComponentBuilder[]): this {
    if (components.length > 0) {
      this.components = [
        new ActionRowBuilder<MessageActionRowComponentBuilder>()
          .setComponents(components)
          .toJSON(),
      ];
    } else {
      this.components = [];
    }
    return this;
  }
}
