import { Collection } from 'discord.js';
import { InternalBotError } from '../exceptions/internal-bot.error';

export class Dictionary<T> {
  private collection: Collection<string, T>;

  constructor(collection?: { [s: string]: T } | Collection<string, T>) {
    if (collection instanceof Collection) {
      this.collection = collection;
    } else {
      this.collection = new Collection(collection ? Object.entries(collection) : undefined);
    }
  }

  set(key: string, value: T): this {
    this.collection.set(key, value);
    return this;
  }

  get(key: string): T {
    const value = this.collection.get(key);
    if (!value) {
      throw new InternalBotError(`No se encontró ningún valor para ${key}`);
    }
    return value;
  }

  getMultiple(...keys: string[]): T[] {
    return keys.map((key) => this.get(key));
  }

  mapValues<R>(fn: (value: T, key: string) => R): Dictionary<R> {
    return new Dictionary<R>(this.collection.mapValues(fn));
  }

  map<R>(fn: (value: T, key: string) => R): R[] {
    return this.collection.map(fn);
  }
}
