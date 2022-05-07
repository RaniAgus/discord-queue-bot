export class LayerEightError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, LayerEightError.prototype);
    this.name = 'LayerEightError';
  }
}
