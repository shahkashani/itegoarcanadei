import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';

import { Helmet } from 'react-helmet';
import { Circle } from '../../components/Circle';
import { Highlight } from '../../components/Highlight';
import { Triangle } from '../../components/Triangle';
import {
  FullPageImage,
  MultiNarrative,
  FadeContainer,
  FadeIn,
  LanguageContext,
  useLanguage,
  GodSettings,
} from '@itegoarcanadei/client-shared';

const Container = styled.div`
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  ${({ $isEnglish }) =>
    $isEnglish &&
    css`
      p {
        font-family: 'Lost Land';
        font-size: 1.8rem;
      }
    `}
`;

const SubContainer = styled.div`
  text-align: center;
  max-height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  font-size: 1.3rem;
  padding: 50px;
  color: #ccc;
  box-sizing: border-box;
`;

const Button = styled.button`
  cursor: pointer;
  outline: none;
  background: none;
  border: none;
  transition: transform 1000ms, opacity 1000ms;
  padding: 0;
  font-size: 0;
  line-height: 0;
  margin-top: 10px;
  opacity: 0.17;

  &:hover {
    opacity: 0.5;
  }

  ${({ $isHighlight }) =>
    $isHighlight &&
    css`
      &,
      &:hover {
        cursor: default;
        opacity: 1;
        transform: rotate(45deg);
      }
    `};

  ${({ $isFadeSquare }) =>
    $isFadeSquare &&
    css`
      &,
      &:hover {
        perspective: 400px;
        opacity: 0;
        transform: rotate(45deg) scale(2);
      }
    `};
`;

const Triangles = styled.div`
  font-size: 0;
  line-height: 1;
`;

export const Daphnis = () => {
  const [showFadeIn, setShowFadeIn] = useState(true);
  const [showNarrative, setShowNarrative] = useState(false);
  const [isHighlight, setIsHighlight] = useState(false);
  const [isNarrativeFinished, setIsNarrativeFinished] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [isFadeSquare, setIsFadeSquare] = useState(false);
  const languageData = useLanguage();

  useEffect(() => {
    if (isHighlight) {
      setShowImage(true);
      if (isFadeSquare === false) {
        setTimeout(() => {
          setIsFadeSquare(true);
        }, 2000);
      }
    }
  }, [isHighlight]);

  const text = `We waited for her beyond the Threshold
      Her presence was a miracle
      We felt it grow strong and stronger
      Until one day we were reunited
      Her helpers
      Her travel companions
      We were indebted
      We will forever be indebted
      *
      Suddenly I was back in the cabin
      Looking at them in the mirror
      Kati
      Remedios
      But we were not in the same room
      *
      There was a fourth
      My other
      The hyena
      Her face reflected
      Her eyes closed
      She took my place
      She banished me to this unreachable realm
      *
      Here too, the woods
      The Thin place
      Far from Arcadia
      Y|e|t contained within it
      A fire dreaming of a soundless sea
      at the Inn of the Dawn Horse
      *
      I'm reaching out
      Hoping you are still listening
      Still travelling
      Hoping my friends and the Dreamtiger
      are unscathed in the presence of the imposter
      *
      The |f|ull moon w|i|tness to this dark|n|ess
      I foun|d| a safe space
      |T|o deliver you t|h|is m|e|ssa|g|e
      Now I wait in the pl|a|ce beyond |t|ime
      Whil|e| she holds God's secrets`;

  const blocks = text.trim().split('*');
  const { isEnglish } = languageData;

  return (
    <LanguageContext.Provider value={languageData}>
      {isNarrativeFinished && (
        <Helmet>
          <title>{isHighlight ? '⟐' : '⊡'}</title>
        </Helmet>
      )}
      <GodSettings city="Daphnis" />
      <FullPageImage
        src={'/static/the-gate.jpg'}
        opacity={isHighlight ? 0 : 0.1}
      />
      {showImage && (
        <FullPageImage
          src={'/static/night-passage.jpg'}
          opacity={isHighlight ? 0.08 : 0}
        />
      )}
      <Container $isEnglish={isEnglish}>
        <SubContainer>
          {!showNarrative && (
            <FadeContainer
              delay={3000}
              onComplete={() => setShowNarrative(true)}
            >
              <Triangles>
                <Triangle isFilled={true} />
                <Triangle />
              </Triangles>
            </FadeContainer>
          )}
          {showNarrative && (
            <MultiNarrative onComplete={() => setIsNarrativeFinished(true)}>
              {blocks.map((block, blockIndex) => (
                <p key={`block-${blockIndex}`}>
                  {block.split('\n').map((line, index) => (
                    <Highlight
                      key={`highlight-${index}`}
                      isHighlight={isHighlight}
                    >
                      {line.trim()}
                    </Highlight>
                  ))}
                  {blockIndex === blocks.length - 1 && (
                    <Button
                      onClick={() => setIsHighlight(true)}
                      $isHighlight={isHighlight}
                      $isFadeSquare={isFadeSquare}
                    >
                      <Circle />
                    </Button>
                  )}
                </p>
              ))}
            </MultiNarrative>
          )}
        </SubContainer>
      </Container>
      {showFadeIn && (
        <FadeIn
          onComplete={() => setShowFadeIn(false)}
          duration={3000}
          callbackDelay={0}
        />
      )}
    </LanguageContext.Provider>
  );
};
