import { YADBCollection } from '../models/collection.model';
import { add } from './add.command';
import { ICommandHandler } from '../models/core/command-handler.model';
import { ping } from './ping.command';
import { queue } from './queue.command';

export const commands = new YADBCollection<ICommandHandler>({
  add,
  ping,
  queue,
});
