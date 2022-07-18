import { CommandInteraction, GuildMember } from 'discord.js';
import { App } from './app.model';
import { BotInteraction } from '../discord/interaction.model';
import { BotCommandParams } from './command-params.model';
import { BotTextChannel } from '../discord/text-channel.model';
import { BotGuildMember } from '../discord/guild-member.model';
import { BotBaseInteraction } from './base-interaction.model';

export class BotCommandInteraction implements BotBaseInteraction {
  constructor(
    public app: App,
    public interaction: BotInteraction,
    public member: BotGuildMember | null,
    public textChannel: BotTextChannel | null,
    public params: BotCommandParams,
  ) {}

  static of = (
    commandInteraction: CommandInteraction,
    app: App,
  ): BotCommandInteraction => ({
    app,
    interaction: new BotInteraction(commandInteraction),
    params: new BotCommandParams(commandInteraction.options),
    member: commandInteraction.member instanceof GuildMember
      ? new BotGuildMember(commandInteraction.member) : null,
    textChannel: commandInteraction.channel !== null
      ? new BotTextChannel(commandInteraction.channel) : null,
  });
}
