import React, { createRef, useEffect, useMemo, useRef, useState } from 'react';

import ContentEditable from 'react-contenteditable';
import { debounce } from 'lodash';
import { position } from 'caret-pos';
import { renderToString } from 'react-dom/server';
import styled from 'styled-components';
import {
  FullPageImage,
  useSelection,
  useLocalStorage,
} from '@itegoarcanadei/client-shared';

const LS_PHRASE = 'divide-phrase';
const LS_CONTENT = 'divide-text';
const SHOW_RESULTS = 20;
const DEBOUNCE = 500;
const INPUT_BG = '#0e0b09';
const INPUT_BG_ACTIVE = '#000';

const OuterContainer = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
  padding: 100px;
  box-sizing: border-box;
  position: relative;
  z-index: 2;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 50px;
`;

const Focusable = styled(ContentEditable)`
  background: ${INPUT_BG};

  &:focus {
    outline: none;
    background: ${INPUT_BG_ACTIVE};
  }
`;

const Textarea = styled(Focusable)`
  width: 400px;
  height: 200px;
  padding: 15px;
  border-radius: 10px;
  white-space: pre-wrap;
`;

const Input = styled(Focusable)`
  padding: 15px 20px;
  max-width: 300px;
  border-radius: 10px;
`;

const Highlighted = styled.span`
  border-bottom: 1px solid orange;
`;

const IconButton = styled.button`
  width: 50px;
  height: 50px;
  border: 0;
  background: ${INPUT_BG};
  border-radius: 100%;

  &:active {
    background: ${INPUT_BG_ACTIVE};
  }
`;

const Icons = styled.div`
  display: flex;
  gap: 10px;
`;

const Results = styled.div`
  margin-top: 20px;
`;

const Result = styled.div`
  margin: 5px 0;
  cursor: pointer;
  min-width: 200px;
`;

const SearchTools = styled.div`
  margin-top: 20px;
  display: flex;
  gap: 10px;
`;

const Paginate = styled.button`
  background: none;
  width: auto;
  padding: 0;
  margin: 0;
  border: 0;
  color: #777;
  cursor: pointer;

  &:disabled {
    cursor: default;
    opacity: 0.8;
  }
