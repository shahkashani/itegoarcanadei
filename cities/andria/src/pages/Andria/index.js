import {
  FadeImage,
  FullPageImage,
  ScalableContainer,
  LanguageContext,
  useLanguage,
  GodSettings,
  blurInput,
} from '@itegoarcanadei/client-shared';
import styled, { css, keyframes } from 'styled-components';
import { useEffect, useState } from 'react';

const SHOW_ANSWER_TIME = 5000;
const ANSWER_FADE_TIME = 2000;
const NEXT_QUESTION_WAIT_TIME = 5;

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

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }

  100% {
    opacity: 100%;
  }
`;

const starFade = keyframes`
  0% {
    opacity: 0;
  }

  100% {
    opacity: 0.8;
  }
`;

const spin = keyframes`
  100% {
    transform: rotate(360deg);
  }
`;

const constellationFade = keyframes`
  0% {
    opacity: 0;
  }

  100% {
    opacity: 0.3;
  }
`;

const Wrapper = styled.div`
  position: relative;
  font-size: 0;
`;

const Poem = styled.div`
  font-size: 16px;
  text-align: center;
  color: white;
  user-select: none;
  text-shadow: 1px 1px 0 black;
  animation: ${fadeIn} 4000ms ease-in-out,
    ${fadeIn} 2000ms 4000ms ease-out reverse forwards;

  ${({ $isEnglish }) =>
    $isEnglish &&
    css`
      font-family: 'Hyginus';
      font-style: italic;
      font-size: 20px;
    `};
`;

const SvgHolder = styled.div`
  position: absolute;
  width: 570px;
  top: 150px;
  left: 100px;
  z-index: 2;
  opacity: ${({ $opacity }) => $opacity};

  ${({ $isRevealingAnswer }) =>
    $isRevealingAnswer &&
    css`
      transition: opacity ${ANSWER_FADE_TIME}ms;
    `}

  svg {
    fill: white;

    [data='star'] {
      opacity: 0.8;
    }

    ${({ $isRevealingAnswer }) =>
      !$isRevealingAnswer &&
      css`
        [data='star'] {
          animation: ${starFade} 5000ms both;
          opacity: 0.5;
        }
      `}

    [data='constellation'] {
      animation: ${constellationFade} 5000ms both;
    }
  }
`;

const Image = styled(FadeImage)`
  width: 100%;
  animation-timing-function: ease-in;
`;

const Form = styled.form`
  position: absolute;
  bottom: 130px;
  right: 60px;
  display: flex;
  animation: ${fadeIn} 2000ms ease-in-out both;
`;

const Input = styled.input`
  background: none;
  border: none;
  border-bottom: 1px solid #bbb;
  color: white;
  letter-spacing: 2px;
  font-size: 24px;
  width: 350px;
  text-transform: none;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #888;
    font-style: italic;
    font-size: 30px;
  }

  ${({ $isEnglish }) =>
    $isEnglish &&
    css`
      font-family: 'Hyginus';
      font-size: 32px;
    `};

  ${({ $isError }) =>
    $isError &&
    css`
      animation: ${shake} 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
      transform: translate3d(0, 0, 0);
      backface-visibility: hidden;
      perspective: 1000px;
    `}
`;

const StyledPortal = styled.img`
  width: 600px;
  user-select: none;
  cursor: pointer;
  position: absolute;
  top: 140px;
  left: 90px;
  z-index: 2;
  fill: #ddd;
  animation: ${fadeIn} 4000ms ease-in-out both, ${spin} 15000ms linear infinite;
