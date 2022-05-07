import { ToAPIApplicationCommandOptions } from '@discordjs/builders';
import { ICommandInteraction } from './command-interaction.model';

export type Command = {
  name: string;
  description: string;
  options: ToAPIApplicationCommandOptions[];
  defaultPermission: boolean | undefined;
};

export interface ICommandHandler {
  data: Command
  hasPermissions(interaction: ICommandInteraction): boolean
  handle(interaction: ICommandInteraction): Promise<void>
}
