import { MessageButton } from 'discord.js';
import { BotButtonHandler } from '../../models/core/button-handler.model';
import { BotButtonInteraction } from '../../models/core/button-interaction.model';

export const next: BotButtonHandler = {
  get data(): MessageButton {
    return new MessageButton()
      .setCustomId('next')
      .setLabel('Siguiente')
      .setStyle('PRIMARY')
      .setEmoji('⏭️');
  },
  hasPermissions({ member }: BotButtonInteraction): boolean {
    return member !== null && member.isAdmin;
  },
  async handle({ app, message, interaction }: BotButtonInteraction): Promise<void> {
    const queue = await app.queueService.get(message);
    const reply = queue.next(app.buttons);

    return interaction.reply(reply);
  },
};
