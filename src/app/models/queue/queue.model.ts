import { Subject, Subscription } from 'rxjs';
import { LayerEightError } from '../../exceptions/layer-eight.error';
import { IGuildMember } from '../discord/guild-member.model';
import { getCurrentTime } from '../../utils/time';

export interface IQueueOptions {
  id: string,
  name: string,
  members?: IGuildMember[],
  isClosed?: boolean
}
export interface IQueue {
  id: string
  name: string
  isClosed: boolean
  isTerminated: boolean
  members: string[]
  add: (member: IGuildMember) => void
  remove: (member: IGuildMember) => void
  next: () => IGuildMember
  close: () => void
  listenChanges: (subscriptionCallback: (s: Subject<IQueue>) => Subscription) => Subscription
}

export class YADBQueue implements IQueue {
  private $changed: Subject<IQueue> = new Subject<IQueue>();

  private _members: IGuildMember[];

  id: string;

  name: string;

  isClosed: boolean;

  get isTerminated(): boolean {
    return this.isClosed && this._members.length === 0;
  }

  get members(): string[] {
    return this._members.map((member) => member.toString());
  }

  constructor(options: IQueueOptions) {
    this.id = options.id;
    this.name = options.name;
    this.isClosed = !!options.isClosed;
    this._members = options.members ?? [];
  }

  listenChanges(subscriptionCallback: (s: Subject<IQueue>) => Subscription): Subscription {
    return subscriptionCallback(this.$changed);
  }

  add(member: IGuildMember): void {
    if (this._indexOf(member.id) >= 0) {
      throw new LayerEightError(`${member.nickname}, ya estás en la fila ${this.name}.`);
    }
    this._members.push(member);
    member.setArrival(getCurrentTime());
    this.$changed.next(this);
  }

  remove({ id, nickname }: IGuildMember): IGuildMember {
    const index = this._indexOf(id);
    if (index < 0) {
      throw new LayerEightError(`${nickname}, aún no estás en la fila ${this.name}.`);
    }
    const [member] = this._members.splice(index, 1);
    this.$changed.next(this);

    return member;
  }

  next(): IGuildMember {
    const next = this._members.shift();
    if (next === undefined) {
      throw new LayerEightError(`No hay nadie esperando en la fila ${this.name}.`);
    }
    this.$changed.next(this);

    return next;
  }

  close(): void {
    this.isClosed = true;
    this.$changed.next(this);
  }

  private _indexOf(id: string): number {
    return this._members.findIndex((m) => m.id === id);
  }
}
