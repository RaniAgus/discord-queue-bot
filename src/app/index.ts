import { REST } from '@discordjs/rest';
import { Client, Intents } from 'discord.js';
import { YADBQueueRepository } from './models/queue/queue-repository.model';
import { YADBLogger } from './models/logger.model';
import env from './environment';
import { buttons } from './buttons';
import { IApp } from './models/core/app.model';

export { buttons } from './buttons';
export { commands } from './commands';

export const logger = new YADBLogger();

export const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGES,
  ],
  partials: [],
});

export const rest = new REST({ version: '9' }).setToken(env.DISCORD_TOKEN);

export const queues = new YADBQueueRepository({
  buttons: buttons.mapValues((h) => h.data),
  logger,
});

export const app: IApp = {
  logger,
  client,
  rest,
  queues,
  buttons: buttons.mapValues((b) => b.data),
};
