import { SlashCommandBuilder } from 'discord.js';
import { markdown, stringify } from '../../utils/string';
import { BotCommandHandler } from '../../models/core/command-handler.model';
import { BotCommandInteraction } from '../../models/core/command-interaction.model';

export const ping: BotCommandHandler = {
  get data() {
    return new SlashCommandBuilder()
      .setName('ping')
      .setDescription('Responde el ping y la latencia del bot en milisegundos');
  },
  hasPermissions(_: BotCommandInteraction): boolean {
    return true;
  },
  async handle({ interaction }: BotCommandInteraction) {
    const text = `${interaction.ping}ms`;

    const reply = await interaction.replyAndFetch({
      content: markdown(stringify({ ping: text }), 'json'),
      ephemeral: true,
    });

    const latency = `${reply.createdTimestamp - interaction.createdTimestamp}ms`;

    return interaction.editReply({
      content: markdown(stringify({ ping: text, latency }), 'json'),
      ephemeral: true,
    });
  },
};
