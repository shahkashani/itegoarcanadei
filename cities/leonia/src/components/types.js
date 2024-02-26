import {
  encrypt,
} from '@itegoarcanadei/client-shared';

export const INVENTORY_MESSAGE = encrypt('message');
export const INVENTORY_LOG = encrypt('log');
export const SETTINGS_SHADOWLAND = encrypt('shadowland');
export const INVENTORY_LEFT_SHARD = encrypt('left-shard');
export const INVENTORY_RIGHT_SHARD = encrypt('right-shard');

export const SETTINGS_TRAVEL_FREELY = encrypt('travelfreely');
export const SETTINGS_START_HOUR = encrypt('starthour');
export const SETTINGS_END_HOUR = encrypt('endhour');
export const SETTINGS_ROOM_COLOR = encrypt('color');
export const SETTINGS_CAN_GET_BOOK = encrypt('getbook');
export const SETTINGS_CAN_SEE_BOOK = encrypt('seebook');
export const SETTINGS_CAN_SEE_PORTAL = encrypt('portal');
export const SETTINGS_OPEN_ON_STORE = encrypt('store');
export const SETTINGS_TICK = encrypt('tick');
export const SETTINGS_UNAVAILABLE = encrypt('unavailable');
