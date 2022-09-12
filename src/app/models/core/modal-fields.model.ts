import { ModalSubmitFields } from 'discord.js';

export class BotModalFields {
  constructor(private resolver: ModalSubmitFields) {}

  getTextInputValue(customId: string): string {
    return this.resolver.getTextInputValue(customId);
  }
}
