import { SlashCommandBuilder } from 'discord.js';
import { InternalBotError } from '../../exceptions/internal-bot.error';
import { memberAddedReply } from '../../replies/member-added.reply';
import { BotCommandHandler } from '../../models/core/command-handler.model';
import { BotCommandInteraction } from '../../models/core/command-interaction.model';
import { QueueMember } from '../../models/queue/queue-member.model';
import { getCurrentTime } from '../../utils/time';

export const add: BotCommandHandler = {
  get data() {
    return new SlashCommandBuilder()
      .setName('add')
      .setDescription('Agrega a alguien más a una fila activa')
      .addStringOption((option) => option
        .setName('queue-id')
        .setDescription('El id del mensaje correspondiente a la fila')
        .setRequired(true))
      .addUserOption((option) => option
        .setName('member')
        .setDescription('A quién agregar a la fila')
        .setRequired(true));
  },
  hasPermissions({ member }: BotCommandInteraction): boolean {
    return member !== null && member.isAdmin;
  },
  async handle({
    interaction, textChannel, params, app,
  }: BotCommandInteraction): Promise<void> {
    if (textChannel === null) {
      throw new InternalBotError('Ocurrió un error al intentar agregarle a la fila.');
    }

    const message = await textChannel.fetchMessage(params.getString('queue-id'));
    const queue = await app.queueService.get(message);
    const queueMember = new QueueMember(params.getMember('member'), getCurrentTime());

    queue.add(queueMember);
    message.sendToThread(memberAddedReply({ queue, queueMember }));

    return interaction.reply({
      content: `Agregaste a ${queueMember.member.tag} a la fila ${queue.name} con éxito.`,
      ephemeral: true,
    });
  },
};
