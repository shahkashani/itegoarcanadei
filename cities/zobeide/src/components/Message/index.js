import { range, shuffle } from 'lodash';
import styled, { css, keyframes } from 'styled-components';
import { useEffect, useMemo, useState } from 'react';

const LETTER_FADE = 1500;
const LETTER_DELAY = 150;

const fade = keyframes`
  0% {
    transform: scale(3);
    filter: blur(5px);
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const Letter = styled.span`
  animation: ${fade} ${LETTER_FADE}ms ease-in-out both;
  display: inline-block;
  color: #d63c26;
  margin: 0 1px;
  font-family: Sinapius;
  font-size: 2rem;

  ${({ $delay }) =>
    css`
      animation-delay: ${$delay}ms;
    `}

  ${({ $isLast }) =>
    $isLast &&
    css`
      font-family: Guides;
    `}
`;

const Wrapper = styled.div`
  padding: 20px 0;
`;

const getDelays = (length) =>
  shuffle(range(0, length).map((i) => i * LETTER_DELAY));

export const Message = ({ onDone, useGuide = true, children }) => {
  const [timerId, setTimerId] = useState(null);
  const [isDone, setIsDone] = useState(false);
  const delays = useMemo(
    () => (children && children.length > 0 ? getDelays(children.length) : []),
    [children]
  );
  const totalDelay = useMemo(() => Math.max(...delays), [delays]);
  useEffect(() => {
    if (isDone) {
      onDone?.();
    }
  }, [isDone, onDone]);
  useEffect(() => {
    if (timerId) {
      return;
    }
    if (totalDelay <= 0) {
      return;
    }
    setTimerId(
      setTimeout(() => {
        setIsDone(true);
      }, totalDelay + LETTER_FADE)
    );
    return () => clearTimeout(timerId);
  }, [totalDelay, onDone]);

  if (!children || children.length === 0) {
    return null;
  }
  const text = children.trim();
  return (
    <Wrapper>
      {text.split('').map((letter, index) =>
        letter === ' ' ? (
          <Letter key={index}>&nbsp;</Letter>
        ) : (
          <Letter
            $delay={delays[index]}
            $isLast={useGuide && index === text.length - 1}
            key={index}
          >
            {letter}
          </Letter>
        )
      )}
    </Wrapper>
  );
};
