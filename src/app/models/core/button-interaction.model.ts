import { ButtonInteraction, GuildMember } from 'discord.js';
import { App } from './app.model';
import { BotMessage } from '../discord/guild-message.model';
import { BotGuildMember } from '../discord/guild-member.model';
import { BotInteraction } from '../discord/interaction.model';
import { BotTextChannel } from '../discord/text-channel.model';
import { BotBaseInteraction } from './base-interaction.model';

export class BotButtonInteraction implements BotBaseInteraction {
  constructor(
    public app: App,
    public interaction: BotInteraction,
    public member: BotGuildMember | null,
    public textChannel: BotTextChannel | null,
    public message: BotMessage,
  ) {}

  static async of(buttonInteraction: ButtonInteraction, app: App): Promise<BotButtonInteraction> {
    const interaction = new BotInteraction(buttonInteraction);
    const member = buttonInteraction.member instanceof GuildMember
      ? new BotGuildMember(buttonInteraction.member) : null;

    // Si el mensaje no viene de un Guild, significa que es un DM, por lo que
    // hay que obtener el TextChannel a partir de su user.
    const textChannel = buttonInteraction.inGuild() && buttonInteraction.channel !== null
      ? new BotTextChannel(buttonInteraction.channel)
      // Cuando se reinicia la aplicación, se pierde el dmChannel, por lo que si
      // un user quiere interactuar con un mensaje muy antiguo hace falta
      // primero llamar a createDM()
      : new BotTextChannel(
        buttonInteraction.user.dmChannel ?? await buttonInteraction.user.createDM(),
      );

    return {
      app,
      member,
      interaction,
      textChannel,
      message: new BotMessage(buttonInteraction.message),
    };
  }
}
