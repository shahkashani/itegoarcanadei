import { forwardRef, useState } from 'react';
import styled, { css } from 'styled-components';

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
  transition: opacity 6000ms;
  background: none;
  filter: brightness(0.1);
  
  ${({ $isFade }) =>
    $isFade &&
    css`
      opacity: 0;
    `};
`;

export const BackgroundVideo = forwardRef((props, ref) => {
  const [hasPlayed, setIsHasPlayed] = useState(false);
  return (
    <Video
      $isFade={!hasPlayed}
      ref={ref}
      {...props}
      onTimeUpdate={(event) => {
        const { currentTime } = event.target;
        if (currentTime > 0) {
          setIsHasPlayed(true);
        }
      }}
    />
  );
});
