import React, { useEffect, useState } from 'react';

import { FullPageImage, useLocalStorage } from '@itegoarcanadei/client-shared';
import styled from 'styled-components';

const NEWLINE = '-';

const Container = styled.div`
  margin: 0 auto;
  padding: 100px;
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
`;

const SubContainer = styled.div`
  display: grid;
  margin: 0 auto;
  justify-content: center;
  grid-template-columns: repeat(3, min-content);
  grid-auto-rows: max-content;
`;

const Input = styled.input`
  padding: 10px 0;
  border: 0;
  background: none;
  border-bottom: 1px solid #888;
  margin: 0 10px;
  color: white;
  &:focus {
    outline: none;
    border-color: white;
  }
`;

const Select = styled.select`
  padding: 10px 0;
  background: none;
  border: none;
  color: white;
  border-bottom: 1px solid #888;
  &:focus {
    outline: none;
    border-color: white;
  }
`;

const FormattedText = styled.div`
  margin-top: 30px;
  white-space: pre-line;
`;

const Missing = styled.span`
  background: #333;
  color: #333;
  min-width: 10px;
  display: inline-block;
  margin: 5px;

  &::before {
    content: '&nbsp;';
  }
`;

const Def = styled.a`
  text-decoration: none;
  margin-left: 5px;
  font-size: 0.8rem;
  color: ${({ color }) => color};
`;

const Info = styled.div`
  font-size: 1rem;
  margin: 30px 0;
`;

const H1 = styled.h1`
  display: block;
  font-size: 1rem;
  grid-column: 1 / span 3;
  text-align: center;
  margin: 20px 0;

  button {
    visibility: hidden;
    border: 0;
    background: 0;
    color: white;
    cursor: pointer;
  }

  &:hover {
    button {
      visibility: visible;
    }
  }
`;

const H2 = styled.h2`
  display: block;
  font-size: 1rem;
  margin-bottom: 20px;
`;

const Section = styled.section`
  border-bottom: 1px solid #333;
  padding-bottom: 30px;
  margin-bottom: 30px;
`;

const Button = styled.button`
  border: 0;
  background: #333;
  color: #aaa;
  padding: 10px 20px;
  border-radius: 3px;

  &:disabled {
    opacity: 0.5;
  }
`;

const SelectHolder = styled.span`
  white-space: nowrap;
`;

const ExternalLink = ({ url, color = '#777' }) => (
  <Def color={color} target="_blank" href={url}>
    •
  </Def>
);

const getEvery = (array, offset = 2, skip = 3) => {
  const result = [];
  for (let i = offset; i < array.length; i += skip) {
    result.push(array[i]);
  }
  return result;
};

const decrypt = (text) => {
  const words = Object.values(text).join(' ').split(' ');
  const thirdWords = getEvery(words);

  console.log(thirdWords);

  const result = thirdWords.reduce((memo, word) => {
    const letters = getEvery(word.split(''));
    return [...memo, ...letters];
  }, []);
  return result.join('');
};

const AddTitle = ({ text, onSubmit }) => {
  const [index, setIndex] = useState('');
  const [title, setTitle] = useState('');
  return (
    <div>
      <Select onChange={(e) => setIndex(e.target.value)} value={index}>
        {Object.values(text).map((t, i) => (
          <option value={i} key={`title-${i}`}>
            {i}. {t}
          </option>
        ))}
      </Select>
      <Input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Button
        disabled={title.length === 0}
        onClick={() => {
          onSubmit(parseInt(index, 10) || 0, title);
          setIndex('');
          setTitle('');
        }}
      >
        Add
      </Button>
    </div>
  );
};

