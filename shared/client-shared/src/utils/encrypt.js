import md5 from 'fast-md5';

export const encrypt = (text) => md5(text);
