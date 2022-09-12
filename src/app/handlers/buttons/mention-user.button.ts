import { ButtonStyle, ButtonBuilder } from 'discord.js';
import { InternalBotError } from '../../exceptions/internal-bot.error';
import { mentionUserReply } from '../../replies/mention-user.reply';
import { BotButtonHandler } from '../../models/core/button-handler.model';
import { BotButtonInteraction } from '../../models/core/button-interaction.model';

export const mentionUser: BotButtonHandler = {
  get data(): ButtonBuilder {
    return new ButtonBuilder()
      .setCustomId('mentionUser')
      .setLabel('Avisar')
      .setStyle(ButtonStyle.Primary)
      .setEmoji('🔔');
  },
  hasPermissions({ member }: BotButtonInteraction): boolean {
    return member !== null && member.isAdmin;
  },
  async handle({ message, interaction, app }: BotButtonInteraction): Promise<void> {
    const [tag] = message.mentionedMembers;
    if (!tag) {
      throw new InternalBotError('No se encontró a nadie a quien mencionar.');
    }

    return interaction.reply(mentionUserReply({ tag, buttons: app.buttons }));
  },
};
