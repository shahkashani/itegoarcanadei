const pdfParse = require('pdf-parse');
const { readFileSync } = require('fs');
const { uniqBy } = require('lodash');
const { sync } = require('glob');

const CORPUS_FILES = sync('./corpus/*.pdf');

let corpus;

const getExample = (array, index, pad = 20) => {
  let end = Math.min(array.length - 1, index + pad);
  let startDots = '...';
  let endDots = '...';
  let start = Math.max(0, index - pad);
  if (start >= pad && end <= array.length - pad) {
    for (var i = 0; i < pad; i += 1) {
      const startWord = array[index - i];
      if (startWord.match(/\./) && startDots !== '') {
        start = index - i + 1;
        startDots = '';
      }
      const endWord = array[index + i];
      if (endWord.match(/\./) && endDots !== '') {
        end = index + i + 1;
        endDots = '';
      }
    }
  }
  const example = array.slice(start, end).join(' ');
  return `${startDots}${example}${endDots}`;
};

const getCorpus = async () => {
  let resultsWords = [];
  let resultsSentences = [];

  for (const file of CORPUS_FILES) {
    console.log(file);
    const { text } = await pdfParse(readFileSync(file));
    const array = text.split(/[\s\n—-]+/);
    const words = array
      .map((word, i) => ({
        example: getExample(array, i),
        word: word
          .toLowerCase()
          .replace(/[^a-zäöü]/g, '')
          .trim(),
      }))
      .filter(({ word }) => word.length > 0);

    resultsWords = [...resultsWords, ...words];
  }

  return {
    words: uniqBy(resultsWords, 'word'),
    sentences: resultsSentences,
  };
};

const getHighlight = (phraseLetters, content) => {
  const contentSplit = content.split('');
  const phraseLength = phraseLetters.length;
  const results = [];
  let seekIndex = 0;
  let seekingLetter = phraseLetters[0];
  for (var index = 0; index <= contentSplit.length; index += 1) {
    if (seekIndex >= phraseLength) {
      return results;
    }
    if (contentSplit[index] === seekingLetter) {
      seekIndex += 1;
      seekingLetter = phraseLetters[seekIndex];
      results.push(index);
    }
  }
  return results;
};

const measure = async (callback, text) => {
  if (text) {
    console.log(text);
  }
  const totalStart = process.hrtime();
  const results = await callback();
  const totalEnd = process.hrtime(totalStart);
  const totalDuration = totalEnd[0] * 1000 + totalEnd[1] / 1000000;
  console.log(`Duration: ${totalDuration}ms`);
  return results;
};

const find = async (search) => {
  if (!corpus) {
    corpus = await measure(getCorpus, 'Loading corpus...');
    console.log(corpus);
  }
  return await measure(() => {
    const q = search.trim().toLowerCase().replace(/\s/g, '');
    const qs = q.split('');
    const results = [];
    for (const entry of corpus.words) {
      const { word, example } = entry;
      const indexes = getHighlight(qs, word);
      if (indexes.length > 0) {
        results.push({
          word,
          example,
          indexes,
        });
      }
    }
    const sorted = results.sort((a, b) => b.indexes.length - a.indexes.length);
    return sorted;
  }, `Starting search for ${search.trim()}...`);
};

module.exports = { find };
