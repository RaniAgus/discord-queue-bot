import { GuildMember, StageChannel, VoiceChannel } from 'discord.js';
import { BotReplyMessage } from './reply-message.model';

export class BotVoiceChannel {
  constructor(private channel: VoiceChannel | StageChannel) {}

  setMembersChannel(channelId: string): Promise<string[]> {
    return this.broadcastMembers((member) => member.voice.setChannel(channelId));
  }

  setMembersRole(roleId: string): Promise<string[]> {
    return this.broadcastMembers((member) => member.roles.add(roleId));
  }

  dmMembers(reply: BotReplyMessage): Promise<string[]> {
    return this.broadcastMembers((member) => member.send(reply));
  }

  private broadcastMembers(fn: (m: GuildMember) => Promise<unknown>): Promise<string[]> {
    return Promise.all(
      this.channel.members.map((member) => fn(member)
        .then(() => `✅ <@${member.user.id}>`)
        .catch((error) => `❎ <@${member.user.id}> -- ${error.message}`)),
    );
  }
}
