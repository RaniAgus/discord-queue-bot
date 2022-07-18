import { SlashCommandBuilder } from '@discordjs/builders';
import { fetchQueueReply } from '../../replies/queue.reply';
import { SupportQueue } from '../../models/queue/support-queue.model';
import { BotCommandHandler } from '../../models/core/command-handler.model';
import { BotCommandInteraction } from '../../models/core/command-interaction.model';
import { QueueType } from '../../models/queue/queue.model';
import { LaboQueue } from '../../models/queue/labo-queue.model';

export const queue: BotCommandHandler = {
  get data() {
    return new SlashCommandBuilder()
      .setName('queue')
      .setDescription('Crea una nueva fila')
      .addStringOption((option) => option
        .setName('type')
        .setDescription('Tipo de fila')
        .setRequired(true)
        .setChoices(
          { name: 'Individual', value: 'SUPPORT' },
          { name: 'Grupal', value: 'LABORATORY' },
        ))
      .addStringOption((option) => option
        .setName('name')
        .setDescription('Nombre de la fila')
        .setRequired(true));
  },
  hasPermissions({ member }: BotCommandInteraction): boolean {
    return member !== null && member.isAdmin;
  },
  async handle({ interaction, params, app }: BotCommandInteraction) {
    const name = params.getString('name');
    const type = params.getString('type') as QueueType;
    const reply = await interaction.deferReply();

    await reply.createThread({ name });

    const options = { id: reply.id, name, members: [] };
    const createdQueue = type === 'SUPPORT'
      ? new SupportQueue(options)
      : new LaboQueue({ ...options, schedules: await app.groupService.getLaboSchedules() });
    app.queueService.put(createdQueue, reply);

    return interaction.editReply(fetchQueueReply({
      buttons: app.buttons,
      queue: createdQueue,
    }));
  },
};
