import { Dictionary } from '../../models/collection.model';
import { BotSelectHandler } from '../../models/core/select-handler.model';
import { group } from './group.select';
import { schedule } from './schedule.select';

export const selects = new Dictionary<BotSelectHandler>({
  group,
  schedule,
});
