import { accept } from './accept.button';
import { add } from './add.button';
import { close } from './close.button';
import { erase } from './erase.button';
import { mentionUser } from './mention-user.button';
import { next } from './next.button';
import { remove } from './remove.button';
import { YADBCollection } from '../models/collection.model';
import { IButtonHandler } from '../models/core/button-handler.model';

export const buttons = new YADBCollection<IButtonHandler>({
  accept,
  add,
  close,
  erase,
  mentionUser,
  next,
  remove,
});
