import React, { useEffect, useState } from 'react';

import { Library } from '../../components/Library';
import { Polygraphia } from '../../components/Polygraphia';
import styled, { css } from 'styled-components';
import {
  FullPageImage,
  MultiNarrative,
  LanguageContext,
  useLanguage,
  GodSettings,
} from '@itegoarcanadei/client-shared';

const Container = styled.div`
  margin: 0 auto;
  max-width: 700px;
  padding: 100px 50px;
  position: relative;
  z-index: 2;
  color: #ddd;
  text-align: center;

  ${({ $isEnglish }) =>
    $isEnglish &&
    css`
      font-size: 1.4rem;
      font-family: 'Alchemy';
      em {
        font-size: 1.2rem;
        letter-spacing: 1px;
      }
    `};
`;

const LibraryEntrance = styled.div`
  margin-top: 30px;
`;

const Quote = styled.span`
  font-family: Arial, Helvetica, sans-serif;
`;

export const Euphemia = () => {
  const [books, setBooks] = useState([]);
  const languageData = useLanguage();
  const { isEnglish } = languageData;

  const getBooks = async () => {
    const response = await fetch('/books');
    if (!response.ok) {
      return;
    }
    const responseBooks = await response.json();
    const useBooks = responseBooks.map((book) => ({
      ...book,
      Child: book.isPolygraphia ? Polygraphia : undefined,
    }));
    setBooks(useBooks);
  };

  useEffect(() => {
    getBooks();
  }, []);

  return (
    <LanguageContext.Provider value={languageData}>
      <FullPageImage src={'/static/bookstore.webp'} opacity={0.08} />
      <GodSettings city="Euphemia" />
      <Container $isEnglish={isEnglish}>
        <MultiNarrative>
          <div>
            <div>
              <p>The voices are no longer in the distance</p>
              <p>I am now surrounded by them</p>
              <p>Merchants, patrons, camels</p>
              <p>The smell of ginger, pistachios and poppy seeds</p>
            </div>
          </div>
          <div>
            <div>
              <p>I am bewildered and disoriented</p>
              <p>I felt my life drained from me in Tartahk</p>
              <p>Fragmented and torn between existences</p>
              <p>Unable to be saved or destroyed</p>
            </div>
          </div>
          <div>
            <div>
              <p>Yet, I was saved</p>
              <p>How?</p>
              <p>Why?</p>
            </div>
          </div>
          <div>
            <div>
              <p>I find myself in a market</p>
              <p>Unable to feel the presence of Kati and Remedios</p>
              <p>I hope they are alive</p>
              <p>I hope I am alive</p>
              <p>What is this place?</p>
              <p>How did I get here?</p>
            </div>
          </div>
          <div>
            <div>
              <p>As night falls, the streets become empty</p>
              <p>But the city does not</p>
              <p>I wander from fire to fire</p>
              <p>Scattered across the market</p>
              <p>Listening to stories</p>
              <p>They feel familiar</p>
              <p>Somehow too familiar</p>
            </div>
          </div>
          <div>
            <div>
              <p>The days pass</p>
              <p>Each minute feels like a new life</p>
              <p>I feel a slow transformation</p>
              <p>I know the city like it is my own</p>
              <p>Like it has always been my own</p>
              <p>The name Crookhey Hall fading from my memory</p>
            </div>
          </div>
          <div>
            <div>
              <p>On the third equinox, the book merchant arrives</p>
              <p>They are new here</p>
              <p>New to the voices and the clamour</p>
              <p>Like me, they seem lost and confused</p>
              <p>Like me, they find their way to the fires at night</p>
              <p>
                Like me, they instantly become part of the fabric of Euphemia
              </p>
            </div>
          </div>
          <div>
            <p>One night, when the moon is nowhere to be seen</p>
            <p>that one man utters a word</p>
            <p>
              {isEnglish ? (
                <em>Cormorant</em>
              ) : (
                <>
                  <Quote>&laquo;</Quote>Cormorant<Quote>&raquo;</Quote>
                </>
              )}
            </p>
            <p>The bookdealer and I trade memories</p>
            <p>And suddenly</p>
            <p>I remember</p>
            <p>Suddenly</p>
            <p>I understand his purpose</p>
          </div>
          <div>
            <p>The next morning, I enter the bookshop...</p>
            <LibraryEntrance>
              <Library books={books} />
            </LibraryEntrance>
          </div>
        </MultiNarrative>
      </Container>
    </LanguageContext.Provider>
  );
};
