import { Client, GatewayIntentBits } from 'discord.js';
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
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [],
});

export const logger = new LogChannel();

export const groupService = new GroupService();

export const queueService = new QueueService({
  buttons: buttons.mapValues((h) => h.data),
  logger,
  groupService,
});

export const app: App = {
  client,
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
  await deployCommands(client);
  client.login(env.DISCORD_TOKEN);
})();
