import { getDialogId } from './getDialogId';
import md5 from 'fast-md5';

export const dialogFilter = (item, state) => {
  if (item.condition) {
    const { condition } = item;
    const keys = Object.keys(condition);
    if (keys.some((key) => condition[key] !== state[md5(key)])) {
      return false;
    }
  }
  if (item.once) {
    const id = getDialogId(item);
    if (state[id]) {
      return false;
    }
    return true;
  }
  return true;
};

export const getFilteredDialog = (array, state) => {
  return array.filter((item) => dialogFilter(item, state));
};
