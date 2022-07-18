import { Client } from 'discord.js';
import { env } from '../environment';
import { InternalBotError } from '../exceptions/internal-bot.error';
import { LogChannel } from '../models/logger.model';
import { getCurrentTime } from '../utils/time';

export async function handleReady(client: Client, logger: LogChannel) {
  const channel = await client.channels.fetch(env.LOG_CHANNEL_ID);
  if (!channel?.isText()) {
    throw new InternalBotError(`No se encontró o no es válido el canal: ${env.LOG_CHANNEL_ID}.`);
  }

  logger.setChannel(channel);
  await logger.log(
    `##### [${getCurrentTime().format('DD/MM/YY hh:mm:ss')}] `
    + `¡Iniciado como "${client.user?.username}"! #####`,
    'markdown',
  );
}