`;

const getHighlightIndex = (phrase, content) => {
  const phraseLetters = phrase.split('');
  let seekIndex = 0;
  return content.split('').reduce((memo, letter, index) => {
    if (seekIndex >= phraseLetters.length) {
      return memo;
    }
    const charCode = phraseLetters[seekIndex].charCodeAt(0);
    if (charCode === 32 || charCode === 160) {
      seekIndex += 1;
    }
    if (seekIndex >= phraseLetters.length) {
      return memo;
    }
    const seekingLetter = phraseLetters[seekIndex];
    if (letter.toLowerCase() === seekingLetter.toLowerCase()) {
      memo = [...memo, index];
      seekIndex += 1;
    }
    return memo;
  }, []);
};

const getActualLetterIndexes = (phrase) => {
  let nonWordCount = 0;
  return phrase.split('').reduce((memo, letter, i) => {
    const charCode = letter.charCodeAt(0);
    if (charCode !== 32 && charCode !== 160) {
      memo[nonWordCount] = i;
      nonWordCount += 1;
    }
    return memo;
  }, []);
};

const highlightIndexes = (content, indexes) => {
  return content.split('').map((letter, index) => {
    if (letter.charCodeAt(0) === 10) {
      return <br />;
    }
    return indexes.indexOf(index) === -1 ? (
      <span>{letter}</span>
    ) : (
      <Highlighted>{letter}</Highlighted>
    );
  });
};

const getHighlights = (phrase, content) => {
  const indexes = getHighlightIndex(phrase, content);
  const contentHighlighted = highlightIndexes(content, indexes);

  const lookupIndexes = getActualLetterIndexes(phrase);
  const lookupIndex = lookupIndexes[indexes.length - 1];
  const rest = phrase.slice(lookupIndex + 1);

  const phraseHighlighted = (
    <>
      <Highlighted>{phrase.slice(0, lookupIndex + 1)}</Highlighted>
      <span>{rest}</span>
    </>
  );

  return {
    text: content,
    content: contentHighlighted,
    phrase: phraseHighlighted,
    remaining: rest,
  };
};

const getCode = (phrase, content, isPlainText = false) => {
  const indexes = getHighlightIndex(phrase, content);
  const plainText = content
    .split('')
    .map((letter, index) =>
      indexes.indexOf(index) === -1 ? letter : `*${letter}*`
    )
    .join('')
    .replace(/\*{2,}/g, '');
  if (isPlainText) {
    return plainText;
  }
  const array = plainText.split(/\n/);
  return JSON.stringify(array);
};

export const TheDivide = () => {
  const [phraseLs, setPhraseLs] = useLocalStorage(
    LS_PHRASE,
    'Et in Arcadia Ego'
  );

  const [contentLs, setContentLs] = useLocalStorage(LS_CONTENT, '');
  const [phrase, setPhrase] = useState(phraseLs);
  const [content, setContent] = useState(contentLs);
  const [results, setResults] = useState([]);
  const selection = useSelection();
  const highlights = getHighlights(phrase, content);
  const searchFor = useMemo(
    () => selection || highlights.remaining,
    [selection, highlights]
  );
  const [searchPage, setSearchPage] = useState(0);
  const ref = createRef();
  const text = useRef('');
  const showResults = useMemo(
    () =>
      results.slice(searchPage * SHOW_RESULTS, (searchPage + 1) * SHOW_RESULTS),
    [searchPage, results]
  );
  const maxPages = useMemo(
    () => Math.floor(results.length / SHOW_RESULTS),
    [results]
  );

  useEffect(() => {
    setPhraseLs(phrase);
  }, [phrase]);

  useEffect(() => {
    setContentLs(content);
  }, [content]);

  const onCopy = (isPlainText = false) => {
    const code = getCode(phrase, content, isPlainText);
    navigator.clipboard.writeText(code);
  };

  const onSearch = async () => {
    const result = await fetch(`/search?q=${encodeURIComponent(searchFor)}`);
    if (!result.ok) {
      alert('Something went wrong.');
    }
    const { results } = await result.json();
    setSearchPage(0);
    setResults(results);
  };

  const keyUpHandler = (e) => {
    if (
      highlights.text.toLowerCase().replace(/[^a-z]/g, '') ===
      text.current.toLowerCase().replace(/[^a-z]/g, '')
    ) {
      return;
    }
    const { target } = e;
    const { pos } = position(target);
    setContent(text.current);
    setTimeout(() => {
      position(target, pos);
    }, 0);
  };

  const limitedKeyUpHandler = useMemo(
    () => debounce(keyUpHandler, DEBOUNCE),
    [highlights]
  );

  return (
    <>
      <FullPageImage src={'/background.jpg'} opacity={0.4} />
      <OuterContainer>
        <Container>
          <div>
            <Input
              onChange={(e) => setPhrase(e.currentTarget.innerText)}
              html={renderToString(highlights.phrase)}
            />
          </div>
          <div>
            <Textarea
              ref={ref}
              html={renderToString(highlights.content)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  document.execCommand('insertLineBreak');
                  e.preventDefault();
                }
              }}
              onKeyUp={limitedKeyUpHandler}
              onBlur={() => {
                setContent(text.current);
              }}
              onChange={(e) => {
                text.current = e.currentTarget.innerText;
              }}
            />
          </div>
          <div>
            <Icons>
              <IconButton onClick={(e) => onCopy(e.altKey)}>✂️</IconButton>
              <IconButton
                onClick={() => onSearch()}
                title={`Search for: ${searchFor}`}
              >
                🔍
              </IconButton>
            </Icons>
            {showResults.length > 0 && (
              <Results>
                {showResults.map(({ word, example, indexes }) => (
                  <Result
                    title={example}
                    onClick={() =>
                      setContent((c) => `${c} ${word}`.replace(/\s{2,}/, ' '))
                    }
                    key={word}
                  >
                    {highlightIndexes(word, indexes)}
                  </Result>
                ))}
                <SearchTools>
                  <Paginate
                    onClick={() => setSearchPage((p) => p - 1)}
                    disabled={searchPage === 0}
                  >
                    «
                  </Paginate>
                  <Paginate
                    disabled={searchPage + 1 >= maxPages}
                    onClick={() => setSearchPage((p) => p + 1)}
                  >
                    »
                  </Paginate>
                </SearchTools>
              </Results>
            )}
          </div>
        </Container>
      </OuterContainer>
    </>
  );
};
