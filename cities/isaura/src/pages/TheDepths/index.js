import React, { useState } from 'react';

import {
  FullPageImage,
  MultiNarrative,
  FadeIn,
  LanguageContext,
  useLanguage,
  GodSettings,
} from '@itegoarcanadei/client-shared';
import styled, { css } from 'styled-components';

const Container = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  padding: 50px;
  box-sizing: border-box;
  font-size: 1.2rem;
  line-height: 2.2;
  color: #bfb8b6;
  max-width: 800px;

  ${({ $isEnglish }) =>
    $isEnglish &&
    css`
      font-family: 'Berlin';
      font-size: 1.5rem;
      line-height: 1.5;
    `};
`;

const SubContainer = styled.div`
  text-align: center;
`;

const Quote = styled.span`
  font-family: 'Berlin';
  padding: 0 2px;
`;
export const TheDepths = () => {
  const [showFadeIn, setShowFadeIn] = useState(true);
  const languageData = useLanguage();
  const { isEnglish } = languageData;

  return (
    <LanguageContext.Provider value={languageData}>
      <FullPageImage src="/isaura.jpg" opacity={0.08} />
      <GodSettings city="Isaura" triggerSettings={{ fill: '#bfb8b6' }} />
      <Container $isEnglish={isEnglish}>
        <SubContainer>
          <MultiNarrative onComplete={() => null}>
            <p>In the depths, I hear the gods say...</p>
            <div>
              <p>
                <Quote>“</Quote>See the porphyry column and the silver empress,
                in the place where the emperors give rule to the city! Of what
                name is she, you might ask?<Quote>”</Quote>
              </p>
            </div>
          </MultiNarrative>
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
