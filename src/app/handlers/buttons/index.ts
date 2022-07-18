import { accept } from './accept.button';
import { addUser } from './add-user.button';
import { addGroup } from './add-group.button';
import { close } from './close.button';
import { erase } from './erase.button';
import { mentionUser } from './mention-user.button';
import { next } from './next.button';
import { remove } from './remove.button';
import { Dictionary } from '../../models/collection.model';
import { BotButtonHandler } from '../../models/core/button-handler.model';

export const buttons = new Dictionary<BotButtonHandler>({
  accept,
  addUser,
  addGroup,
  close,
  erase,
  mentionUser,
  next,
  remove,
});
