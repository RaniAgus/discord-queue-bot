import { MessageButton } from 'discord.js';
import { Dictionary } from '../models/collection.model';
import { BotGuildMember } from '../models/discord/guild-member.model';
import { BotReplyMessage, BotReplyMessageBuilder } from '../models/discord/reply-message.model';

type QueueNextReplyOptions = {
  buttons: Dictionary<MessageButton>
  member: BotGuildMember
};

export function queueNextReply({ member, buttons }: QueueNextReplyOptions): BotReplyMessage {
  return member.isConnectedInVoiceChannel
    ? new BotReplyMessageBuilder()
      .setContent(`Sigue ${member.tag}. Está esperándote en el canal ${member.voiceChannelTag}.`)
      .setEphemeral(true)
    : new BotReplyMessageBuilder()
      .setContent(`Sigue ${member.tag}. No se encuentra en ningún canal.`)
      .addButtonsRow(buttons.getMultiple('mentionUser'))
      .setEphemeral(true);
}
