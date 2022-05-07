import { Collection } from 'discord.js';
import { InternalBotError } from '../exceptions/internal-bot.error';

export class YADBCollection<T> {
  private collection: Collection<string, T>;

  constructor(coll?: { [s: string]: T } | Collection<string, T>) {
    if (coll instanceof Collection) {
      this.collection = coll;
    } else {
      this.collection = new Collection(coll ? Object.entries(coll) : undefined);
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

  mapValues<R>(fn: (value: T, key: string) => R): YADBCollection<R> {
    return new YADBCollection<R>(this.collection.mapValues(fn));
  }

  map<R>(fn: (value: T, key: string) => R): R[] {
    return this.collection.map(fn);
  }
}
