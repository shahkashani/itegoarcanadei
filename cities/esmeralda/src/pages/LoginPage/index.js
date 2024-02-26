import {
  FadeOut,
  useAudioPlayer,
  LanguageContext,
  useLanguage,
  GodSettings,
} from '@itegoarcanadei/client-shared';
import styled, { css, keyframes } from 'styled-components';
import { useEffect, useRef, useState } from 'react';

import { Circle } from '../../icons/Circle';
import { Feather } from '../../icons/Feather';
import { FullPageVideo } from '../../components/FullPageVideo';
import { InputIcon } from '../../icons/Input';
import { Letter } from '../../components/Letter';
import { Esmeralda } from '../Esmeralda';

const COVER_FADE_SPEED = 7000;
const PAGE_FADE_OUT = 5000;
const IS_LOGIN_ENABLED = true;

const shake = keyframes`
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }
  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }
  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
}`;

const fade = keyframes`
  0% {
    opacity: 0;
  }
`;

const featherFade = keyframes`
  0% {
    opacity: 0;
  }

  100% {
    opacity: 0.5;
  }
`;

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  transition: opacity 4000ms ease-in-out;

  *:focus {
    outline: 0;
  }

  ${({ $isEnglish }) =>
    $isEnglish &&
    css`
      font-family: 'Waltz';
      font-size: 1.5rem;
    `};
`;

const Cover = styled.div`
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  transition: background-color ${COVER_FADE_SPEED}ms ease-in-out;
  z-index: 1;

  ${({ $isFading }) =>
    $isFading &&
    css`
      background: transparent;
    `}

  ${({ $isClickable }) =>
    $isClickable &&
    css`
      cursor: pointer;
    `}
`;

const FeatherContainer = styled.div`
  position: absolute;
  bottom: 40px;
  right: 40px;
  animation: ${featherFade} 2000ms;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 500ms ease-in-out;
  font-size: 0;
  line-height: 1;
  z-index: 3;

  &:hover {
    opacity: 1;
  }
`;

const LoginContainer = styled.div`
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 50%;
  left: 0;
  right: 0;
  z-index: 2;
  transform: translateY(-50%);
`;

const FancyInput = styled.div`
  position: relative;
  font-size: 0;

  ${({ $isError }) =>
    $isError &&
    css`
      animation: ${shake} 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
      transform: translate3d(0, 0, 0);
      backface-visibility: hidden;
      perspective: 1000px;
    `}
`;

const StyledInputIcon = styled(InputIcon)`
  transition: stroke 1000ms;
  stroke: #403735;

  input:focus + & {
    stroke: #544e59;
  }
`;

const Input = styled.input`
  background: none;
  font-size: 1.5rem;
  padding: 15px 20px;
  color: #a59997;
  letter-spacing: 2px;
  border: none;
  font-family: Waltz, Helvetica, sans-serif;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  transform: rotate(-1deg);
`;

const BypassWrapper = styled.div`
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 50%;
  left: 0;
  right: 0;
  z-index: 2;
`;

const Bypass = styled.button`
  transform: translateY(calc(-50% + 100px)) rotate(-1deg);
  background: none;
  border: 0;
  color: #6b5c58;
  transition: color 250ms ease-in-out;
  cursor: pointer;
  font-size: 1.2rem;
  animation: ${fade} 1s ease-in-out;

  &:hover {
    color: #a59997;
  }
