import React, { useEffect, useRef, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';

import {
  FullPageImage,
  MultiNarrative,
  LanguageContext,
  useLanguage,
  GodSettings,
} from '@itegoarcanadei/client-shared';

import { CrossFader } from '../../components/CrossFader';
import { Key } from '../../components/Key';
import { Letter } from '../../components/Letter';
import { Spiral } from '../../components/Spiral';

const Container = styled.div`
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  padding: 25%;
`;

const SubContainer = styled.div`
  text-align: center;
  max-height: 100%;
  font-size: 1.2rem;
  line-height: 2;
  color: #bb8138;
  box-sizing: border-box;
  margin-left: -10px;

  @media (max-width: 600px) {
    font-size: 1rem;
  }

  ${({ $isEnglish }) =>
    $isEnglish &&
    css`
      font-family: 'Indago Inn';
      line-height: 1.5;
    `};
`;

const Pre = styled.pre`
  max-height: 50vh;
  overflow-y: auto;
  overflow-x: hidden;
  width: 50vw;
`;

const Button = styled.button`
  background: none;
  border: none;
  transition: opacity 2s;
  cursor: pointer;
  opacity: 0.5;
  color: white;

  &:hover {
    opacity: 1;
  }

  ${({ $isFade }) =>
    $isFade &&
    css`
      &&& {
        cursor: default;
        opacity: 0;
      }
    `}
`;

const Portal = styled.div`
  width: 200px;
  cursor: pointer;
  height: 200px;
  position: absolute;
  top: calc(50% - 120px);
  left: calc(50% - 100px);
  background: #f7b557;
  border-radius: 100%;
  filter: blur(60px);
  transition: opacity 2s;
  opacity: 0.5;

  &:hover {
    &&& {
      opacity: 0.7;
    }
  }
`;

const fade = keyframes`
  from {
    color: inherit;
  }

  to {
    color: #659f4b;
  }
`;

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
`;
const G = styled.p`
  font-size: 3rem;

  @media (max-width: 600px) {
    font-size: 2rem;
  }
`;

const P = styled.p`
  font-size: 2rem;
  animation: ${fade} 4s 7s ease-in both;

  @media (max-width: 600px) {
    font-size: inherit;
  }
`;

const ItemContainer = styled.div`
  transition: opacity 2s;
  display: flex;
  flex-direction: column;
  gap: 20px;

  ${({ $isFade }) =>
    $isFade &&
    css`
        opacity: 0;
      }
    `};
`;

const FadeContainer = styled.div`
  animation: ${fadeIn} 2s ease-in-out;
`;

const crossFader = new CrossFader();
const isShowDebug = false;

export const TheIndagoInn = () => {
  const [count, setCount] = useState(1);
  const [ratio, setRatio] = useState(0);
  const [status, setStatus] = useState('');
  const [track, setTrack] = useState(null);
  const [isFadeInLetter, setIsFadingLetter] = useState(false);
  const [isShowEnvelope, setIsShowEnvelope] = useState(true);
  const [isShowLetter, setIsShowLetter] = useState(false);
  const [isShowKey, setIsShowKey] = useState(false);
  const [isFadeKey, setIsFadeKey] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isShowSpiral, setIsShowSpiral] = useState(false);
  const [isShowPortal, setIsShowPortal] = useState(false);
  const languageData = useLanguage();
  const { isEnglish } = languageData;

  const preRef = useRef();

  const onOpen = async (song) => {
    const response = await fetch('/kitchen/door', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        song,
      }),
    });
    if (response.ok) {
      const { portal } = await response.json();
      document.location.href = portal;
    }
  };

  const addStatus = (string) => {
    setStatus((status) => `${status}${string}\n`);
    setTimeout(() => {
      if (preRef.current) {
        preRef.current.scrollTop = preRef.current.scrollHeight;
      }
    }, 0);
  };

  useEffect(() => {
    const socket = io();
    socket.on('guest', ({ guests, ratio, music }) => {
      setCount(guests);
      setTrack(music);
      setRatio(ratio);
    });
    setTimeout(() => setIsShowKey(true), 3000);
  }, []);

  useEffect(() => {
    setIsShowPortal(ratio === 1);
  }, [ratio]);

  useEffect(() => {
    crossFader.setFile(track, addStatus);
  }, [track]);

  useEffect(() => {
    if (isFadeKey) {
      setTimeout(() => {
        setIsShowKey(false);
        setIsShowSpiral(true);
      }, 2000);
    }
  }, [isFadeKey]);

  useEffect(() => {
    if (isFadeInLetter) {
      setTimeout(() => {
        setIsShowKey(false);
        setIsShowEnvelope(false);
        setIsShowLetter(true);
        setIsFadingLetter(false);
      }, 2000);
    }
  }, [isFadeInLetter]);

  async function startSounds() {
    setIsFadeKey(true);
    if (!crossFader.hasContext()) {
      const context = new (window.AudioContext || window.webkitAudioContext)();
      if (!context.createGain) {
        context.createGain = context.createGainNode;
      }
      await context.resume();
      crossFader.setContext(context);
    }
    crossFader.toggle();
  }

  return (
    <LanguageContext.Provider value={languageData}>
      <FullPageImage
        src="/the-indago-inn.jpg"
        onDone={() => setIsImageLoaded(true)}
      />
      {isImageLoaded && (
        <>
          <GodSettings
            triggerSettings={{ background: '#3e2316', fill: '#fcc06a' }}
            city="Procopia"
          />
          <Container>
            <SubContainer $isEnglish={isEnglish}>
              {isShowSpiral && (
                <Spiral
                  ratio={ratio}
                  fill="#f7b557"
                  backFill="rgba(247, 181, 87, 0.2)"
                />
              )}
              {isShowLetter && (
                <FadeContainer>
                  <MultiNarrative
                    iconColor="#f7b557"
                    onComplete={() => {
                      setIsShowKey(true);
                      setIsShowLetter(false);
                    }}
                  >
                    <div>
                      <G>G,</G>
                      <p>
                        This is an attempt to contact you from the land where
                        all stories dwell. I want to tell you everything that
                        has happened since I arrived, but there is no time. I
                        still haven't found her. Our pages never seem to
                        overlap. Something tells me I am at the right place,
                        just not the right time.
                      </p>
                    </div>
                    <div>
                      <p>
                        There are people here who have met her. I met someone in
                        Euphemia who has received inquiries about her from the
                        beyond. Someone else is searching. Someone else is
                        following her moments through this land. Maybe it's a
                        guide. And maybe it's her other, trying to track her
                        down. I hope not. You and I both know the ramifications
                        if she finds her.
                      </p>
                    </div>
                    <div>
                      <p>
                        I try not to let it distract me, but I still don't know
                        what happened to the others. To the triad, to the
                        griffins, to the seekers. I hope you have been able to
                        find the site of the Breach. I know you are travelling,
                        I know you are looking, but there are too many places,
                        there are too many timelines.
                      </p>
                    </div>
                    <div>
                      <p>
                        I am at the Indāgo Inn, but she's not here. She was
                        supposed to be here. Actually, there's no one here. It
                        feels like the entire city is on pause. I am doing what
                        I can, but I don't know how long I can stay. I left her
                        the key to the room. Where it will lead, I cannot know.
                        I hope somehow it's to you. I hope it's to safety.
                      </p>
                    </div>
                    <div>
                      <p>
                        In the meanwhile, know I am well and that I'll see you
                        very soon.
                      </p>
                      <p>Love,</p>
                      <P>P.</P>
                    </div>
                    <div></div>
                  </MultiNarrative>
                </FadeContainer>
              )}
              {isShowKey && (
                <FadeContainer>
                  <ItemContainer $isFade={isFadeInLetter}>
                    <Button
                      onClick={() => startSounds()}
                      $isFade={isFadeKey}
                      disabled={isFadeKey}
                    >
                      <Key />
                    </Button>
                    {isShowEnvelope && (
                      <Button
                        $isFade={isFadeKey}
                        disabled={isFadeKey}
                        onClick={() => {
                          setIsFadingLetter(true);
                        }}
                      >
                        <Letter />
                      </Button>
                    )}
                  </ItemContainer>
                </FadeContainer>
              )}
              {isShowPortal && isShowSpiral && (
                <FadeContainer>
                  <Portal onClick={() => onOpen(track)} />
                </FadeContainer>
              )}
              {isShowDebug && <p>{count}</p>}
              {isShowDebug && <Pre ref={preRef}>{status}</Pre>}
            </SubContainer>
          </Container>
        </>
      )}
    </LanguageContext.Provider>
  );
};
