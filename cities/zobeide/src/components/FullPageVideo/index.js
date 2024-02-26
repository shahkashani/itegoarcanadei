import { forwardRef, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';

import { WithFade, useLocalStorage } from '@itegoarcanadei/client-shared';

const FADE_SECONDS = 10;

export const Video = styled.video`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  height: -webkit-fill-available;
  margin: 0;
  padding: 0;
  z-index: 0;
  user-select: none;
  z-index: -1;
  object-fit: cover;
  object-position: center center;
  transition: opacity ${FADE_SECONDS}s;
  background: none;

  @media (hover: none) {
    object-fit: contain;
  }

  ${({ $isFade }) =>
    $isFade &&
    css`
      opacity: 0;
    `};
`;

const Skip = styled.button`
  position: fixed;
  top: 10px;
  border: 0;
  background: black;
  color: white;
  padding: 8px 12px;
  right: 10px;
  opacity: 0.3;
  transition: opacity 1s ease-in-out;
  cursor: pointer;
  font-family: 'Zobeide';

  &:hover {
    opacity: 0.8;
  }

  @media (hover: hover) {
    opacity: 0;
  }

  ${({ $isHover }) =>
    $isHover &&
    css`
      @media (hover: hover) {
        opacity: 0.3;
      }
    `}
`;

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

export const FullPageVideo = forwardRef(
  ({ onEnd, fadeMainFromEndSeconds, still, ...props }, ref) => {
    const [hasPlayed, setIsHasPlayed] = useState(false);
    const [hasIntroPlayed, setHasIntroPlayed] = useState(false);
    const [isVideoFading, setIsVideoFading] = useState(false);
    const [isStillFading, setIsStillFading] = useState(false);
    const [isHover, setIsHover] = useState(true);
    const [isVideoFullOpacity, setIsVideoFullOpacity] = useState(false);
    const [hasSeenVideo, setHasSeenVideo] = useLocalStorage(
      'whoisthedreamer',
      false
    );

    useEffect(() => {
      if (hasPlayed) {
        setTimeout(() => {
          setIsVideoFullOpacity(true);
        }, FADE_SECONDS * 1000);
      }
    }, [hasPlayed]);

    useEffect(() => {
      if (isVideoFading) {
        setHasSeenVideo(true);
      }
    }, [isVideoFading]);

    return (
      <Wrapper
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <WithFade
          isVisible={hasPlayed && !isVideoFading && hasSeenVideo}
          fadeDuration={FADE_SECONDS * 1000}
        >
          <Skip $isHover={isHover} onClick={() => onEnd()}>
            Skip video
          </Skip>
        </WithFade>
        {still && (!isVideoFullOpacity || isVideoFading) && (
          <Video
            $isFade={!hasIntroPlayed || isStillFading}
            style={{ filter: 'brightness(0.2)' }}
            playsInline
            muted
            loop
            autoPlay
            disablePictureInPicture
            onTimeUpdate={(event) => {
              const { currentTime } = event.target;
              if (currentTime > 0) {
                setHasIntroPlayed(true);
              }
            }}
          >
            <source src={still} type="video/mp4" />
          </Video>
        )}
        <Video
          $isFade={!hasPlayed || isVideoFading}
          ref={ref}
          {...props}
          onTimeUpdate={(event) => {
            const { currentTime, duration } = event.target;
            if (currentTime > 0) {
              setIsHasPlayed(true);
            }
            if (
              !isVideoFading &&
              fadeMainFromEndSeconds &&
              currentTime >= duration - fadeMainFromEndSeconds
            ) {
              setIsVideoFading(true);
            }
            if (!isStillFading && currentTime >= duration - FADE_SECONDS) {
              setIsStillFading(true);
              setTimeout(() => {
                onEnd?.();
              }, FADE_SECONDS * 1000);
            }
          }}
        />
      </Wrapper>
    );
  }
);