`;

export const Andria = () => {
  const [svg, setSvg] = useState(null);
  const [currentId, setCurrentId] = useState(null);
  const [name, setName] = useState('');
  const [opacity, setOpacity] = useState(1);
  const [isShowForm, setIsShowForm] = useState(false);
  const [isRevealingAnswer, setIsRevealingAnswer] = useState(false);
  const [portal, setPortal] = useState(null);
  const [isError, setIsError] = useState(false);
  const [timerId, setTimerId] = useState(null);
  const [isFirstReady, setIsFirstReady] = useState(false);
  const [isShowPoem, setIsShowPoem] = useState(false);
  const [answer, setAnswer] = useState(null);
  const [isShowConstellations, setIsShowConstellations] = useState(false);
  const [isReadyToLoad, setIsReadyToLoad] = useState(false);
  const [isBackgroundLoaded, setIsBackgroundLoaded] = useState(false);
  const languageData = useLanguage();
  const { isEnglish } = languageData;

  useEffect(() => {
    (async () => {
      if (!isReadyToLoad) {
        return;
      }
      const result = await fetch(`/constellation`);
      if (!result.ok) {
        return;
      }
      const { constellation, id, name } = await result.json();
      setCurrentId(id);
      setSvg(constellation);
      setAnswer(name);
      setIsFirstReady(true);
    })();
  }, [isReadyToLoad]);

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
    return () => clearTimeout(timer);
  }, [isError]);

  useEffect(() => {
    if (!isFirstReady) {
      return;
    }
    const id = setTimeout(() => {
      setIsShowForm(true);
    }, 7000);
    return () => clearTimeout(id);
  }, [isFirstReady]);

  useEffect(() => {
    if (!isShowPoem) {
      return;
    }
    const id = setTimeout(() => {
      setIsShowPoem(false);
      setIsShowConstellations(true);
    }, 6000);
    return () => clearTimeout(id);
  }, [isShowPoem]);

  const onSubmit = async () => {
    const result = await fetch('/constellation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        id: currentId,
      }),
    });
    if (!result.ok) {
      setIsError(true);
      return;
    }
    blurInput();
    setName('');
    setIsRevealingAnswer(true);
    const json = await result.json();
    const { current, next } = json;
    setSvg(current.constellation);

    setTimeout(() => {
      setOpacity(0);
    }, SHOW_ANSWER_TIME);

    setTimeout(() => {
      setIsRevealingAnswer(false);
      setOpacity(1);
      setSvg('');
    }, SHOW_ANSWER_TIME + ANSWER_FADE_TIME);

    setTimeout(() => {
      if (next.id) {
        setCurrentId(next.id);
        setSvg(next.constellation);
        setAnswer(next.name);
      }
      if (next.portal) {
        setPortal(next.portal);
        setIsShowForm(false);
        setAnswer(null);
      }
    }, SHOW_ANSWER_TIME + ANSWER_FADE_TIME + NEXT_QUESTION_WAIT_TIME);
  };

  return (
    <LanguageContext.Provider value={languageData}>
      <Wrapper>
        <FullPageImage
          src="/12155.jpg"
          align="bottom"
          opacity={0.3}
          onDone={() => {
            setIsBackgroundLoaded(true);
            setTimeout(() => setIsShowPoem(true), 2000);
          }}
        />
        {isBackgroundLoaded && <GodSettings city="Andria" />}
        {isShowPoem && (
          <Poem $isEnglish={isEnglish}>
            <p>As above, so below.</p>
          </Poem>
        )}
        {isShowConstellations && (
          <ScalableContainer
            width={1280}
            height={1761}
            padding={40}
            isCover={false}
            isCenter={true}
          >
            <Image
              fadeSpeed={5000}
              src={'/andria.jpg'}
              opacity={1}
              onComplete={() => setIsReadyToLoad(true)}
            />
            {svg && (
              <SvgHolder
                $opacity={opacity}
                $isRevealingAnswer={isRevealingAnswer}
                dangerouslySetInnerHTML={{ __html: svg }}
              />
            )}
            {isShowForm && (
              <Form
                onSubmit={(e) => {
                  onSubmit();
                  e.preventDefault();
                }}
              >
                <Input
                  $isEnglish={isEnglish}
                  $isError={isError}
                  type="text"
                  autoCapitalize="off"
                  autoCorrect="off"
                  autoComplete="off"
                  value={name}
                  placeholder={answer || 'What is my name?'}
                  onChange={(e) => setName(e.currentTarget.value)}
                />
              </Form>
            )}

            {portal && (
              <a href={portal}>
                <StyledPortal src="/vortex.png" />
              </a>
            )}
          </ScalableContainer>
        )}
      </Wrapper>
    </LanguageContext.Provider>
  );
};
