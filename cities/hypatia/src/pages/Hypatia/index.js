import {
  FadeImage,
  FullPageImage,
  MultiNarrative,
  useAudioPlayer,
  LanguageContext,
  useLanguage,
  GodSettings,
} from '@itegoarcanadei/client-shared';
import styled, { css, keyframes } from 'styled-components';

import { useState } from 'react';

const SPIRAL_FADE_MS = 5000;

const smoke = keyframes`
  100% {
    filter: blur(10rem);
    opacity: 0;
  }
`;

const spin = keyframes`
  100% {
    transform: rotate(1440deg) scale(0);
    opacity: 0;
  }
`;

const Wrapper = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 40px;
  display: flex;
  justify-content: center;
  align-items: center;

  *:focus {
    outline: 0;
  }

  @media (max-width: 720px) {
    padding: 20px;
  }

  @media (max-width: 200px) {
    padding: 0;
  }
`;

const StyledMultiNarrative = styled(MultiNarrative)`
  font-size: 2rem;
  color: #ccc;
  line-height: 2;
  text-align: center;

  ${({ $isEnglish }) =>
    $isEnglish &&
    css`
      font-family: 'Hylas';
    `};
`;

const P = styled.p`
  color: #eeb845;
  animation: ${smoke} 15s 10s both;
`;

const Historia = styled.div`
  width: 120px;
  filter: contrast(1.6);
  opacity: 0.8;
  cursor: pointer;

  ${({ $isSpin }) =>
    $isSpin &&
    css`
      animation: ${spin} ${SPIRAL_FADE_MS}ms both;
    `};

  img {
    width: 100%;
  }
`;

const Map = styled(FullPageImage)`
  filter: sepia(1);
`;

export const Hypatia = () => {
  const { playAudio, initializeAudio } = useAudioPlayer();
  const [isShowSpiral, setIsShowSpiral] = useState(true);
  const [isShowNarrative, setIsShowNarrative] = useState(false);
  const [isNarrativeDone, setIsNarrativeDone] = useState(false);
  const languageData = useLanguage();
  const { isEnglish } = languageData;

  return (
    <LanguageContext.Provider value={languageData}>
      <GodSettings city="Hypatia" />
      <Wrapper onClick={() => initializeAudio()}>
        <Map
          src={'/static/hypatia.jpg'}
          opacity={isNarrativeDone ? 0 : 0.05}
          onLoad={() => {
            setTimeout(() => setIsShowSpiral(true), 1000);
          }}
        />
        {!isShowNarrative && (
          <Historia
            $isSpin={!isShowSpiral}
            onClick={() => {
              initializeAudio();
              playAudio('/static/hypatia.mp3');
              setIsShowSpiral(false);
              setTimeout(() => {
                setIsShowNarrative(true);
              }, SPIRAL_FADE_MS);
            }}
          >
            <FadeImage src="/static/historia.webp" />
          </Historia>
        )}
        {isShowNarrative && (
          <StyledMultiNarrative
            $isEnglish={isEnglish}
            onComplete={() => {
              setTimeout(() => {
                setIsNarrativeDone(true);
              }, 7000);
            }}
            iconColor="#aaa"
          >
            <div>
              <p>Leonora.</p>
            </div>
            <div>
              <p>I saw you descend into Lake Tenaya.</p>
            </div>
            <div>
              <p>And then daylight leaked in.</p>
            </div>
            <div>
              <p>I resurfaced from my own dreams into the common dream.</p>
              <p>And things assumed again their proper places.</p>
              <p>And their accustomed shapes.</p>
            </div>
            <div>
              <p>But something was different.</p>
            </div>
            <div>
              <p>The world had shifted.</p>
            </div>
            <div>
              <p>A door had been unlocked.</p>
            </div>
            <div>
              <p>Night and day, I am the seeker.</p>
              <div>
                <p>Every morn and every night.</p>
                <p>Some are born to sweet delight.</p>
                <p>Some are born to sweet delight.</p>
                <p>Some are born to endless night.</p>
              </div>
            </div>
            <div>
              <p>Dates mean nothing to you.</p>
              <p>But I have been travelling for years.</p>
              <p>Town to town and far beyond.</p>
              <p>Under the guise of entertainment.</p>
              <p>Looking for the entrance.</p>
            </div>
            <div>
              <p>In a reflection...</p>
            </div>
            <div>
              <p>An echo, which was theirs...</p>
            </div>
            <div>
              <p>And now is mine, without my knowing it...</p>
            </div>
            <div>
              <p>Below the night...</p>
            </div>
            <div>
              <p>There it was.</p>
            </div>
            <div>
              <p>The door.</p>
              <p>Leaned against the darkness.</p>
            </div>
            <div>
              <p>I opened it.</p>
              <p>And found myself waiting on the other side.</p>
            </div>
            <div>
              <p>Now time does not matter.</p>
              <p>In this place there are no days.</p>
              <p>Only this unwritten path to find you.</p>
            </div>
            <div>
              <p>Leonora.</p>
              <p>Will I see you at the gate?</p>
            </div>
            <div>
              <p>Badb.</p>
              <p>The goddess of doom.</p>
              <p>The crone.</p>
              <p>The crow.</p>
              <p>For whom do you call?</p>
            </div>
            <div>
              <P>What story down there awaits its end?</P>
            </div>
          </StyledMultiNarrative>
        )}
      </Wrapper>
    </LanguageContext.Provider>
  );
};
