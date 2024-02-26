import {
  FadeImage,
  FullPageImage,
  ScalableContainer,
  WithFade,
  blurInput,
  useImageScale,
  LanguageContext,
  useLanguage,
  GodSettings,
} from '@itegoarcanadei/client-shared';
import { createRef, useEffect, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';

import { Video } from '../../components/Video';
import { FarewellVideo } from '../../components/FarewellVideo';

const SCALE_PROPS = {
  width: 3212,
  height: 3600,
  isCover: false,
  isCenter: true,
};

const SPIN_SPEED = 5000;
const FADE_TO_WHITE_SPEED = 5000;

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
`;

const spin = keyframes`
  100% {
    transform: rotate(180deg);
  }
`;

const smoke = keyframes`
  0% {
    opacity: 0;
  }
  30% {
    opacity: 1;
  }
  60% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

const fade = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const Wrapper = styled.div`
  position: absolute;
  transform: translateZ(0);
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  user-select: none;
  ${({ $isComplete }) =>
    $isComplete &&
    css`
      animation: ${spin} ${SPIN_SPEED}ms ease-in-out both;
    `}
`;

const Letters = styled.div`
  position: absolute;
  text-align: center;
  bottom: 130px;
  width: 100%;
  font-size: 180px;
  z-index: 5;
  color: #c0bfa0;
  text-shadow: 0 0 40px rgba(0, 0, 0, 0.8);
  font-family: 'Midnight Caller';
`;

const letters = [
  'I',
  ' T',
  'e',
  'g',
  'o',
  ' A',
  'r',
  'c',
  'a',
  'n',
  'a',
  ' D',
  'e',
  'i',
];

const Letter = styled.span`
  animation: ${smoke} 4s ease-in both;
`;

const Farewell = styled(FadeImage)`
  position: absolute;
  right: 0;
  top: 0;
  z-index: 2;
`;

const Gate = styled(FadeImage)`
  position: absolute;
  right: 0;
  top: 0;
  z-index: 4;
`;

const Leonora = styled(Video)`
  position: absolute;
  right: 420px;
  bottom: 850px;
  height: 1300px;
  z-index: 3;
  filter: sepia(1);
  transform: rotate(180deg);
`;

const StyledScalableContainer = styled(ScalableContainer)`
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.5);
`;

const Input = styled.input`
  width: 300px;
  padding: 10px;
  outline: none;
  border: none;
  border-radius: 40px;
  background: rgba(196, 193, 162, 0.8);
  font-size: 2rem;
  line-height: 2;
  color: #292019;
  text-align: center;
  transition: background-color 1s, color 1s;

  &::placeholder {
    color: #696756;
  }

  ${({ $isError }) =>
    $isError &&
    css`
      background: #cc4747;
      animation: ${shake} 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    `};
`;

const FormWrapper = styled(WithFade)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ $isEnglish }) =>
    $isEnglish &&
    css`
      font-family: 'Midnight Caller';
    `}
`;

const Background = styled(FullPageImage)`
  transform: scale(1.2);
`;

const FadeToWhite = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 200;
  background: white;
  animation: ${fade} ${FADE_TO_WHITE_SPEED}ms ease-in-out both;
`;

const AnswerSvg = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  fill: rgba(130, 25, 30, 0.3);
  animation: ${fade} 2s ease-in-out both;
`;

const Polygon = styled.polygon`
  cursor: pointer;
  filter: blur(5px);
