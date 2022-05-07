export class InternalBotError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, InternalBotError.prototype);
    this.name = 'InternalBotError';
  }
}
