import { LayerEightError } from '../exceptions/layer-eight.error';
import { stringify } from '../utils/string';

export function errorReplyContentForUser(error: unknown): string {
  if (!(error instanceof LayerEightError)) {
    return 'Se ha producido un error al intentar realizar la operación';
  }

  return error.message;
}

export function errorReplyContentForLog(error: unknown): string {
  if (!(error instanceof Error)) {
    return `Unknown Error\n${stringify(error)}`;
  }
  if (error instanceof LayerEightError) {
    return error.message;
  }

  return error.stack ?? error.message;
}
