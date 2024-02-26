import React, { useEffect, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import {
  MultiNarrative,
  FadeIn,
  FullPageImage,
  LanguageContext,
  useLanguage,
  GodSettings,
} from '@itegoarcanadei/client-shared';
import { Buckets } from '../../components/Buckets';

const fade = keyframes`
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
`;

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
  max-height: 100vh;
  max-width: 800px;
  overflow-y: scroll;

  ${({ $isEnglish }) =>
    $isEnglish &&
    css`
      font-family: 'Berlin';
      font-size: 1.5rem;
      line-height: 1.5;
      letter-spacing: 1px;
    `};
`;

const SubContainer = styled.div`
  text-align: center;
`;

const BucketCoverContainer = styled.div`
  transition: opacity 2s ease-out;
  opacity: ${({ opacity }) => opacity};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  background: black;
`;

const Audio = styled.audio`
  position: relative;
  z-index: 2;
  animation: 2000ms ${fade} ease-in-out forwards reverse;
`;

export const Isaura = () => {
  const [showFadeIn, setShowFadeIn] = useState(true);
  const [bucketCoverOpacity, setBucketCoverOpacity] = useState(0.5);
  const [showNarrative, setShowNarrative] = useState(true);
  const [startNarrative, setStartNarrative] = useState(false);
  const [imageOpacity, setImageOpacity] = useState(0.16);
  const [showAudio, setShowAudio] = useState(false);
  const [isWindy, setIsWindy] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const languageData = useLanguage();
  const { isEnglish } = languageData;

  useEffect(() => {
    setTimeout(() => {
      setStartNarrative(true);
    }, 3000);
  }, []);

  useEffect(() => {
    if (isWindy) {
      setTimeout(() => {
        setIsWindy(false);
      }, 0);
    }
  }, [isWindy]);

  return (
    <LanguageContext.Provider value={languageData}>
      <FullPageImage src="/pages.jpg" opacity={imageOpacity} />
      <GodSettings triggerSettings={{ fill: '#bfb8b6' }} city="Isaura" />
      <Buckets
        isWindy={isWindy}
        num={6}
        duration={showNarrative ? 100000 : 45000}
        generateRandomWind={isPlaying}
      />
      {showNarrative && (
        <>
          <BucketCoverContainer opacity={bucketCoverOpacity} />
          <Container $isEnglish={isEnglish}>
            <SubContainer>
              {startNarrative && (
                <MultiNarrative
                  iconColor="#746447"
                  onComplete={() => {
                    setBucketCoverOpacity(0);
                    setImageOpacity(0.08);
                    setTimeout(() => {
                      setShowNarrative(false);
                      setShowAudio(true);
                    }, 2000);
                  }}
                >
                  <div>
                    <p>
                      On my final encounter with the Storykeeper before
                      departing Euphemia, he recollected a meeting in which I
                      had inquired about a book whose title now escapes me.
                    </p>
                  </div>
                  <div>
                    <p>
                      Of the many things I could no longer remember, this
                      meeting was one.
                    </p>
                  </div>
                  <div>
                    <p>Was it really me? Was it her?</p>
                  </div>
                  <div>
                    <p>
                      There is an Other waiting in the shadows, wearing out the
                      solitudes, obstructing my path.
                    </p>
                  </div>
                  <div>
                    <p>What is her fate?</p>
                    <p>What is mine?</p>
                    <p>
                      Each of us seeks the other and finds nothing but the ashes
                      of fires.
                    </p>
                  </div>
                  <div>
                    <p>
                      I lived a lifetime in Euphemia. Another's lifetime. There
                      were moments where I felt the remnants of a different
                      world. There were moments of distress and worry for those
                      I no longer knew.
                    </p>
                  </div>
                  <div>
                    <p>
                      I recalled close friends. A Dreamtiger. A Guide. And then,
                      an imposter. I had lost the thread that connected them,
                      when one night, my name and my purpose returned to me in a
                      dream.
                    </p>
                  </div>
                  <div>
                    <p>
                      I was enveloped in blind darkness. Suddenly, a triangle of
                      fire appeared. Line by line, it revealed its presence to
                      me. It surrounded me.
                    </p>
                  </div>
                  <div>
                    <p>
                      The Gods of the Dead send false dreams to the world above.
                    </p>
                  </div>
                  <div>
                    <p>Is this where I found myself?</p>
                    <p>Who was the dreamer?</p>
                  </div>
                  <div>
                    <p>
                      Not illuminating the night, it amplified the darkness.
                      Deprived of sight, I could now hear every sound.
                    </p>
                  </div>
                  <div>
                    <p>In my ear, my name.</p>
                    <p>On my side, my companions.</p>
                    <p>In the distance, a path.</p>
                  </div>
                  <div>
                    <span>The river.&nbsp;</span>
                    <span>Lethe.</span>
                  </div>
                  <div>
                    <p>I scaled the mountains and made my way.</p>
                    <p>I heard the waves, with amnesia in their lullaby.</p>
                    <p>I heard a familiar melody grow stronger and stronger.</p>
                  </div>
                  <div>
                    <p>El barco velero.</p>
                  </div>
                  <div>
                    <p>
                      Waiting for her, the one whose name I had forgotten.
                      Waiting for me.
                    </p>
                  </div>
                  <div>
                    <p>
                      As I traveled, I drank the water that brought her back to
                      me.
                    </p>
                  </div>
                  <div>
                    <p>We are our memory.</p>
                    <p>We are that chimerical museum of shifting shapes.</p>
                    <p>We are the pile of broken mirrors.</p>
                  </div>
                  <div>
                    <p>
                      I passed below the giant rock in the sky. I felt its pull.
                    </p>
                  </div>
                  <div>
                    <p>I heard voices from far away, beckoning.</p>
                    <p>Another world. Another time.</p>
                    <p>I felt the presence of gods around me.</p>
                  </div>
                  <div>
                    <p>I did not know where I was. Only the name Isaura.</p>
                  </div>
                  <div>
                    <span>And then,&nbsp;</span>
                    <span>the gods spoke.</span>
                  </div>
                  <div></div>
                </MultiNarrative>
              )}
            </SubContainer>
          </Container>
        </>
      )}
      {showAudio && (
        <>
          <Audio
            controls
            onPlay={() => {
              setIsPlaying(true);
              setIsWindy(true);
            }}
            preload="auto"
            onEnded={() => setIsPlaying(false)}
            onPause={() => setIsPlaying(false)}
          >
            <source src="/isaura.mp3" type="audio/mpeg" />
          </Audio>
        </>
      )}
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
