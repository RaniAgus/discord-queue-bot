import { ButtonStyle, ButtonBuilder } from 'discord.js';
import { BotButtonHandler } from '../../models/core/button-handler.model';
import { BotButtonInteraction } from '../../models/core/button-interaction.model';
import { selectScheduleReply } from '../../replies/select-schedule.reply';

export const addGroup: BotButtonHandler = {
  get data(): ButtonBuilder {
    return new ButtonBuilder()
      .setCustomId('addGroup')
      .setLabel('Entrar')
      .setStyle(ButtonStyle.Primary)
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
