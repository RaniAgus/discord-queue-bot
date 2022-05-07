import { SlashCommandBuilder } from '@discordjs/builders';
import { queueReply } from '../replies/queue.reply';
import { YADBQueue } from '../models/queue/queue.model';
import { ICommandHandler } from '../models/core/command-handler.model';
import { ICommandInteraction } from '../models/core/command-interaction.model';

export const queue: ICommandHandler = {
  get data() {
    return new SlashCommandBuilder()
      .setName('queue')
      .setDescription('Crea una nueva fila')
      .addStringOption((option) => option
        .setName('name')
        .setDescription('Nombre de la fila')
        .setRequired(true));
  },
  hasPermissions({ member }: ICommandInteraction): boolean {
    return member !== null && member.isAdmin;
  },
  async handle({ interaction, params, app }: ICommandInteraction) {
    const name = params.getString('name');
    const reply = await interaction.deferReply();

    await reply.createThread({ name });
    const newQueue = new YADBQueue({ id: reply.id, name });
    app.queues.put(newQueue, reply);

    return interaction.editReply(queueReply({
      buttons: app.buttons,
      queue: newQueue,
      withAttachment: true,
    }));
  },
};
