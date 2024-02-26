import md5 from 'fast-md5';

const fields = ['character', 'goto'];

export const getDialogId = (config) => {
  const { text } = config;
  const prepend = fields.map((field) => config[field]).filter((t) => !!t);
  return md5(prepend + (Array.isArray(text) ? text.join('') : text));
};
