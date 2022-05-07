import { MessageButton } from 'discord.js';
import { YADBCollection } from '../models/collection.model';
import { IGuildMember } from '../models/discord/guild-member.model';
import { IReplyMessage, YADBReplyMessage } from '../models/discord/reply-message.model';

type TQueueNextReplyOptions = {
  buttons: YADBCollection<MessageButton>
  member: IGuildMember
};

export function queueNextReply({ member, buttons }: TQueueNextReplyOptions): IReplyMessage {
  return member.isConnectedInVoiceChannel
    ? new YADBReplyMessage()
      .setContent(`${member.tag} es el siguiente. Está esperándote en el canal ${member.voiceChannelTag}.`)
      .setEphemeral(true)
    : new YADBReplyMessage()
      .setContent(`${member.tag} es el siguiente. No se encuentra en ningún canal.`)
      .addButtonsRow(buttons.getMultiple('mentionUser'))
      .setEphemeral(true);
}
