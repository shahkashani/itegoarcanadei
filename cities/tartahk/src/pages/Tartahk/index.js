import React, { useState } from 'react';

import styled, { css } from 'styled-components';
import {
  FadeIn,
  FullPageImage,
  MultiNarrative,
  FadeIn,
  LanguageContext,
  useLanguage,
  GodSettings,
} from '@itegoarcanadei/client-shared';

const Container = styled.div`
  position: relative;
  z-index: 1;
  max-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  box-sizing: border-box;
  padding: 50px;
  overflow-y: scroll;
  max-width: 600px;
  font-size: 1rem;
  line-height: 2.5;

  ${({ $isEnglish }) =>
    $isEnglish &&
    css`
      font-family: 'Tartahk';
      font-size: 1.2rem;
      line-height: 2;
    `};
`;

const SubContainer = styled.div`
  text-align: center;
  color: #ccc;
  box-sizing: border-box;
`;

export const Tartahk = () => {
  const [showFadeIn, setShowFadeIn] = useState(true);
  const languageData = useLanguage();
  const { isEnglish } = languageData;

  return (
    <LanguageContext.Provider value={languageData}>
      <FullPageImage src={'/the-whisper.jpg'} opacity={0.1} />
      <GodSettings city="Tartahk" />
      <Container $isEnglish={isEnglish}>
        <SubContainer>
          <MultiNarrative onComplete={() => null}>
            <p>
              I am suspended between worlds. Between our Arcadia, the Down Below
              and the Unknown. I am in Tartahk. I saw the name in my dreams and
              I put it to paper, without comprehending its meaning.
            </p>
            <p>
              I hear my friends behind me. I hear the hyenas below me. I hear
              unknown voices in the distance. I see seven flags unfurled. Safe
              lands. The city of Euphemia awaits beyond the gate, but what it
              is, I do not know.
            </p>
            <p>
              I must not move downwards. I escaped the Down Below once and I
              will not return. And I cannot return to our paradise - the road
              back is never the same. So there is only one direction.
            </p>
            <p>
              The world has shifted. Why has the world shifted? How did she find
              me? Am I the fire woman? The hanged man appeared in our visions
              and we paid no heed.
            </p>
            <p>
              In the Down Below, in another life, I heard whispers. I followed
              them. I did not understand it at the time. The voice, the phantom,
              a path through a gate. But now I do.
            </p>
            <p>🜃</p>
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
