import styled, { keyframes } from 'styled-components';
import { useEffect, useState } from 'react';

const fade = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 200;
  background: black;
  animation: ${(props) => props.$duration}ms ${fade} ease-in forwards;
  animation-direction: ${(props) => (props.$isReverse ? 'reverse' : 'normal')};
`;

export const FadeOut = ({
  duration = 1500,
  callbackDelay = 500,
  isReverse = false,
  onComplete = () => null,
}) => {
  const [timeId, setTimeId] = useState(null);
  useEffect(() => {
    if (timeId) {
      return;
    }
    const timer = setTimeout(() => {
      onComplete();
    }, duration + callbackDelay);
    setTimeId(timer);
  }, [duration, callbackDelay]);
  return <Container $duration={duration} $isReverse={isReverse} />;
};

export const FadeIn = (props) => {
  return <FadeOut {...props} isReverse={true} />;
};
