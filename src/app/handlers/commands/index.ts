import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/rest/v9';
import { Dictionary } from '../../models/collection.model';
import { add } from './add.command';
import { BotCommandHandler } from '../../models/core/command-handler.model';
import { ping } from './ping.command';
import { queue } from './queue.command';
import { groups } from './groups.command';
import { env } from '../../environment';

export const commands = new Dictionary<BotCommandHandler>({
  add,
  groups,
  ping,
  queue,
});

export async function deployCommands(rest: REST) {
  return rest.put(
    Routes.applicationGuildCommands(env.APPLICATION_ID, env.GUILD_ID),
    { body: commands.map((h) => h.data) },
  );
}
