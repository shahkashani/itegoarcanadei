import { encrypt } from '@itegoarcanadei/client-shared';

export const DIALOG_STATE_MAP = 'seenMap';
export const DIALOG_STATE_BOOK = 'seenBook';
export const INVENTORY_MAP = encrypt('map');
export const INVENTORY_BOOK = encrypt('book');
export const EFFECTS_CORMORANTS = 'allowedToUseCormorants';
