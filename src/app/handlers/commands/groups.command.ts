import { SlashCommandBuilder } from '@discordjs/builders';
import { BotCommandHandler } from '../../models/core/command-handler.model';
import { BotCommandInteraction } from '../../models/core/command-interaction.model';
import { groupsLoadedReply } from '../../replies/groups-loaded.reply';

export const groups: BotCommandHandler = {
  get data() {
    return new SlashCommandBuilder()
      .setName('groups')
      .setDescription('Permite recargar la lista de grupos anotados a un checkpoint/entrega.');
  },
  hasPermissions({ member }: BotCommandInteraction): boolean {
    return member !== null && member.isAdmin;
  },
  async handle({ interaction, app }: BotCommandInteraction) {
    app.groupService.loadGroups();

    const schedules = await app.groupService.getLaboSchedules();
    app.queueService.clear();

    return interaction.reply(groupsLoadedReply({ schedules }));
  },
};
