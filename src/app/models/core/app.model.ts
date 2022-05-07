import { REST } from '@discordjs/rest';
import { Client, MessageButton } from 'discord.js';
import { YADBCollection } from '../collection.model';
import { ILogger } from '../logger.model';
import { IQueueRepository } from '../queue/queue-repository.model';

export interface IApp {
  logger: ILogger
  client: Client
  rest: REST
  queues: IQueueRepository
  buttons: YADBCollection<MessageButton>
}
