import { SelectMenuBuilder } from 'discord.js';
import { BotSelectHandler } from '../../models/core/select-handler.model';
import { BotSelectInteraction } from '../../models/core/select-interaction.model';
import { selectGroupReply } from '../../replies/select-group.reply';

export const schedule: BotSelectHandler = {
  get data(): SelectMenuBuilder {
    return new SelectMenuBuilder()
      .setCustomId('schedule')
      .setPlaceholder('Seleccionar horario asignado...');
  },
  hasPermissions(_: BotSelectInteraction): boolean {
    return true;
  },
  async handle(
    { interaction, app, values: [assignedSchedule] }: BotSelectInteraction,
  ): Promise<void> {
    await interaction.update(selectGroupReply({
      selects: app.selects,
      groups: await app.groupService.getGroupOptions(assignedSchedule),
    }));
  },
};
