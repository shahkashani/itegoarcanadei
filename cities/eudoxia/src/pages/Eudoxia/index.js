import React, { useState } from 'react';

import {
  FullPageImage,
  FadeImage,
  MultiNarrative,
  LanguageContext,
  useLanguage,
  GodSettings,
  WithFade,
  useAudioPlayer,
} from '@itegoarcanadei/client-shared';
import styled, { css } from 'styled-components';

const WIDTH = 2000;
const HEIGHT = 2880;
const BREAKPOINT = 800;

const x = (value) => `${(value / WIDTH) * 100}%`;
const y = (value) => `${(value / HEIGHT) * 100}%`;

const PageWrapper = styled.div`
  ${({ $isEnglish }) =>
    $isEnglish &&
    css`
      font-family: 'Alchemy';
    `};
`;

const Container = styled.div`
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  padding: 10%;
`;

const ImageWrapper = styled.div`
  height: 90vh;
  max-height: ${HEIGHT / 2}px;
  position: relative;
  font-size: 0;
  line-height: 0;

  @media (max-width: ${BREAKPOINT}px) {
    height: auto;
    max-height: auto;
    width: 90vw;
  }
`;

const MainImage = styled(FadeImage)`
  height: 100%;

  @media (max-width: ${BREAKPOINT}px) {
    width: 100%;
    height: auto;
  }
`;

const FirstFish = styled(FadeImage)`
  position: absolute;
  width: ${x(836)};
  left: ${x(695)};
  top: ${y(2084)};
  height: auto;
  user-select: none;
`;

const Bird = styled(FadeImage)`
  position: absolute;
  width: ${x(1227)};
  left: ${x(423)};
  top: ${y(187)};
  height: auto;
  user-select: none;
`;

const SecondFish = styled(FadeImage)`
  position: absolute;
  width: ${x(231)};
  left: ${x(847)};
  top: ${y(281)};
  height: auto;
  user-select: none;
`;

const Egg = styled(FadeImage)`
  position: absolute;
  width: ${x(74)};
  left: ${x(1582)};
  top: ${y(1318)};
  height: auto;
  user-select: none;
`;

const Div = styled.div`
  position: absolute;
  width: ${x(74)};
  height: ${y(117)};
  left: ${x(1582)};
  top: ${y(1317)};
  border-radius: 50%;
`;

const NarrativeContainer = styled.div`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 10%;
  position: absolute;
  top: 0;
  left: 0;
  line-height: 130%;
  color: #a7938b;
  text-shadow: 0 0 5px #2a0b00;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: max(12px, min(2vh, 24px));

  @media (max-width: ${BREAKPOINT}px) {
    font-size: max(14px, 2.5vw);
  }
`;

const PlaySong = styled(WithFade)`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 10px;
  text-align: center;
  z-index: 2;

  button {
    font-family: inherit;
    background: #1a1613;
    border: none;
    border-radius: 5px;
    outline: none;
    cursor: pointer;
    padding: 8px 10px;
    color: #ccb390;
  }
`;

function isTouchEnabled() {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
}

export const Eudoxia = () => {
  const [seenBg, setSeenBg] = useState(false);
  const [seenNarrative, setSeenNarrative] = useState(false);
  const [seenFish1, setSeenFish1] = useState(false);
  const [seenFish2, setSeenFish2] = useState(false);
  const [seenBird, setSeenBird] = useState(false);
  const [isGo, setGo] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showDiv, setShowDiv] = useState(isTouchEnabled());
  const languageData = useLanguage();
  const { playAudio } = useAudioPlayer();
  const { isEnglish } = languageData;

  return (
    <LanguageContext.Provider value={languageData}>
      <PageWrapper $isEnglish={isEnglish}>
        <FullPageImage src="/griffin.jpg" opacity={0.12} />
        <GodSettings
          triggerSettings={{ background: '#292020' }}
          city="Eudoxia"
        />
        <Container>
          <ImageWrapper
            onMouseEnter={() => (isTouchEnabled() ? null : setShowDiv(true))}
            onMouseLeave={() => (isTouchEnabled() ? null : setShowDiv(false))}
          >
            <MainImage
              startDelay={1000}
              fadeSpeed={4000}
              src="/1.jpg"
              onComplete={() => setSeenBg(true)}
            />
            {seenBg && !seenNarrative && (
              <NarrativeContainer>
                <MultiNarrative
                  iconColor="#463535"
                  onComplete={() => setSeenNarrative(true)}
                >
                  <div>
                    <div>
                      <p>I remember the moths.</p>
                      <p>They surrounded me.</p>
                      <p>I was the light.</p>
                      <p>And so were they.</p>
                      <p>Kati.</p>
                      <p>Remedios.</p>
                      <p>The triad protecting the Breach.</p>
                      <p>The threshold.</p>
                      <p>The great barrier.</p>
                    </div>
                  </div>
                  <div>
                    <div>
                      <p>The night ended.</p>
                      <p>But the sun did not rise.</p>
                      <p>And now I know why.</p>
                    </div>
                  </div>
                  <div>
                    <div>
                      <p>Oh, I remember you.</p>
                      <p>The old guardians.</p>
                      <p>Dwelling under Arcadia.</p>
                      <p>Waiting for instructions.</p>
                      <p>You awoke to greet us.</p>
                      <p>You awoke.</p>
                      <p>The little immortals.</p>
                      <p>The Sidheogaidhe.</p>
                    </div>
                  </div>
                  <div>
                    <div>
                      <p>Where are they now?</p>
                      <p>Where am I now?</p>
                    </div>
                  </div>
                  <div>
                    <div>
                      <p>Eudoxia.</p>
                      <p>This city and I are one.</p>
                      <p>This tapestry, these streets.</p>
                      <p>The blueprint and the reality.</p>
                      <p>A mirror of the celestial world.</p>
                    </div>
                  </div>
                  <div>
                    <div>
                      <p>Which is the manifest version of the other?</p>
                      <p>Which voice is mortal and which is divine?</p>
                    </div>
                    <div>
                      <p>What hides in the images that we weave?</p>
                    </div>
                  </div>
                  <div></div>
                </MultiNarrative>
              </NarrativeContainer>
            )}
            {seenNarrative && (
              <FirstFish
                startDelay={2000}
                fadeSpeed={3000}
                src="/2.png"
                onComplete={() => setSeenFish1(true)}
              />
            )}
            {seenBird && (
              <SecondFish
                fadeSpeed={3000}
                src="/4.png"
                onComplete={() => setSeenFish2(true)}
              />
            )}
            {seenFish1 && (
              <Bird
                fadeSpeed={5000}
                src="/3.png"
                onComplete={() => setSeenBird(true)}
              />
            )}
            {isGo && <Egg src="/ovum.png" />}
            {seenFish2 && !isGo && showDiv && (
              <Div
                onClick={() => setGo(true)}
                onTouchStart={() => setGo(true)}
              />
            )}
          </ImageWrapper>
        </Container>
        <PlaySong
          isVisible={!isPlayingAudio && seenNarrative}
          onClick={() => {
            if (!isPlayingAudio) {
              setIsPlayingAudio(true);
              playAudio('/loom.mp3');
            }
          }}
        >
          <button>Hear the voice hidden in the griffin</button>
        </PlaySong>
      </PageWrapper>
    </LanguageContext.Provider>
  );
};
