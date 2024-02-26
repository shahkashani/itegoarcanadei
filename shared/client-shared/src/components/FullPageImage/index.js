import React, { useEffect, useState } from 'react';

import styled from 'styled-components';

const Img = styled.img`
  object-fit: ${({ $fit }) => $fit};
  object-position: ${({ $align }) => $align} center;
  width: 100%;
  height: 100%;
  opacity: ${({ $dimTo }) => $dimTo};
  transition: opacity ${({ $fadeSpeed: $fadeSpeed }) => $fadeSpeed}ms
    ${({ $easing: $easing }) => $easing};
`;

const Figure = styled.figure`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  height: -webkit-fill-available;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  user-select: none;
  opacity: ${({ $dimTo }) => $dimTo};
  transition: opacity ${({ $fadeSpeed }) => $fadeSpeed}ms
    ${({ $easing }) => $easing};
  z-index: ${({ $zIndex }) => $zIndex};
`;

export const FullPageImage = ({
  src,
  align = 'center',
  fit = 'cover',
  fadeSpeed = 2000,
  easing = 'ease-out',
  isFadeEnabled = true,
  zIndex = -1,
  opacity = 1,
  onDone,
  ...rest
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageOpacity, setImageOpacity] = useState(isFadeEnabled ? 0 : 1);
  const [timerId, setTimerId] = useState(null);

  useEffect(() => {
    if (!isLoaded) {
      if (isFadeEnabled) {
        setImageOpacity(0);
      }
      return;
    }

    if (!isFadeEnabled) {
      onDone?.();
      return;
    }

    clearTimeout(timerId);

    const id = setTimeout(() => {
      setImageOpacity(1);
      onDone?.();
    }, 50);

    setTimerId(id);

    return () => clearTimeout(id);
  }, [isLoaded, isFadeEnabled]);

  return (
    <Figure
      $fadeSpeed={fadeSpeed}
      $easing={easing}
      $dimTo={opacity}
      $zIndex={zIndex}
      {...rest}
    >
      <Img
        $isFadeEnabled={isFadeEnabled}
        $fadeSpeed={fadeSpeed}
        $easing={easing}
        $align={align}
        $fit={fit}
        $dimTo={imageOpacity}
        src={src}
        onLoad={() => setIsLoaded(true)}
      />
    </Figure>
  );
};
