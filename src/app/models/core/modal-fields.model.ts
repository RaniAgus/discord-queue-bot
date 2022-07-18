import { ModalSubmitFieldsResolver } from 'discord.js';

export class BotModalFields {
  constructor(private resolver: ModalSubmitFieldsResolver) {}

  getTextInputValue(customId: string): string {
    return this.resolver.getTextInputValue(customId);
  }
}
