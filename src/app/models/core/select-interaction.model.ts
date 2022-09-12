import { GuildMember, SelectMenuInteraction } from 'discord.js';
import { BotGuildMember } from '../discord/guild-member.model';
import { BotMessage } from '../discord/guild-message.model';
import { App } from './app.model';
import { BotBaseInteraction } from './base-interaction.model';

export class BotSelectInteraction implements BotBaseInteraction {
  constructor(
    public app: App,
    public interaction: SelectMenuInteraction,
    public member: BotGuildMember | null,
    public reference: BotMessage | null,
    public values: string[],
  ) {}

  static async of(selInteraction: SelectMenuInteraction, app: App): Promise<BotSelectInteraction> {
    return ({
      app,
      interaction: selInteraction,
      member: selInteraction.member instanceof GuildMember
        ? new BotGuildMember(selInteraction.member) : null,
      reference: new BotMessage(await selInteraction.message.fetchReference()),
      values: selInteraction.values,
    });
  }
}
