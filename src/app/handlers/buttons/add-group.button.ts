import { MessageButton } from 'discord.js';
import { BotButtonHandler } from '../../models/core/button-handler.model';
import { BotButtonInteraction } from '../../models/core/button-interaction.model';
import { selectScheduleReply } from '../../replies/select-schedule.reply';

export const addGroup: BotButtonHandler = {
  get data(): MessageButton {
    return new MessageButton()
      .setCustomId('addGroup')
      .setLabel('Entrar')
      .setStyle('SUCCESS')
      .setEmoji('▶️');
  },
  hasPermissions(_: BotButtonInteraction): boolean {
    return true;
  },
  async handle({ interaction, app }: BotButtonInteraction): Promise<void> {
    return interaction.reply(selectScheduleReply({
      selects: app.selects, schedules: await app.groupService.getSchedules(),
    }));
  },
};
