import { SelectMenuBuilder, SelectMenuOptionBuilder } from 'discord.js';
import { Dictionary } from '../models/collection.model';
import { BotReplyMessage, BotReplyMessageBuilder } from '../models/discord/reply-message.model';

export type SelectGroupReplyOptions = {
  groups: SelectMenuOptionBuilder[]
  selects: Dictionary<SelectMenuBuilder>
};

export function selectGroupReply({ groups, selects }: SelectGroupReplyOptions): BotReplyMessage {
  return new BotReplyMessageBuilder()
    .setContent('Seleccioná el nombre de tu grupo:')
    .setComponents([selects.get('group').setOptions(groups)])
    .setEphemeral(true);
}