`;

export const LoginPage = () => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isShowCover, setIsShowCover] = useState(true);
  const [isFadingCover, setIsFadingCover] = useState(false);
  const [isShowFeather, setIsShowFeather] = useState(false);
  const [isShowLetter, setIsShowLetter] = useState(false);
  const [isShowLogin, setIsShowLogin] = useState(false);
  const [isLoginSuccess, setIsLoginSuccess] = useState(false);
  const [password, setPassword] = useState('');
  const [isError, setIsError] = useState(false);
  const [timerId, setTimerId] = useState(null);
  const [stopMusic, setStopMusic] = useState(null);
  const [isShowCity, setIsShowCity] = useState(false);
  const [inputType, setInputType] = useState('password');
  const languageData = useLanguage();
  const { isEnglish } = languageData;

  const onLogin = async (givenPassword) => {
    const result = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password: givenPassword || password,
      }),
    });
    if (result.ok) {
      setIsLoginSuccess(true);
      if (stopMusic) {
        stopMusic.fn.fade(PAGE_FADE_OUT / 1000);
      }
    } else {
      setIsError(true);
    }
  };

  useEffect(() => {
    if (!isError) {
      return;
    }
    if (timerId) {
      clearTimeout(timerId);
    }
    const timer = setTimeout(() => {
      setIsError(false);
      setTimerId(null);
    }, 1000);
    setTimerId(timer);
  }, [isError]);

  const { playAudio } = useAudioPlayer();
  const ref = useRef();

  useEffect(() => {
    if (ref.current) {
      ref.current.volume = 0;
    }
  }, [ref]);

  useEffect(() => {
    (async () => {
      if (!isAudioPlaying) {
        return;
      }

      setStopMusic({
        fn: await playAudio('/welcome.mp3', { loop: true }),
      });

      if (!IS_LOGIN_ENABLED) {
        const id = setTimeout(() => setIsShowCover(false), COVER_FADE_SPEED);
        return () => clearTimeout(id);
      }
    })();
  }, [isAudioPlaying]);

  if (isShowCity) {
    return <Esmeralda isMuted={false} />;
  }

  return (
    <LanguageContext.Provider value={languageData}>
      <GodSettings
        triggerSettings={{ background: '#332a28', fill: '#806f6b' }}
        city="Esmeralda"
      />
      <Wrapper
        $isEnglish={isEnglish}
        onClick={() => {
          setIsAudioPlaying(true);
          if (!IS_LOGIN_ENABLED) {
            setIsFadingCover(true);
          }
        }}
      >
        <FullPageVideo
          ref={ref}
          disablePictureInPicture
          playsInline
          autoPlay
          loop
          muted
        >
          <source src="/pt1.mp4" type="video/mp4" />
        </FullPageVideo>
        {isShowFeather && (
          <FeatherContainer>
            <Feather
              width={50}
              fill="#a59997"
              onClick={() => setIsShowLetter(true)}
            />
          </FeatherContainer>
        )}
        {isShowLogin && (
          <LoginContainer>
            <FancyInput $isError={isError}>
              <form
                onSubmit={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onLogin();
                }}
              >
                <Input
                  data-form-type="other"
                  autoComplete="off"
                  type={inputType}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <StyledInputIcon width={250} fill="none" strokeWidth={8} />
              </form>
            </FancyInput>
          </LoginContainer>
        )}
        {isShowLogin && (
          <BypassWrapper>
            <Bypass
              type="button"
              onClick={() => {
                setInputType('text');
                setPassword(process.env.PASSWORD);
                onLogin(process.env.PASSWORD);
              }}
            >
              Skip login
            </Bypass>
          </BypassWrapper>
        )}
        {isShowCover && (
          <Cover $isFading={isFadingCover} $isClickable={!isShowLogin}>
            <Circle
              isFadeAtEnd={!IS_LOGIN_ENABLED}
              width={200}
              fill="#403735"
              isAnimating={isAudioPlaying}
              onDone={() => {
                setIsShowFeather(true);
                if (IS_LOGIN_ENABLED) {
                  setIsShowLogin(true);
                }
              }}
            />
          </Cover>
        )}
        {isShowLetter && <Letter onDone={() => setIsShowLetter(false)} />}
        {isLoginSuccess && (
          <FadeOut
            duration={PAGE_FADE_OUT}
            onComplete={() => {
              setIsShowCity(true);
            }}
          />
        )}
      </Wrapper>
    </LanguageContext.Provider>
  );
};
