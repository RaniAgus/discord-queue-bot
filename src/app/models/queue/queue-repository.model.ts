import { Collection, MessageButton } from 'discord.js';
import {
  concatMap, Subject, Subscription, takeWhile,
} from 'rxjs';
import { InternalBotError } from '../../exceptions/internal-bot.error';
import { fetchQueue, queueReply } from '../../replies/queue.reply';
import { YADBCollection } from '../collection.model';
import { IMessage } from '../discord/guild-message.model';
import { ILogger } from '../logger.model';
import { IQueue } from './queue.model';

export interface IQueueRepository {
  put: (queue: IQueue, message: IMessage) => void,
  get: (message: IMessage) => Promise<IQueue>,
}

export class YADBQueueRepository implements IQueueRepository {
  private buttons: YADBCollection<MessageButton>;

  private logger: ILogger;

  private elements = new Collection<string, IQueue>();

  constructor(config: { buttons: YADBCollection<MessageButton>, logger: ILogger }) {
    this.buttons = config.buttons;
    this.logger = config.logger;
  }

  put(queue: IQueue, message: IMessage): void {
    if (this.elements.has(queue.id)) {
      throw new InternalBotError(`Ya existe una fila correspondiente al mensaje ${queue.id}.`);
    }
    this.elements.set(queue.id, queue);
    queue.listenChanges((s) => this.listenQueueChanges(s, message));
  }

  async get(message: IMessage): Promise<IQueue> {
    if (!this.elements.has(message.id)) {
      this.put(await fetchQueue(message), message);
    }

    const queue = this.elements.get(message.id);
    if (!queue) {
      throw new InternalBotError(`No se encontró ninguna fila correspondiente al mensaje ${message.id}.`);
    }

    return queue;
  }

  private listenQueueChanges(subject: Subject<IQueue>, msg: IMessage): Subscription {
    let message = msg;
    return subject
      .pipe(
        takeWhile((queue) => !queue.isTerminated, true),
        concatMap((queue) => message.edit(queueReply({ queue, buttons: this.buttons }))),
      )
      .subscribe({
        next: (uploadedMessage) => { message = uploadedMessage; },
        error: (error) => this.logger.logError(error),
        complete: () => this.elements.delete(message.id),
      });
  }
}
