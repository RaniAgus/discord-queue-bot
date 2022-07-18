import { GuildMember, ModalSubmitInteraction } from 'discord.js';
import { BotGuildMember } from '../discord/guild-member.model';
import { BotInteraction } from '../discord/interaction.model';
import { BotTextChannel } from '../discord/text-channel.model';
import { App } from './app.model';
import { BotBaseInteraction } from './base-interaction.model';
import { BotModalFields } from './modal-fields.model';

export class BotModalInteraction implements BotBaseInteraction {
  constructor(
    public app: App,
    public interaction: BotInteraction,
    public member: BotGuildMember | null,
    public fields: BotModalFields,
    public textChannel: BotTextChannel | null,
  ) {}

  static of(modalInteraction: ModalSubmitInteraction, app: App): BotModalInteraction {
    return {
      app,
      member: modalInteraction.member instanceof GuildMember
        ? new BotGuildMember(modalInteraction.member) : null,
      interaction: new BotInteraction(modalInteraction),
      fields: new BotModalFields(modalInteraction.fields),
      textChannel: modalInteraction.channel !== null
        ? new BotTextChannel(modalInteraction.channel) : null,
    };
  }
}
