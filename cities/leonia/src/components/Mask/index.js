import { FullPageImage, WithFade } from '@itegoarcanadei/client-shared';
import styled, { css, keyframes } from 'styled-components';
import { useEffect, useMemo, useState } from 'react';

const SEPIA_LEFT = 'iqsuq';
const SEPIA_RIGHT = 'tallirpik';
const COLOR_FULL = 'qavangurtur';

const PULL_SPEED = 1000;

const FLASH_IN_SPEED = 1000;
const PULL_DISTANCE_INITIAL = 50;
const PULL_DISTANCE_MAX = 250;
const PULL_EASING = 'cubic-bezier(0.5, 0, 0.75, 0)';

const leftie = keyframes`
  0% {
    transform: translateX(-${PULL_DISTANCE_INITIAL}px);
  }

  90% {
  transform: translateX(-${PULL_DISTANCE_MAX}px);
  }

  100% {
  transform: translateX(0);
  }
`;

const rightie = keyframes`
  0% {
    transform: translateX(${PULL_DISTANCE_INITIAL}px);
  }

  90% {
  transform: translateX(${PULL_DISTANCE_MAX}px);
  }

  100% {
  transform: translateX(0);
  }

`;

const StyledImage = styled(FullPageImage).attrs({
  fit: 'contain',
  zIndex: 'inherit',
})`
  padding: 5%;
`;

const StyledImageShadow = styled(StyledImage)`
  filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.8));
  transition: filter ${PULL_SPEED}ms ${PULL_EASING};
`;

const LeftImage = styled(StyledImageShadow)`
  transform: translateX(-${PULL_DISTANCE_INITIAL}px);
  will-change: transform;

  ${({ $isPull }) =>
    $isPull &&
    css`
      filter: none;
      animation: ${leftie} ${PULL_SPEED}ms ${PULL_EASING} both;
    `}
`;

const RightImage = styled(StyledImageShadow)`
  transform: translateX(${PULL_DISTANCE_INITIAL}px);
  will-change: transform;

  ${({ $isPull }) =>
    $isPull &&
    css`
      filter: none;
      animation: ${rightie} ${PULL_SPEED}ms ${PULL_EASING} both;
    `}
`;

const Shatter = styled(WithFade)`
  position: absolute;
  bottom: 20px;
  left: 50%;
  z-index: 2;
  transform: translateX(-50%);
`;

const ShatterButton = styled.button`
  font-family: Sinapius;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  transition: all 500ms;
  padding: 5px 10px;
  border-radius: 5px;
  margin: 0;
  line-height: 2;
  background: var(--darker-accent);
  color: var(--lighter-accent);

  &:hover {
    background: var(--dark-accent);
  }

  &:active {
    background: var(--darker-accent);
  }

  ${({ $isEnglish }) =>
    $isEnglish &&
    css`
      font-family: 'Leonia';
    `}
`;

const file = (name) => `/${name}.webp`;

export const Mask = ({
  isShowFuseAnimation,
  isShowFull,
  isShowLeft,
  isShowRight,
  numShatter = 5,
  onShatter,
  onFuse,
  className,
  canShatter,
  isEnglish,
}) => {
  const [isLeftLoaded, setIsLeftLoaded] = useState(false);
  const [isRightLoaded, setIsRightLoaded] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [clickTimerId, setClickTimerId] = useState(null);
  const [isShowBrokenFlash, setIsShowBrokenFlash] = useState(false);
  const [isShowFullMask, setIsShowFullMask] = useState(isShowFull);
  const [isShowLeftMask, setIsShowLeftMask] = useState(isShowLeft);
  const [isShowRightMask, setIsShowRightMask] = useState(isShowRight);

  const isVisible = useMemo(
    () => isShowLeftMask || isShowRightMask || isShowFullMask,
    [isShowLeftMask, isShowRightMask, isShowFullMask]
  );

  useEffect(() => {
    if (isShowBrokenFlash) {
      return;
    }
    setIsShowFullMask(isShowFull);
  }, [isShowFull]);

  useEffect(() => {
    if (isShowBrokenFlash) {
      return;
    }
    setIsShowLeftMask(isShowLeft);
  }, [isShowLeft]);

  useEffect(() => {
    if (isShowBrokenFlash) {
      return;
    }
    setIsShowRightMask(isShowRight);
  }, [isShowRight]);

  useEffect(() => {
    if (
      !isShowLeftMask ||
      !isShowRightMask ||
      !isLeftLoaded ||
      !isRightLoaded
    ) {
      return;
    }
    if (isShowFuseAnimation) {
      const id = setTimeout(() => {
        onFuse?.();
      }, PULL_SPEED);
      return () => clearTimeout(id);
    }
  }, [
    isShowLeftMask,
    isShowRightMask,
    isLeftLoaded,
    isRightLoaded,
    isShowFuseAnimation,
  ]);

  const shatter = () => {
    setIsShowBrokenFlash(true);
    setIsShowFullMask(false);
    setIsShowLeftMask(true);
    setIsShowRightMask(true);

    onShatter?.();

    setTimeout(() => {
      setIsShowFullMask(isShowFull);
      setIsShowLeftMask(isShowLeft);
      setIsShowRightMask(isShowRight);
      setIsShowBrokenFlash(false);
    }, FLASH_IN_SPEED - 50);
  };

  useEffect(() => {
    clearTimeout(clickTimerId);

    if (clickCount >= numShatter) {
      setClickCount(0);
      shatter();
      return;
    }

    if (clickCount > 0) {
      const id = setTimeout(() => {
        setClickCount(0);
      }, 1000);
      setClickTimerId(id);
      return () => clearTimeout(id);
    }
  }, [clickCount]);

  return (
    <>
      <WithFade
        className={className}
        isVisible={isVisible}
        isFadeEnabled={!isShowBrokenFlash}
        onClick={() => {}}
      >
        <WithFade isVisible={isShowFullMask} isFadeEnabled={!isShowBrokenFlash}>
          <StyledImage
            fadeSpeed={500}
            src={file(COLOR_FULL)}
            isFadeEnabled={!isShowBrokenFlash}
          />
        </WithFade>
        <WithFade isVisible={isShowLeftMask} isFadeEnabled={!isShowBrokenFlash}>
          <LeftImage
            $isPull={isShowFuseAnimation}
            isFadeEnabled={!isShowBrokenFlash}
            fadeSpeed={500}
            src={file(SEPIA_LEFT)}
            onDone={() => setIsLeftLoaded(true)}
          />
        </WithFade>
        <WithFade
          isVisible={isShowRightMask}
          isFadeEnabled={!isShowBrokenFlash}
        >
          <RightImage
            $isPull={isShowFuseAnimation}
            isFadeEnabled={!isShowBrokenFlash}
            fadeSpeed={500}
            src={file(SEPIA_RIGHT)}
            onDone={() => setIsRightLoaded(true)}
          />
        </WithFade>
      </WithFade>
      <Shatter
        isVisible={isShowFullMask && canShatter}
        isFadeEnabled={!isShowBrokenFlash}
        onClick={(e) => {
          e.preventDefault();
          shatter();
        }}
      >
        <ShatterButton $isEnglish={isEnglish}>
          <span>Break mask apart</span>
        </ShatterButton>
      </Shatter>
    </>
  );
};
