import dotenv from 'dotenv';

dotenv.config();

const getenv = (variable: string): string => process.env[variable] || (() => {
  throw Error(`Falta configurar la variable de entorno ${variable}.`);
})();

export default {
  DISCORD_TOKEN: getenv('DISCORD_TOKEN'),
  APPLICATION_ID: getenv('APPLICATION_ID'),
  GUILD_ID: getenv('GUILD_ID'),
  LOG_CHANNEL_ID: getenv('LOG_CHANNEL_ID'),
  ADMIN_ROLES: getenv('ADMIN_ROLES').split('|'),
  UTC_OFFSET: process.env.UTC_OFFSET || '-03:00',
};
