import {
  Client, ButtonBuilder, SelectMenuBuilder, ModalBuilder,
} from 'discord.js';
import { Dictionary } from '../collection.model';
import { LogChannel } from '../logger.model';
import { GroupService } from '../queue/group.service';
import { QueueService } from '../queue/queue.service';

export interface App {
  logger: LogChannel
  client: Client
  queueService: QueueService
  groupService: GroupService
  buttons: Dictionary<ButtonBuilder>
  modals: Dictionary<ModalBuilder>
  selects: Dictionary<SelectMenuBuilder>
}
