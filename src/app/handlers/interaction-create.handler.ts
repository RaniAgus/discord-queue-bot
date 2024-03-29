import {
  ButtonInteraction, Interaction, InteractionType,
} from 'discord.js';
import { LayerEightError } from '../exceptions/layer-eight.error';
import { Dictionary } from '../models/collection.model';
import { App } from '../models/core/app.model';
import { BotBaseHandler } from '../models/core/base-handler.model';
import { BotBaseInteraction } from '../models/core/base-interaction.model';
import { BotButtonInteraction } from '../models/core/button-interaction.model';
import { BotCommandInteraction } from '../models/core/command-interaction.model';
import { BotModalInteraction } from '../models/core/modal-interaction.model';
import { BotSelectInteraction } from '../models/core/select-interaction.model';
import { BotReplyMessage, BotReplyMessageBuilder } from '../models/discord/reply-message.model';
import { LogChannel } from '../models/logger.model';
import { errorReplyContentForUser } from '../replies/error.reply';
import { buttons } from './buttons';
import { commands } from './commands';
import { modals } from './modals';
import { selects } from './selects';

export { buttons } from './buttons';
export { commands, deployCommands } from './commands';
export { modals } from './modals';
export { selects } from './selects';

async function handle<H extends BotBaseHandler<unknown, I>, I extends BotBaseInteraction>(
  handlers: Dictionary<H>,
  id: string,
  interactionFactory: () => I | Promise<I>,
) {
  const handler = handlers.get(id);
  const interaction = await interactionFactory();
  if (!handler.hasPermissions(interaction)) {
    throw new LayerEightError(
      `${interaction.member?.nickname}, no contás con permisos suficientes para usar este botón.`,
    );
  }
  await handler.handle(interaction);
}

export async function handleInteractionCreate(
  logger: LogChannel,
  app: App,
  interaction: Interaction,
) {
  // TODO: Find a better way to do this
  try {
    switch (interaction.type) {
      case InteractionType.ApplicationCommand:
        await handle(
          commands,
          interaction.commandName,
          () => BotCommandInteraction.of(interaction, app),
        );
        break;
      case InteractionType.MessageComponent:
        if (interaction instanceof ButtonInteraction) {
          await handle(
            buttons,
            interaction.customId,
            () => BotButtonInteraction.of(interaction, app),
          );
        } else {
          await handle(
            selects,
            interaction.customId,
            () => BotSelectInteraction.of(interaction, app),
          );
        }
        break;
      case InteractionType.ModalSubmit:
        await handle(
          modals,
          interaction.customId,
          () => BotModalInteraction.of(interaction, app),
        );
        break;
      default:
        logger.log('Se recibió una interacción desconocida.');
    }
  } catch (error) {
    const reply: BotReplyMessage = new BotReplyMessageBuilder()
      .setContent(errorReplyContentForUser(error))
      .setEphemeral(true);

    if (interaction.isSelectMenu()) {
      interaction
        .update(reply)
        .catch(() => interaction.editReply(reply));
    } else if (interaction.isAutocomplete()) {
      interaction.respond([]);
    } else {
      interaction
        .reply(reply)
        .catch(() => interaction.followUp(reply));
    }
    logger.logError(error);
  }
}
