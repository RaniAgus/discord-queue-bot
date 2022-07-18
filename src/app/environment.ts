import dotenv from 'dotenv';

dotenv.config();

const getenv = (variable: string): string => process.env[variable] || (() => {
  throw Error(`Falta configurar la variable de entorno ${variable}.`);
})();

export const env = {
  DISCORD_TOKEN: getenv('DISCORD_TOKEN'),
  APPLICATION_ID: getenv('APPLICATION_ID'),
  GUILD_ID: getenv('GUILD_ID'),
  LOG_CHANNEL_ID: getenv('LOG_CHANNEL_ID'),
  ADMIN_ROLES: getenv('ADMIN_ROLES').split('|'),
  GROUPS_URL: 'https://gist.githubusercontent.com/RaniAgus/b5515a46083dab341a09de04ccf7c4a2/raw/3fde2bd41738074187c1cb2a9cc11dce123e6ce2/grupos.json',
  UTC_OFFSET: process.env.UTC_OFFSET || '-03:00',
};
