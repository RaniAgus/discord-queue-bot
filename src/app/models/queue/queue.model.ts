import { EmbedFooterData, EmbedField, ButtonBuilder } from 'discord.js';
import { Observable, Subject, Subscription } from 'rxjs';
import { LayerEightError } from '../../exceptions/layer-eight.error';
import { Dictionary } from '../collection.model';
import { BotGuildMember } from '../discord/guild-member.model';
import { BotReplyMessage } from '../discord/reply-message.model';
import { QueueMember } from './queue-member.model';

export type QueueType = 'SUPPORT' | 'LABORATORY';

export abstract class Queue {
  private $changed: Subject<Queue> = new Subject();

  get isTerminated(): boolean {
    return this.isClosed && this.isEmpty();
  }

  constructor(
    public id: string,
    public name: string,
    protected isClosed = false,
  ) {}

  add(queueMember: QueueMember): void {
    if (this.hasMember(queueMember.member)) {
      throw new LayerEightError(`${queueMember.member.nickname}, ya estás en la fila ${this.name}.`);
    }
    this.addMember(queueMember);
    this.$changed.next(this);
  }

  remove(member: BotGuildMember): QueueMember {
    if (!this.hasMember(member)) {
      throw new LayerEightError(`${member.nickname}, aún no estás en la fila ${this.name}.`);
    }
    const queueMember = this.removeMember(member);
    this.$changed.next(this);

    return queueMember;
  }

  next(buttons: Dictionary<ButtonBuilder>): BotReplyMessage {
    if (this.isEmpty()) {
      throw new LayerEightError(`No hay nadie esperando en la fila ${this.name}.`);
    }
    const next = this.nextMembers();
    this.$changed.next(this);

    return this.nextMessage(next, buttons);
  }

  close(): void {
    this.isClosed = true;
    this.$changed.next(this);
  }

  listenChanges(mapper: (s: Observable<Queue>) => Subscription): Subscription {
    return mapper(this.$changed);
  }

  abstract getType(): QueueType;
  abstract getFields(): EmbedField[];
  abstract getFooter(): EmbedFooterData;
  abstract getButtonsRow(buttons: Dictionary<ButtonBuilder>): ButtonBuilder[];
  protected abstract isEmpty(): boolean;
  protected abstract hasMember(member: BotGuildMember): boolean;
  protected abstract addMember(member: QueueMember): void;
  protected abstract removeMember(member: BotGuildMember): QueueMember;
  protected abstract nextMembers(): QueueMember[];
  protected abstract nextMessage(
    next: QueueMember[], buttons: Dictionary<ButtonBuilder>): BotReplyMessage;
}
