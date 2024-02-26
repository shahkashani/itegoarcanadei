import styled, { css, keyframes } from 'styled-components';
import { useEffect, useRef, useState } from 'react';

import { FullPageVideo } from '../../components/FullPageVideo';
import {
  MultiNarrative,
  useLanguage,
  LanguageContext,
  GodSettings,
} from '@itegoarcanadei/client-shared';
import { Water } from '../../icons/Water';

const FADE_OUT_POINT = 180.6;
const COUNTDOWN_OFFSET = 5;
const COUNTDOWN_INTERVAL = 10;
const END_PAUSE = 2400;
const FADE_PAUSE = 1500;
const NEXT_CITY = 'https://andria.itegoarcanadei.com/';

const smoke = keyframes`
  100% {
    filter: blur(100px);
    opacity: 0;
  }
`;

const fade = keyframes`
  100% {
    opacity: 0;
  }
`;

const Cover = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  height: -webkit-fill-available;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  font-size: 1.5rem;

  ${({ $isEnglish }) =>
    $isEnglish &&
    css`
      font-family: 'Waltz';
      font-size: 1.8rem;
    `};
`;

const Letter = styled.div`
  padding: 50px;
  opacity: 0.8;

  p {
    margin: 5px;
    text-align: center;
  }
`;

const Poem = styled.div`
  text-align: center;
  color: #c29767;
  p {
    text-shadow: none;
  }
`;

const Her = styled.span`
  opacity: 0.5;
  animation: ${smoke} 4000ms both;
  animation-delay: ${({ num }) =>
    css`
      ${FADE_PAUSE + END_PAUSE + 5000 + num * 200}ms
    `};
`;

const Button = styled.div`
  animation: ${fade} 2000ms reverse ease-in-out;
  transition: opacity 2000ms ease-in-out;
  margin-bottom: 50px;
  cursor: pointer;

  svg {
    fill: #4f5d4e;
  }

  ${({ $isFading }) =>
    $isFading &&
    css`
      opacity: 0;
    `}

  svg {
    transition: fill 1000ms;
  }

  &:hover {
    svg {
      fill: #67857e;
    }
  }
