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

export class YADBButtonInteractionBuilder {
  constructor(
    private buttonInteraction: ButtonInteraction,
    private app: IApp,
  ) {}

  async build(): Promise<IButtonInteraction> {
    const interaction = new YADBInteraction(this.buttonInteraction);

    let member = null;
    if (this.buttonInteraction.member instanceof GuildMember) {
      member = new YADBGuildMember(this.buttonInteraction.member);
    }

    // Si el mensaje no viene de un Guild, significa que es un DM, por lo que
    // hay que obtener el TextChannel a partir de su user.
    let textChannel = null;
    if (this.buttonInteraction.inGuild() && this.buttonInteraction.channel !== null) {
      textChannel = new YADBTextChannel(this.buttonInteraction.channel);
    } else {
      textChannel = await this.fetchUserDMChannel();
    }

    // Si el mensaje es un DM, viene una instancia de API Message, por lo que
    // hay que obtenerlo a partir del canal
    let message = null;
    if (this.buttonInteraction.message instanceof Message) {
      message = new YADBMessage(this.buttonInteraction.message);
    } else {
      message = await textChannel.fetchMessage(this.buttonInteraction.message.id);
    }

    return {
      app: this.app,
      interaction,
      textChannel,
      message,
      member,
    };
  }

  private async fetchUserDMChannel(): Promise<ITextChannel> {
    // Cuando se reinicia la aplicación, se pierde el dmChannel, por lo que si
    // un user quiere interactuar con un mensaje muy antiguo hace falta
    // primero llamar a createDM()
    return new YADBTextChannel(
      this.buttonInteraction.user.dmChannel
      ?? await this.buttonInteraction.user.createDM(),
    );
  }
}
