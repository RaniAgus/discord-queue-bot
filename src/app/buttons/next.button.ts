import { MessageButton } from 'discord.js';
import { InternalBotError } from '../exceptions/internal-bot.error';
import { queueNextReply } from '../replies/queue-next.reply';
import { IButtonHandler } from '../models/core/button-handler.model';
import { IButtonInteraction } from '../models/core/button-interaction.model';

export const next: IButtonHandler = {
  get data(): MessageButton {
    return new MessageButton()
      .setCustomId('next')
      .setLabel('Siguiente')
      .setStyle('PRIMARY')
      .setEmoji('⏭️');
  },
  hasPermissions({ member }: IButtonInteraction): boolean {
    return member !== null && member.isAdmin;
  },
  async handle({ app, message, interaction }: IButtonInteraction): Promise<void> {
    if (message === null) {
      throw new InternalBotError('Ocurrió un error al intentar obtener al siguiente en la fila.');
    }

    const queue = await app.queues.get(message);
    const { member } = queue.next();

    return interaction.reply(queueNextReply({ buttons: app.buttons, member }));
  },
};
