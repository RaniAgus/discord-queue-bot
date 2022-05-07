import { MessageButton } from 'discord.js';
import { InternalBotError } from '../exceptions/internal-bot.error';
import { mentionUserReply } from '../replies/mention-user.reply';
import { IButtonHandler } from '../models/core/button-handler.model';
import { IButtonInteraction } from '../models/core/button-interaction.model';

export const mentionUser: IButtonHandler = {
  get data(): MessageButton {
    return new MessageButton()
      .setCustomId('mentionUser')
      .setLabel('Avisar')
      .setStyle('PRIMARY')
      .setEmoji('🔔');
  },
  hasPermissions({ member }: IButtonInteraction): boolean {
    return member !== null && member.isAdmin;
  },
  async handle({ message, interaction, app }: IButtonInteraction): Promise<void> {
    if (message === null) {
      throw new InternalBotError('Ocurrió un error al intentar realizar la mención.');
    }

    const [tag] = message.mentionedMembers;
    if (!tag) {
      throw new InternalBotError('No se encontró a nadie a quien mencionar.');
    }

    return interaction.reply(mentionUserReply({ tag, buttons: app.buttons }));
  },
};
