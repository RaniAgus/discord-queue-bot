import { Client, Intents } from 'discord.js';
import { REST } from '@discordjs/rest';
import { env } from './app/environment';
import { handleReady } from './app/handlers/ready.handler';
import {
  buttons,
  deployCommands,
  handleInteractionCreate,
  modals,
  selects,
} from './app/handlers/interaction-create.handler';
import { App } from './app/models/core/app.model';
import { LogChannel } from './app/models/logger.model';
import { GroupService } from './app/models/queue/group.service';
import { QueueService } from './app/models/queue/queue.service';

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

export const logger = new LogChannel();

export const groupService = new GroupService();

export const queueService = new QueueService({
  buttons: buttons.mapValues((h) => h.data),
  logger,
  groupService,
});

export const app: App = {
  client,
  rest,
  logger,
  queueService,
  groupService,
  buttons: buttons.mapValues((b) => b.data),
  modals: modals.mapValues((m) => m.data),
  selects: selects.mapValues((s) => s.data),
};

(async () => {
  client.on('ready', () => handleReady(client, logger));
  client.on('interactionCreate', (interaction) => handleInteractionCreate(logger, app, interaction));
  await deployCommands(rest);
  client.login(env.DISCORD_TOKEN);
})();