export const Trithemius = () => {
  const [phraseLs, setPhraseLs] = useLocalStorage(
    'trithemius-phrase',
    'Daphnis ego in silvis hinc usque ad sidera notus'
  );
  const [phrase, setPhrase] = useState(phraseLs);
  const [cache, setCache] = useLocalStorage(`trithemius-text-${phrase}`, {});
  const [titleCache, setTitleCache] = useLocalStorage(
    `trithemius-titles-${phrase}`,
    {}
  );
  const [languageLs, setLanguageLs] = useLocalStorage('trithemius-lang', 'en');
  const [words, setWords] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [inputs, setInputs] = useState([]);
  const [text, setText] = useState(cache);
  const [formattedText, setFormattedText] = useState('');
  const newlineRegexp = new RegExp(NEWLINE, 'g');
  const [titles, setTitles] = useState(titleCache);
  const [language, setLanguage] = useState(languageLs);

  const deleteTitle = (index) => {
    setTitles((title) => {
      const newTitles = { ...title };
      delete newTitles[index];
      return newTitles;
    });
  };

  const onDecrypt = () => {
    alert(decrypt(text));
  };

  useEffect(() => {
    setLanguageLs(language);
  }, [language]);

  useEffect(() => {
    setPhraseLs(phrase);
  }, [phrase]);

  useEffect(() => {
    const { length } = words;
    const pieces = [];
    for (let i = 0; i <= length; i += 1) {
      if (titles[i]) {
        pieces.push(i > 0 ? `\n\n${titles[i]}\n\n` : `${titles[i]}\n\n`);
      }
      let word = text[i] || <Missing key={`word-${i}`} />;
      if (text[i] && word.indexOf(NEWLINE) !== -1) {
        word = word.replace(newlineRegexp, '\n');
      }
      pieces.push(<span key={`word-${i}`}>{word} </span>);
    }
    setFormattedText(pieces);
  }, [text, phrase, words, titles, NEWLINE]);

  useEffect(() => {
    setCache(text);
  }, [text]);

  useEffect(() => {
    setTitleCache(titles);
  }, [titles]);

  useEffect(() => {
    (async () => {
      const response = await fetch(
        `/words?lang=${language}&phrase=${encodeURIComponent(phrase)}`
      );
      const json = await response.json();
      setWords(json);
      setIsLoading(false);
    })();
  }, [language, phrase]);

  const getOnChange = (i) => (e) =>
    setText((text) => ({
      ...text,
      [i]: e.target.value,
    }));

  useEffect(() => {
    const { length, results } = words;
    let newInputs = [];
    for (let i = 0; i <= length; i += 1) {
      const res = results[i];

      if (titles[i]) {
        newInputs.push(
          <H1>
            {titles[i]} <button onClick={() => deleteTitle(i)}>ˣ</button>
          </H1>
        );
      }
      if (res) {
        const { word, choices } = res;
        const input = (
          <SelectHolder key={`input-${i}`}>
            <Select onChange={getOnChange(i)} value={text[i]} defaultValue="">
              <option value="">({word})</option>
              {choices.map((choice, j) => (
                <option key={`choice-${i}-${j}`}>{choice}</option>
              ))}
            </Select>
            {text[i] &&
              (language === 'fr' ? (
                <span>
                  <ExternalLink
                    color="#305f7a"
                    url={`https://fr.wiktionary.org/wiki/${text[i]}`}
                  />
                  <ExternalLink url={`https://www.wordsense.eu/${text[i]}/`} />
                </span>
              ) : (
                <span>
                  <ExternalLink
                    color="#305f7a"
                    url={`https://en.wiktionary.org/wiki/${text[i]}`}
                  />
                  <ExternalLink
                    url={`https://openlibrary.org/search/inside?q=${text[i]}`}
                  />
                </span>
              ))}
          </SelectHolder>
        );
        newInputs.push(input);
      } else {
        const input = (
          <Input
            type="text"
            value={text[i]}
            key={`input-${i}`}
            onChange={getOnChange(i)}
          />
        );
        newInputs.push(input);
      }
    }
    setInputs(newInputs);
  }, [words, text, phrase, titles, language]);

  if (isLoading) {
    return null;
  }

  const done = Object.values(text).filter((t) => !!t.trim()).length;

  const wordsPerChapter = done / Object.values(titles).length;
  const estimatedChapters = Math.floor(words.length / wordsPerChapter);

  return (
    <>
      <FullPageImage src={'/common/map.webp'} opacity={0.05} />
      <Container>
        <SubContainer>{inputs}</SubContainer>
        <div>
          <Section>
            <FormattedText>{formattedText}</FormattedText>
            <Info>
              <p>
                Text length: {words.length} words — {done} written,{' '}
                {words.length - done} remaining
              </p>
              {wordsPerChapter > 0 && estimatedChapters > 0 && (
                <p>
                  At {Math.round(wordsPerChapter)} words per chapter, estimating{' '}
                  {estimatedChapters} chapters
                </p>
              )}
            </Info>
          </Section>
          <Section>
            <H2>Add title</H2>
            <AddTitle
              text={text}
              onSubmit={(index, string) => {
                setTitles((title) => ({
                  ...title,
                  [index]: string,
                }));
              }}
            />
          </Section>
          <Section>
            <H2>Settings</H2>
            <Input
              placeholder="The phrase you want to build"
              value={phrase}
              onChange={(event) => setPhrase(event.target.value)}
            />
            <Select
              onChange={(event) => setLanguage(event.target.value)}
              value={language}
            >
              <option disabled>Language</option>
              <option value="en">English</option>
              <option value="fr">French</option>
            </Select>
          </Section>
          <Section>
            <H2>Finalize</H2>
            <Button onClick={() => onDecrypt()}>Decrypt</Button>
          </Section>
        </div>
      </Container>
    </>
  );
};
