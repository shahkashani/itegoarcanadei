const french = require('an-array-of-french-words');
const english = require('wordlist-english')['english/50'];

const OFFSET = 2;
const MAX_LENGTH = 15;

const findWord = (search, step, language = 'en') => {
  const array = language === 'en' ? english : french;
  return array.filter((word) => {
    let string = '';
    for (let i = OFFSET; i < word.length; i += step) {
      string += word[i];
    }
    return string.toLowerCase() === search.toLowerCase();
  });
};

const findLongest = (
  search,
  step,
  start = 0,
  length = 2,
  minMatches = 3,
  language = 'en'
) => {
  const subset = search.slice(start, start + length);
  const matches = findWord(subset, step, language);
  if (matches.length >= minMatches) {
    if (start + length + 1 > search.length || subset.length >= MAX_LENGTH) {
      return {
        start,
        length,
        word: subset,
        results: matches,
      };
    }
    return findLongest(search, step, start, length + 1, minMatches, language);
  } else {
    const word = search.slice(start, start + length - 1);
    const results = findWord(word, step, language);
    return {
      word,
      start,
      length: length - 1,
      results,
    };
  }
};

const find = (search, step = 3, minMatches = 15, language = 'en') => {
  let start = 0;
  let length = 2;
  const results = [];
  const clean = search.replace(/[\s.,]/g, '');
  while (start < clean.length) {
    let result = findLongest(clean, step, start, length, minMatches, language);
    start = result.start + result.length;
    results.push(result);
  }
  const output = {};
  start = OFFSET;
  for (let object of results) {
    output[start] = {
      index: start,
      word: object.word,
      choices: object.results,
    };
    start += step;
  }

  return {
    search,
    results: output,
    length: start - step,
  };
};

module.exports = find;
