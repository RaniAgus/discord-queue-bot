import { SlashCommandBuilder } from '@discordjs/builders';
import { InternalBotError } from '../exceptions/internal-bot.error';
import { memberAddedReply } from '../replies/member-added.reply';
import { ICommandHandler } from '../models/core/command-handler.model';
import { ICommandInteraction } from '../models/core/command-interaction.model';

export const add: ICommandHandler = {
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
  hasPermissions({ member }: ICommandInteraction): boolean {
    return member !== null && member.isAdmin;
  },
  async handle({
    interaction, textChannel, params, app,
  }: ICommandInteraction): Promise<void> {
    if (textChannel === null) {
      throw new InternalBotError('Ocurrió un error al intentar agregarle a la fila.');
    }

    const message = await textChannel.fetchMessage(params.getString('queue-id'));
    const queue = await app.queues.get(message);
    const member = params.getMember('member');

    queue.add(member);
    message.sendToThread(memberAddedReply({ queue, member }));

    return interaction.reply({
      content: `Agregaste a ${member.tag} a la fila ${queue.name} con éxito.`,
      ephemeral: true,
    });
  },
};
