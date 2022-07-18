import { Collection, MessageButton } from 'discord.js';
import {
  concatMap, Observable, Subscription, takeWhile,
} from 'rxjs';
import { InternalBotError } from '../../exceptions/internal-bot.error';
import { fetchQueue, fetchQueueReply } from '../../replies/queue.reply';
import { Dictionary } from '../collection.model';
import { BotMessage } from '../discord/guild-message.model';
import { LogChannel } from '../logger.model';
import { GroupService } from './group.service';
import { Queue } from './queue.model';

export class QueueService {
  private buttons: Dictionary<MessageButton>;

  private logger: LogChannel;

  private elements = new Collection<string, Queue>();

  private groupService: GroupService;

  constructor(
    config: { buttons: Dictionary<MessageButton>, logger: LogChannel, groupService: GroupService },
  ) {
    this.buttons = config.buttons;
    this.logger = config.logger;
    this.groupService = config.groupService;
  }

  put(queue: Queue, message: BotMessage): void {
    if (this.elements.has(queue.id)) {
      throw new InternalBotError(`Ya existe una fila correspondiente al mensaje ${queue.id}.`);
    }
    this.elements.set(queue.id, queue);
    queue.listenChanges((s) => this.listenQueueChanges(s, message));
  }

  async get(message: BotMessage): Promise<Queue> {
    if (!this.elements.has(message.id)) {
      this.put(await fetchQueue(message, this.groupService), message);
    }

    const queue = this.elements.get(message.id);
    if (!queue) {
      throw new InternalBotError(`No se encontró ninguna fila correspondiente al mensaje ${message.id}.`);
    }

    return queue;
  }

  clear(): void {
    this.elements.clear();
  }

  private listenQueueChanges(subject: Observable<Queue>, msg: BotMessage): Subscription {
    let message = msg;
    return subject
      .pipe(
        takeWhile((queue) => !queue.isTerminated, true),
        concatMap((queue) => message.edit(fetchQueueReply({ queue, buttons: this.buttons }))),
      )
      .subscribe({
        next: (uploadedMessage) => { message = uploadedMessage; },
        error: (error) => this.logger.logError(error),
        complete: () => this.elements.delete(message.id),
      });
  }
}