`;

export const Adelma = () => {
  const [index, setIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isShowVideo, setIsShowVideo] = useState(false);
  const [isFarewellLoaded, setIsFarewellLoaded] = useState(false);
  const [isGateLoaded, setIsGateLoaded] = useState(false);
  const [isShowInput, setIsShowInput] = useState(false);
  const [text, setText] = useState('');
  const [arcanaResult, setArcanaResult] = useState(null);
  const [isError, setIsError] = useState(false);
  const [isFadeToWhite, setIsFadeToWhite] = useState(false);
  const [isFaded, setIsFaded] = useState(false);
  const [destination, setDestination] = useState(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const languageData = useLanguage();
  const { isEnglish } = languageData;

  const [answerName, setAnswerName] = useState(null);
  const [answerCoordinates, setAnswerCoordinates] = useState([
    [2039, 1186],
    [2102, 1301],
    [2036, 1425],
    [1978, 1329],
  ]);

  const ref = createRef();

  useEffect(() => {
    if (isFadeToWhite) {
      const timer = setTimeout(() => {
        setIsFaded(true);
      }, FADE_TO_WHITE_SPEED);
      return () => clearTimeout(timer);
    }
  }, [isFadeToWhite]);

  useEffect(() => {
    if (!ref.current || !isShowVideo) {
      return;
    }
    ref.current.play();
  }, [ref, isShowVideo]);

  useEffect(() => {
    if (isGateLoaded) {
      setIsShowVideo(true);
    }
  }, [isGateLoaded]);

  useEffect(() => {
    if (isError) {
      setTimeout(() => setIsError(false), 1000);
    }
  }, [isError]);

  const { scale } = useImageScale(SCALE_PROPS);

  const requestArcana = async (index, coordinates) => {
    const response = await fetch('/arcana', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        step: index + 1,
        x: coordinates.x,
        y: coordinates.y,
      }),
    });
    if (!response.ok) {
      return;
    }
    const result = await response.json();
    if (!result.arcana) {
      return false;
    }
    setArcanaResult(result);
    setAnswerName(result.name);
    setIsShowInput(true);
  };

  const submitInput = async () => {
    const response = await fetch('/journey', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        entry: text,
        step: index + 1,
        x: (arcanaResult || {}).x,
        y: (arcanaResult || {}).y,
      }),
    });
    if (!response.ok) {
      setIsError(true);
      return;
    }
    const result = await response.json();
    setAnswerCoordinates(result.coordinates);
    blurInput();
    setTimeout(() => {
      setText('');
    }, 2000);
    setIsShowInput(false);
    setTimeout(() => {
      setIndex((i) => i + 1);
    }, 500);
    if (result.destination) {
      setDestination(result.destination);
      setTimeout(() => {
        setIsComplete(true);
      }, 3500);
    }
  };

  if (isFaded) {
    return (
      <FarewellVideo
        onEnded={() => {
          if (destination) {
            window.location.href = destination;
          }
        }}
        stills={[
          { url: '/labyrinth-remedios.webp', from: 15, to: 30 },
          { url: '/labyrinth-leonora.webp', from: 45, to: 60 },
          { url: '/leonora.jpg', from: 70, to: 90 },
        ]}
        playsInline
        disablePictureInPicture
      >
        <source
          src={isEnglish ? '/farewell-en.mp4' : '/farewell.mp4'}
          type="video/mp4"
        />
      </FarewellVideo>
    );
  }

  return (
    <LanguageContext.Provider value={languageData}>
      <Background src="/adelma.jpg" fadeSpeed={5000} opacity={0.05} />
      {isImageLoaded && (
        <GodSettings
          triggerSettings={{ background: '#201d18', fill: '#8a876e' }}
          city="Adelma"
        />
      )}
      <Wrapper $isComplete={isComplete}>
        <StyledScalableContainer {...SCALE_PROPS}>
          <div
            onClick={async (event) => {
              if (isComplete) {
                return;
              }
              const bounds = event.currentTarget.getBoundingClientRect();
              const x = Math.round((event.clientX - bounds.left) / scale);
              const y = Math.round((event.clientY - bounds.top) / scale);
              await requestArcana(index, { x, y });
            }}
          >
            <FadeImage
              src="/la-maja-del-tarot.jpg"
              width="100%"
              dimTo={1}
              onLoaded={() => setIsImageLoaded(true)}
            />
            {isImageLoaded &&
              answerCoordinates &&
              answerCoordinates.length > 0 && (
                <AnswerSvg key={answerCoordinates.join(',')}>
                  <Polygon
                    points={answerCoordinates.map((c) => c.join(',')).join(' ')}
                  />
                </AnswerSvg>
              )}
          </div>
          {isComplete && (
            <Farewell
              src="/farewell.webp"
              fadeSpeed={SPIN_SPEED}
              easing="ease-in-out"
              onComplete={() => setIsFarewellLoaded(true)}
            />
          )}
          {isShowVideo && (
            <Leonora
              onDone={() => setIsFadeToWhite(true)}
              disablePictureInPicture
              playsInline
              autoPlay
              muted
              ref={ref}
            >
              <source src="/leonora.mp4" type="video/mp4" />
            </Leonora>
          )}
          {isFarewellLoaded && (
            <Gate
              src="/gate.webp"
              fadeSpeed={100}
              easing="ease-in-out"
              onComplete={() => setIsGateLoaded(true)}
            />
          )}
          <Letters>
            <Letter key={index}>{letters.slice(0, index).join('')}</Letter>
          </Letters>
        </StyledScalableContainer>
      </Wrapper>
      <FormWrapper
        $isEnglish={isEnglish}
        isVisible={isShowInput}
        onClick={() => {
          setIsShowInput(false);
          setText('');
        }}
      >
        <form
          onClick={(e) => e.stopPropagation()}
          onSubmit={(e) => {
            e.preventDefault();
            submitInput();
          }}
        >
          <Input
            $isError={isError}
            autoFocus={true}
            type="text"
            value={text}
            placeholder={answerName}
            onChange={(e) => setText(e.target.value)}
          />
        </form>
      </FormWrapper>
      {isFadeToWhite && <FadeToWhite />}
    </LanguageContext.Provider>
  );
};
