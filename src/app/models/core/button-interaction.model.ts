import { ButtonInteraction, GuildMember, Message } from 'discord.js';
import { IApp } from './app.model';
import { IMessage, YADBMessage } from '../discord/guild-message.model';
import { IGuildMember, YADBGuildMember } from '../discord/guild-member.model';
import { IInteraction, YADBInteraction } from '../discord/interaction.model';
import { ITextChannel, YADBTextChannel } from '../discord/text-channel.model';

export interface IButtonInteraction {
  app: IApp
  interaction: IInteraction
  textChannel: ITextChannel | null
  member: IGuildMember | null
  message: IMessage
}

export const YADBButtonInteractionFactory = async (
  buttonInteraction: ButtonInteraction,
  app: IApp,
): Promise<IButtonInteraction> => {
  const interaction = new YADBInteraction(buttonInteraction);
  const member = buttonInteraction.member instanceof GuildMember
    ? new YADBGuildMember(buttonInteraction.member) : null;

  // Si el mensaje no viene de un Guild, significa que es un DM, por lo que
  // hay que obtener el TextChannel a partir de su user.
  const textChannel = buttonInteraction.inGuild() && buttonInteraction.channel !== null
    ? new YADBTextChannel(buttonInteraction.channel)
    // Cuando se reinicia la aplicación, se pierde el dmChannel, por lo que si
    // un user quiere interactuar con un mensaje muy antiguo hace falta
    // primero llamar a createDM()
    : new YADBTextChannel(
      buttonInteraction.user.dmChannel ?? await buttonInteraction.user.createDM(),
    );

  // Si el mensaje es un DM, viene una instancia de APIMessage, por lo que
  // hay que obtener el mensaje completo desde el channel
  const message = buttonInteraction.message instanceof Message
    ? new YADBMessage(buttonInteraction.message)
    : await textChannel.fetchMessage(buttonInteraction.message.id);

  return {
    app,
    interaction,
    textChannel,
    message,
    member,
  };
};
