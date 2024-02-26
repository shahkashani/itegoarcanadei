import { useEffect, useState } from 'react';

import styled from 'styled-components';

const Img = styled.img`
  opacity: ${({ $dimTo }) => $dimTo};
  transition: opacity ${({ $fadeSpeed }) => $fadeSpeed}ms
    ${({ $easing }) => $easing};
`;

export const FadeImage = ({
  src,
  className,
  onComplete,
  onDone,
  onLoaded,
  easing = 'ease-out',
  fadeSpeed = 2000,
  startDelay = 0,
  dimTo = 1,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageOpacity, setImageOpacity] = useState(0);
  const [timerId, setTimerId] = useState(null);
  const [timerId2, setTimerId2] = useState(null);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    clearTimeout(timerId);
    const id = setTimeout(() => {
      setImageOpacity(isLoaded ? dimTo : 0);
      setIsDone(isLoaded);
    }, 50 + startDelay);
    setTimerId(id);
    return () => clearTimeout(id);
  }, [isLoaded, dimTo]);

  useEffect(() => {
    if (isLoaded) {
      onLoaded?.();
    }
  }, [isLoaded]);

  useEffect(() => {
    clearTimeout(timerId2);
    if (isDone) {
      const id = setTimeout(() => {
        onComplete?.();
        onDone?.();
      }, fadeSpeed);
      setTimerId2(id);
      return () => clearTimeout(id);
    }
  }, [isDone, fadeSpeed, onDone, onComplete]);

  return (
    <Img
      className={className}
      src={src}
      onLoad={() => setIsLoaded(true)}
      $dimTo={imageOpacity}
      $fadeSpeed={fadeSpeed}
      $easing={easing}
      {...props}
    />
  );
};
