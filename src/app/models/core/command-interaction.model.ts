import { CommandInteraction, GuildMember } from 'discord.js';
import { IApp } from './app.model';
import { IInteraction, YADBInteraction } from '../discord/interaction.model';
import { ICommandParams, YADBCommandParams } from './command-params.model';
import { ITextChannel, YADBTextChannel } from '../discord/text-channel.model';
import { IGuildMember, YADBGuildMember } from '../discord/guild-member.model';

export interface ICommandInteraction {
  app: IApp
  interaction: IInteraction
  textChannel: ITextChannel | null
  member: IGuildMember | null
  params: ICommandParams
}

export class YADBCommandInteractionBuilder {
  constructor(
    private commandInteraction: CommandInteraction,
    private app: IApp,
  ) {}

  build(): ICommandInteraction {
    const interaction = new YADBInteraction(this.commandInteraction);
    const params = new YADBCommandParams(this.commandInteraction.options);
    const textChannel = this.commandInteraction.channel !== null
      ? new YADBTextChannel(this.commandInteraction.channel) : null;
    const member = this.commandInteraction.member instanceof GuildMember
      ? new YADBGuildMember(this.commandInteraction.member) : null;

    return {
      app: this.app,
      interaction,
      params,
      member,
      textChannel,
    };
  }
}
