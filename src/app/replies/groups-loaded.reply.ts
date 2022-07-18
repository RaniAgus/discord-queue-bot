import { MessageEmbed } from 'discord.js';
import { BotReplyMessage, BotReplyMessageBuilder } from '../models/discord/reply-message.model';
import { LaboSchedule } from '../models/queue/labo-schedule.model';

type GroupsLoadedReplyOptions = {
  schedules: LaboSchedule[]
};

export function groupsLoadedReply({ schedules }: GroupsLoadedReplyOptions): BotReplyMessage {
  return new BotReplyMessageBuilder()
    .setEphemeral(true)
    .addEmbed(
      new MessageEmbed()
        .setTitle('Horarios')
        .addFields(schedules.map((it) => it.getField())),
    );
}
