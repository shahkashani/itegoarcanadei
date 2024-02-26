import { forwardRef, useEffect, useState } from 'react';

import styled from 'styled-components';

const FADE_SPEED = 5000;

const VideoTag = styled.video`
  transition: opacity ${FADE_SPEED}ms;
  opacity: ${({ $fadeTo, $isFaded }) => ($isFaded ? 0 : $fadeTo)};
`;

export const Video = forwardRef(({ opacity = 0.2, onDone, ...props }, ref) => {
  const [isFadeIn, setIsFadeIn] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (isDone) {
      onDone?.();
    }
  }, [isDone]);

  useEffect(() => {
    if (isFadingOut) {
      const timerId = setTimeout(() => {
        setIsDone(true);
      }, FADE_SPEED);
      return () => clearTimeout(timerId);
    }
  }, [isFadingOut]);

  return (
    <VideoTag
      $isFaded={!isFadeIn || isFadingOut}
      $fadeTo={opacity}
      ref={ref}
      {...props}
      onTimeUpdate={(event) => {
        const { currentTime, duration } = event.target;
        if (currentTime > 0) {
          setIsFadeIn(true);
        }
        if (!isFadingOut && currentTime >= duration - FADE_SPEED / 1000) {
          setIsFadingOut(true);
        }
      }}
    />
  );
});
