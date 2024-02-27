import { Children, useEffect, useMemo, useState } from 'react';
import ChildrenUtils from 'react-children-utilities';
import styled, { css, keyframes } from 'styled-components';

const MS_PER_WORD_SLOW = 300;
const MS_PER_WORD_FAST = 100;

const SpeedIcon = ({ width, height, fill, isFast = false }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      height={height}
      width={width}
      fill={fill || '#888'}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      {isFast ? (
        <path d="M16.5 16.5a47.38 47.38 0 1 0 67 67 47.38 47.38 0 0 0-67-67zm46.3 31.4c-5.2 9-10.4 17.9-15.5 26.9 0 0 0 .1-.1.1-.4.7-.8 1.3-1.6 1-.9-.3-.7-1.1-.6-1.8.4-2.3.8-4.5 1.3-6.8.7-4 1.5-7.9 2.2-11.9.1-.3.1-.7.1-1.2-.5 0-.9-.1-1.3-.1h-8.8c-1.7 0-2.1-.7-1.3-2.2 5.2-9 10.4-17.9 15.5-26.9 0 0 0-.1.1-.1.4-.7.8-1.3 1.6-1 .9.3.7 1.1.6 1.8-.4 2.3-.8 4.5-1.3 6.8-.7 4-1.5 7.9-2.2 11.9-.1.3-.1.7-.1 1.2.5 0 .9.1 1.3.1h8.8c1.7 0 2.1.7 1.3 2.2z" />
      ) : (
        <path d="M16.5 16.5a47.38 47.38 0 1 0 67 67 47.38 47.38 0 0 0-67-67zm59.4 59.4a36.76 36.76 0 0 1-51.9 0A36.76 36.76 0 0 1 24 24C38.3 9.7 61.6 9.7 75.9 24s14.4 37.6 0 51.9zm-13.1-28c-5.2 9-10.4 17.9-15.5 26.9 0 0 0 .1-.1.1-.4.7-.8 1.3-1.6 1-.9-.3-.7-1.1-.6-1.8.4-2.3.8-4.5 1.3-6.8.7-4 1.5-7.9 2.2-11.9.1-.3.1-.7.1-1.2-.5 0-.9-.1-1.3-.1h-8.8c-1.7 0-2.1-.7-1.3-2.2 5.2-9 10.4-17.9 15.5-26.9 0 0 0-.1.1-.1.4-.7.8-1.3 1.6-1 .9.3.7 1.1.6 1.8-.4 2.3-.8 4.5-1.3 6.8-.7 4-1.5 7.9-2.2 11.9-.1.3-.1.7-.1 1.2.5 0 .9.1 1.3.1h8.8c1.7 0 2.1.7 1.3 2.2z" />
      )}
    </svg>
  );
};

const EyeIcon = ({ width, height, fill, isPaused = false }) => (
  <svg
    height={height}
    width={width}
    fill={fill || '#888'}
    viewBox="0 0 98 63"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M96.8873518,30.0395257 C96.6897233,29.6442688 91.3537549,22.5296443 82.8557312,15.0197628 C77.9150198,10.6719368 72.7766798,7.11462451 67.6383399,4.743083 C61.1166008,1.58102767 54.7924901,0 48.6660079,0 C42.5395257,0 36.0177866,1.58102767 29.6936759,4.743083 C24.555336,7.31225296 19.416996,10.6719368 14.4762846,15.0197628 C5.97826087,22.3320158 0.64229249,29.6442688 0.444664032,30.0395257 C-0.148221344,30.8300395 -0.148221344,31.8181818 0.444664032,32.4110672 C0.64229249,32.8063241 5.97826087,39.9209486 14.4762846,47.43083 C19.416996,51.7786561 24.555336,55.3359684 29.6936759,57.7075099 C36.215415,60.8695652 42.5395257,62.4505929 48.6660079,62.4505929 C54.7924901,62.4505929 61.3142292,60.8695652 67.6383399,57.7075099 C72.7766798,55.1383399 77.9150198,51.7786561 82.8557312,47.43083 C91.3537549,40.1185771 96.6897233,32.8063241 96.8873518,32.4110672 C97.4802372,31.8181818 97.4802372,30.8300395 96.8873518,30.0395257 Z M48.6660079,50 C38.3893281,50 29.8913043,41.5019763 29.8913043,31.2252964 C29.8913043,20.9486166 38.3893281,12.4505929 48.6660079,12.4505929 C58.9426877,12.4505929 67.4407115,20.9486166 67.4407115,31.2252964 C67.4407115,41.5019763 58.9426877,50 48.6660079,50 Z"></path>
    {isPaused && (
      <>
        <rect x="38" y="22" width="8" height="20" rx="2.5"></rect>
        <rect x="51" y="22" width="8" height="20" rx="2.5"></rect>
      </>
    )}
  </svg>
);

const StopIcon = ({ width, height, fill }) => {
  return (
    <svg
      version="1.0"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill={fill || '#888'}
      viewBox="0 0 100 100"
    >
      <rect x="0" y="0" width="100" height="100" rx="10%"></rect>
    </svg>
  );
};

const fade = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const Container = styled.div`
  opacity: ${({ $isHidden }) => ($isHidden ? 0 : 1)};
  transition: opacity ${({ $duration }) => $duration}ms;
`;

const Wrapper = styled.span`
  display: ${({ $isInline }) => ($isInline ? 'inline-block' : 'block')};

  user-select: none;
  opacity: ${({ $isHidden }) => ($isHidden ? 0 : 1)};

  ${({ $useTextShadow }) =>
    $useTextShadow &&
    css`
      text-shadow: 0 0 5px rgba(0, 0, 0, 0.7);
    `}

  ${({ $isShowing }) =>
    $isShowing &&
    css`
      animation: ${({ $duration }) => $duration}ms ${fade} ease-in-out forwards;
    `}
`;

