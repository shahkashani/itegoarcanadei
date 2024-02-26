import styled, { css, keyframes } from 'styled-components';
import { useEffect, useState } from 'react';

const fade = keyframes`
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
`;

const Container = styled.div`
  ${({ $duration, $isFade }) =>
    $isFade &&
    css`
      animation: ${$duration}ms ${fade} ease-in-out forwards;
    `};
`;

export const FadeContainer = ({
  delay,
  duration = 1000,
  children,
  completeDelay = 500,
  isClearOnComplete = true,
  onComplete = () => null,
}) => {
  const [isStarted, setIsStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [startTimerId, setStartTimerId] = useState(null);
  const [completeTimerId, setCompleteTimerId] = useState(null);

  useEffect(() => {
    if (startTimerId) {
      clearTimeout(startTimerId);
    }
    const id = setTimeout(() => {
      setStartTimerId(null);
      setIsStarted(true);
    }, delay);
    setStartTimerId(id);
  }, [delay]);

  useEffect(() => {
    if (!isStarted) {
      return;
    }
    if (completeTimerId) {
      clearTimeout(completeTimerId);
    }
    const id = setTimeout(() => {
      setCompleteTimerId(null);
      setIsComplete(true);
    }, duration + completeDelay);
    setCompleteTimerId(id);
  }, [isStarted, duration, completeDelay]);

  useEffect(() => {
    if (!isComplete) {
      return;
    }
    onComplete();
  }, [isComplete, onComplete]);

  if (isComplete && isClearOnComplete) {
    return null;
  }

  return (
    <Container $isFade={isStarted} $duration={duration}>
      {children}
    </Container>
  );
};
