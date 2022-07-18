import { REST } from '@discordjs/rest';
import {
  Client, MessageButton, MessageSelectMenu, Modal,
} from 'discord.js';
import { Dictionary } from '../collection.model';
import { LogChannel } from '../logger.model';
import { GroupService } from '../queue/group.service';
import { QueueService } from '../queue/queue.service';

export interface App {
  logger: LogChannel
  client: Client
  rest: REST
  queueService: QueueService
  groupService: GroupService
  buttons: Dictionary<MessageButton>
  modals: Dictionary<Modal>
  selects: Dictionary<MessageSelectMenu>
}