const Skip = styled.button`
  cursor: pointer;
  background: none;
  border: none;
  color: white;
  margin: 0;
  padding: 0;
  fill: white;
  opacity: ${({ $isActive }) => ($isActive ? 0.4 : 0.2)};
  transition: opacity 250ms ease-in-out;
  font-size: 1em;
  text-align: center;
  margin-right: 7px;

  &:focus {
    outline: none;
  }

  &:hover {
    opacity: 0.6;
  }
`;

const Controls = styled.div`
  display: flex;
  justify-content: center;
  position: fixed;
  right: 20px;
  top: 20px;
  font-size: 0;
  animation: 2000ms ${fade} ease-in-out forwards;
`;

export const MultiNarrative = ({
  children,
  className,
  fadeDuration,
  delayBetween,
  fadeAtEndPause,
  onComplete = () => null,
  onSkip,
  iconColor,
  useTextShadow = true,
  onlyLastParagraph = true,
  hideSpeedButton = false,
  hideControls = false,
}) => {
  const [narrativeIndex, setNarrativeIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isFast, setIsFast] = useState(false);
  const [isShowControls, setIsShowControls] = useState(!hideControls);
  const count = Children.count(children);
  const useDelayBetween = delayBetween ? delayBetween : isFast ? 1000 : 2000;

  const onSkipClick = () => {
    setIsPaused(false);
    setNarrativeIndex(count - 1);
    setIsShowControls(false);
    onSkip?.();
  };

  const onPause = () => {
    setIsPaused((paused) => !paused);
  };

  const narratives = Children.map(children, (child, index) => (
    <Narrative
      className={className}
      useTextShadow={useTextShadow}
      key={`narrative-${index}`}
      fadeDuration={fadeDuration}
      delayBetween={useDelayBetween}
      fadeAtEndPause={fadeAtEndPause}
      isPaused={isPaused}
      isFadeAtEnd={index !== count - 1}
      onlyLastParagraph={onlyLastParagraph}
      msPerWord={isFast ? MS_PER_WORD_FAST : MS_PER_WORD_SLOW}
      onComplete={() => {
        if (narrativeIndex < count - 1) {
          setNarrativeIndex((c) => Math.min(count - 1, c + 1));
        } else {
          setIsShowControls(false);
          onComplete();
        }
      }}
    >
      {child.props.children}
    </Narrative>
  ));

  return (
    <>
      {isShowControls && (
        <Controls>
          <Skip
            title="Pause narrative"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onPause();
            }}
            $isActive={isPaused}
          >
            <EyeIcon height={14} isPaused={isPaused} fill={iconColor} />
          </Skip>
          {!fadeAtEndPause && !hideSpeedButton && (
            <Skip
              title={isFast ? 'Slow down narrative' : 'Speed up narrative'}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setIsFast(!isFast);
              }}
            >
              <SpeedIcon height={18} isFast={isFast} fill={iconColor} />
            </Skip>
          )}
          <Skip
            title="Skip narrative"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onSkipClick();
            }}
          >
            <StopIcon height={14} fill={iconColor} />
          </Skip>
        </Controls>
      )}
      {narratives[narrativeIndex]}
    </>
  );
};

const getWordCount = (children, onlyLastParagraph) => {
  const array = Children.toArray(children);
  const useChildren = onlyLastParagraph ? array.slice(-1) : array;
  return useChildren.reduce(
    (memo, child) => memo + ChildrenUtils.onlyText(child).split(/\s+/).length,
    0
  );
};

export const Narrative = ({
  children,
  fadeDuration = 1000,
  delayBetween = 2000,
  isFadeAtEnd = false,
  isPaused = false,
  useTextShadow = true,
  msPerWord,
  fadeAtEndPause,
  onlyLastParagraph,
  className,
  onComplete = () => null,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFadingOut, setIsFadeOut] = useState(false);
  const [timerId, setTimerId] = useState(null);
  const useEndPause = useMemo(
    () =>
      fadeAtEndPause || !msPerWord
        ? fadeAtEndPause
        : getWordCount(children, onlyLastParagraph) * msPerWord,
    [children, fadeAtEndPause, msPerWord, onlyLastParagraph]
  );

  useEffect(() => {
    clearTimeout(timerId);
    if (isPaused) {
      return;
    }
    if (currentIndex >= Children.count(children)) {
      if (isFadeAtEnd) {
        const timer = setTimeout(() => {
          setIsFadeOut(true);
          const timer = setTimeout(() => {
            onComplete();
          }, fadeDuration);
          setTimerId(timer);
        }, fadeDuration + useEndPause);
        setTimerId(timer);
      } else {
        onComplete();
      }
    } else {
      const timer = setTimeout(() => {
        setCurrentIndex((index) => index + 1);
      }, fadeDuration + delayBetween);
      setTimerId(timer);
    }
    return () => {
      clearTimeout(timerId);
    };
  }, [currentIndex, fadeDuration, delayBetween, onComplete, isPaused]);

  return (
    <Container
      $isHidden={isFadingOut}
      $duration={fadeDuration}
      className={className}
    >
      {Children.toArray(children).map((child, index) => {
        return (
          <Wrapper
            key={`child-${index}`}
            $useTextShadow={useTextShadow}
            $duration={fadeDuration}
            $isHidden={index >= currentIndex}
            $isShowing={index === currentIndex}
            $isInline={child.type === 'span'}
          >
            {child}
          </Wrapper>
        );
      })}
    </Container>
  );
};