`;

export const Esmeralda = ({ isMuted: propsIsMuted = true }) => {
  const [isMuted, setIsMuted] = useState(propsIsMuted);
  const [isShowNarrative, setIsShowNarrative] = useState(false);
  const [isShowPoem, setIsShowPoem] = useState(true);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [showContinue, setShowContinue] = useState(false);
  const [isHidingContinue, setIsHidingContinue] = useState(false);
  const ref = useRef();
  const languageData = useLanguage();
  const { isEnglish } = languageData;

  useEffect(() => {
    if (!isCountingDown) {
      return;
    }
    const id = setInterval(() => {
      if (ref.current.currentTime > FADE_OUT_POINT) {
        setIsShowNarrative(false);
        clearTimeout(id);
        setTimeout(() => {
          document.location.href = NEXT_CITY;
        }, 3000);
      }
    }, COUNTDOWN_INTERVAL);
    return () => clearTimeout(id);
  }, [isCountingDown, ref.current]);

  useEffect(() => {
    if (!isVideoPlaying) {
      return;
    }
    setTimeout(() => setIsShowNarrative(true), 4300);
  }, [isVideoPlaying]);

  return (
    <LanguageContext.Provider value={languageData}>
      <GodSettings
        triggerSettings={{ background: '#332a28', fill: '#806f6b' }}
        city="Esmeralda"
      />
      <div onClick={() => setIsMuted(false)}>
        <FullPageVideo
          ref={ref}
          still="/static/esmeralda.jpg"
          playsInline
          disablePictureInPicture
          muted={isMuted}
          onTime={(time) => {
            if (time > 0) {
              setIsVideoPlaying(true);
            }
            if (time >= FADE_OUT_POINT - COUNTDOWN_OFFSET) {
              setIsCountingDown(true);
            }
          }}
        >
          <source src="/static/esmeralda.mp4" type="video/mp4" />
        </FullPageVideo>
        <Cover $isEnglish={isEnglish}>
          <>
            {isShowPoem && (
              <Letter>
                <MultiNarrative
                  onComplete={() => {
                    setIsShowPoem(false);
                    if (isMuted) {
                      setShowContinue(true);
                    } else {
                      ref.current.play();
                    }
                  }}
                >
                  <div>
                    <Poem>
                      <p>And this I dreamt, and this I dream,</p>
                      <p>And some time this I will dream again,</p>
                      <p>And all will be repeated, all be re-embodied,</p>
                      <p>You will dream everything I have seen in dream.</p>
                    </Poem>
                  </div>
                  <div>
                    <Poem>
                      <p>
                        To one side from ourselves, to one side from the world
                      </p>
                      <p>Wave follows wave to break on the shore,</p>
                      <p>On each wave is a star, a person, a bird,</p>
                      <p>Dreams, reality, death - on wave after wave.</p>
                    </Poem>
                  </div>
                  <div>
                    <Poem>
                      <p>No need for a date: I was, I am, and I will be.</p>
                      <p>Life is a wonder of wonders, and to wonder</p>
                      <p>I dedicate myself, on my knees, like an orphan,</p>
                      <p>Alone — among mirrors — fenced in by reflections:</p>
                      <p>Cities and seas, iridescent, intensified.</p>
                    </Poem>
                  </div>
                  <div></div>
                </MultiNarrative>
              </Letter>
            )}
            {showContinue && (
              <Button
                $isFading={isHidingContinue}
                onClick={() => {
                  setIsHidingContinue(true);
                  setTimeout(() => {
                    ref.current.play();
                    setShowContinue(false);
                  }, 2000);
                }}
              >
                <Water width={100} />
              </Button>
            )}
            {isShowNarrative && (
              <Letter>
                <MultiNarrative
                  hideSpeedButton={true}
                  fadeDuration={FADE_PAUSE}
                  fadeAtEndPause={END_PAUSE}
                >
                  <div>
                    <p>I recall past lives.</p>
                  </div>
                  <div>
                    <div>
                      <p>I recall looking into the river.</p>
                      <p>This mirror, reflecting a different person.</p>
                    </div>
                    <div>
                      <p>
                        <Her>Darling.</Her>
                      </p>
                      <p>
                        <Her num={1}>Lake Tenaya will cradle us.</Her>
                      </p>
                      <p>
                        <Her num={2}>And all we leave behind.</Her>
                      </p>
                      <p>
                        <Her num={3}>Listen.</Her>
                      </p>
                      <p>
                        <Her num={4}>Ever-so faint slow tambourine.</Her>
                      </p>
                      <p>
                        <Her num={5}>Is marching back through time.</Her>
                      </p>
                    </div>
                  </div>
                  <div>
                    <p>The dreamer's lake.</p>
                    <p>Did you lead me here?</p>
                    <p>Did he follow me there?</p>
                  </div>
                  <div>
                    <p>Who is The Other?</p>
                  </div>
                  <div>
                    <div>
                      <p>The memories wash away.</p>
                      <p>I awake back in Esmeralda.</p>
                    </div>
                  </div>
                  <div>
                    <div>
                      <p>An endless journey.</p>
                      <p>In this land, time moves in strange ways.</p>
                      <p>Even I move in strange ways.</p>
                      <p>Has it been months?</p>
                      <p>Years?</p>
                      <p>Long enough now for me to understand its ways.</p>
                      <p>Understand how to navigate.</p>
                    </div>
                  </div>
                  <div>
                    <div>
                      <p>Interconnected cities.</p>
                      <p>Somehow out of reach from each other.</p>
                      <p>Winding paths, invisible shores.</p>
                      <p>Hidden doors.</p>
                      <p>Locked.</p>
                      <p>Locked for whose benefit?</p>
                    </div>
                  </div>
                  <div>
                    <div>
                      <p>I have begun to understand.</p>
                      <p>Why the cities hide.</p>
                      <p>Why each step I take repaves the path behind me.</p>
                      <p>Why the wind moves slowly, carefully.</p>
                      <p>There is strength in this knowledge.</p>
                      <p>Safety.</p>
                    </div>
                  </div>
                  <div>
                    <p>Yet.</p>
                    <div>
                      <p>
                        Not a second goes by that I don't miss Kati and
                        Remedios.
                      </p>
                      <p>Miss where I came from.</p>
                      <p>I worry.</p>
                      <p>I wonder if they are alive.</p>
                      <p>I wonder if Arcadia stands.</p>
                    </div>
                  </div>
                  <div>
                    <div>
                      <p>I see him.</p>
                      <p>Travelling place to place.</p>
                      <p>Looking for the Labyrinth.</p>
                    </div>
                  </div>
                  <div>
                    <div>
                      <p>And there are others.</p>
                      <p>Answers, directions come to me.</p>
                    </div>
                  </div>
                  <div>
                    <p>I enter desolate places and feel a certain warmth.</p>
                    <p>In Eudoxia, the presence of guardians.</p>
                    <p>In Procopia, the gaze of gentle spirits.</p>
                    <p>In Valdrada, comforting melodies in the distance.</p>
                    <p>Like small miracles.</p>
                    <p>I believe there are those watching out for me.</p>
                    <p>I feel them.</p>
                  </div>
                  <div>
                    <p>And you.</p>
                    <p>I know you are getting closer.</p>
                    <p>I can hear you.</p>
                    <p>I can hear the howls.</p>
                  </div>
                  <div>
                    <p>The glow is dying.</p>
                  </div>
                  <div>
                    <p>What will be in the darkness that remains?</p>
                  </div>
                </MultiNarrative>
              </Letter>
            )}
          </>
        </Cover>
      </div>
    </LanguageContext.Provider>
  );
};
