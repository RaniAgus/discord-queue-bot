import { Client, Routes } from 'discord.js';
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

export async function deployCommands(client: Client) {
  client.rest.setToken(env.DISCORD_TOKEN);
  await client.rest.put(
    Routes.applicationGuildCommands(env.APPLICATION_ID, env.GUILD_ID),
    { body: commands.map((h) => h.data) },
  );
}
