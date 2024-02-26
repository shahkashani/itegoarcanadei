import { forwardRef, useState } from 'react';
import styled, { css } from 'styled-components';

export const Image = styled.img`
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
  transition: opacity 3000ms;

  ${({ $isLoaded }) =>
    !$isLoaded &&
    css`
      opacity: 0;
    `};

  ${({ $isFade }) =>
    $isFade &&
    css`
      transition-duration: 6000ms;
      opacity: 0;
    `};
`;

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

  ${({ $isFade }) =>
    $isFade &&
    css`
      opacity: 0;
    `};
`;

export const FullPageVideo = forwardRef(({ onTime, still, ...props }, ref) => {
  const [hasPlayed, setIsHasPlayed] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  return (
    <>
      {still && (
        <Image
          $isFade={hasPlayed}
          $isLoaded={isImageLoaded}
          src={still}
          onLoad={() => setIsImageLoaded(true)}
        />
      )}
      <Video
        $isFade={!hasPlayed}
        ref={ref}
        {...props}
        onTimeUpdate={(event) => {
          const { currentTime } = event.target;
          if (currentTime > 0) {
            setIsHasPlayed(true);
          }
          onTime?.(currentTime);
        }}
      />
    </>
  );
});
