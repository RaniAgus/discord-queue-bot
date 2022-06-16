import { Routes } from 'discord-api-types/rest/v9';
import { Interaction } from 'discord.js';
import {
  client, rest, commands, app, buttons, logger,
} from './app';
import env from './app/environment';
import { InternalBotError } from './app/exceptions/internal-bot.error';
import { LayerEightError } from './app/exceptions/layer-eight.error';
import { errorReplyContentForUser } from './app/replies/error.reply';
import { IReplyMessage, YADBReplyMessage } from './app/models/discord/reply-message.model';
import { getCurrentTime } from './app/utils/time';
import { YADBButtonInteractionFactory } from './app/models/core/button-interaction.model';
import { YADBCommandInteractionFactory } from './app/models/core/command-interaction.model';

client.once('ready', async () => {
  const channel = await client.channels.fetch(env.LOG_CHANNEL_ID);
  if (!channel?.isText()) {
    throw new InternalBotError(`No se encontró o no es válido el canal: ${env.LOG_CHANNEL_ID}.`);
  }

  logger.setChannel(channel);
  client.user?.setActivity('Finite State Machine', { type: 'PLAYING' });
  logger.log(
    `##### [${getCurrentTime().format('DD/MM/YY hh:mm:ss')}] `
    + `¡Iniciado como "${client.user?.username}"! #####`,
    'markdown',
  );
});

client.on('interactionCreate', async (interaction: Interaction) => {
  if (!interaction.isButton() && !interaction.isCommand()) {
    return;
  }

  try {
    if (interaction.isButton()) {
      const handler = buttons.get(interaction.customId);
      const bi = await YADBButtonInteractionFactory(interaction, app);
      if (!handler.hasPermissions(bi)) {
        throw new LayerEightError(
          `${bi.member?.nickname}, no contás con permisos suficientes para usar este botón.`,
        );
      }

      await handler.handle(bi);
    } else if (interaction.isCommand()) {
      const handler = commands.get(interaction.commandName);
      const ci = YADBCommandInteractionFactory(interaction, app);
      if (!handler.hasPermissions(ci)) {
        throw new LayerEightError(
          `${ci.member?.nickname}, no contás con permisos suficientes para usar este comando.`,
        );
      }

      await handler.handle(ci);
    }
  } catch (error) {
    const reply: IReplyMessage = new YADBReplyMessage()
      .setContent(errorReplyContentForUser(error))
      .setEphemeral(true);

    interaction.reply(reply).catch(() => interaction.followUp(reply));
    logger.logError(error);
  }
});

rest.put(
  Routes.applicationGuildCommands(env.APPLICATION_ID, env.GUILD_ID),
  { body: commands.map((h) => h.data) },
).then(() => client.login(env.DISCORD_TOKEN));
