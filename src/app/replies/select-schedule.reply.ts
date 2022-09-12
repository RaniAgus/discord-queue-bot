import { SelectMenuBuilder, SelectMenuOptionBuilder } from 'discord.js';
import { Dictionary } from '../models/collection.model';
import { BotReplyMessage, BotReplyMessageBuilder } from '../models/discord/reply-message.model';

export type SelectScheduleReplyOptions = {
  schedules: SelectMenuOptionBuilder[]
  selects: Dictionary<SelectMenuBuilder>
};

export function selectScheduleReply(o: SelectScheduleReplyOptions): BotReplyMessage {
  return new BotReplyMessageBuilder()
    .setContent('Seleccioná el horario al que fue asignado tu grupo:')
    .setComponents([o.selects.get('schedule').setOptions(o.schedules)])
    .setEphemeral(true);
}
