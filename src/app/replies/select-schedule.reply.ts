import { MessageSelectMenu, MessageSelectOptionData } from 'discord.js';
import { Dictionary } from '../models/collection.model';
import { BotReplyMessage, BotReplyMessageBuilder } from '../models/discord/reply-message.model';

export type SelectScheduleReplyOptions = {
  schedules: MessageSelectOptionData[]
  selects: Dictionary<MessageSelectMenu>
};

export function selectScheduleReply(o: SelectScheduleReplyOptions): BotReplyMessage {
  return new BotReplyMessageBuilder()
    .setContent('Seleccioná el horario al que fue asignado tu grupo:')
    .addSelectMenuRow([o.selects.get('schedule').setOptions(o.schedules)])
    .setEphemeral(true);
}
