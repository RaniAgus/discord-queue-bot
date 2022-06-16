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

export const YADBCommandInteractionFactory = (
  commandInteraction: CommandInteraction,
  app: IApp,
): ICommandInteraction => ({
  app,
  interaction: new YADBInteraction(commandInteraction),
  params: new YADBCommandParams(commandInteraction.options),
  textChannel: commandInteraction.channel !== null
    ? new YADBTextChannel(commandInteraction.channel) : null,
  member: commandInteraction.member instanceof GuildMember
    ? new YADBGuildMember(commandInteraction.member) : null,
});
