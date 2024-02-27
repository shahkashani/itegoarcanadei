import styled, { css, keyframes } from 'styled-components';
import { useEffect, useState } from 'react';

import { MultiNarrative } from '@itegoarcanadei/client-shared';

const FADE_TIME = 5000;

const fade = keyframes`
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
`;

const Wrapper = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  height: -webkit-fill-available;
  margin: 0;
  padding: 0;
  z-index: 0;
  background: rgba(0, 0, 0, 0.95);
  user-select: none;
  animation: ${fade} 2000ms ease-in-out;
  transition: opacity ${FADE_TIME}ms ease-in-out;
  z-index: 5;

  ${({ $isFading }) =>
    $isFading &&
    css`
      opacity: 0;
    `}
`;

const Text = styled.div`
  padding: 50px;
  animation: ${fade} 4000ms 1000ms ease-in-out both;
  transition: color 2000ms ease-in-out;
  color: #635a58;

  p {
    margin: 8px 0;
  }

  ${({ $isFading }) =>
    $isFading &&
    css`
      color: transparent;
    `}
`;

const P = styled.div`
  margin-top: 30px;
`;

const Lake = styled.p`
  color: #544e59;
`;

export const Letter = ({ onDone }) => {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (isFading) {
      const id = setTimeout(() => {
        onDone?.();
      }, FADE_TIME);
      return () => clearTimeout(id);
    }
  }, [isFading]);

  return (
    <Wrapper $isFading={isFading} onClick={() => setIsFading(true)}>
      <Text $isFading={isFading}>
        <MultiNarrative iconColor="#c4bba9">
          <div>
            <div>
              <p>I saw you in dreams, those many years ago.</p>
              <p>I have never forgotten you.</p>
              <p>I instantly knew you.</p>
              <p>Like we had always been connected.</p>

              <P>Sometimes you were wandering.</P>
              <p>Sometimes you were painting.</p>
              <p>Sometimes you were flying.</p>
              <p>And I was right there beside you.</p>
              <p>Separated by a mere universe.</p>
              <p>My faraway friend, so close all the same.</p>

              <P>Then one day, you were running.</P>
              <p>Running, running, running.</p>
              <p>Running to a doorway.</p>
              <p>To a passage beyond your world.</p>
              <p>Into a labyrinth endlessly blue.</p>
              <Lake>The dreamer's lake.</Lake>
            </div>
          </div>
          <div>
            <div>
              <p>Where was this place?</p>
              <p>Where were you?</p>
            </div>
          </div>
          <div>
            <div>
              <p>That was the last time I saw you, my dear.</p>
              <p>The last place I saw you.</p>
              <p>I have dedicated myself to finding you.</p>
              <p>Without a clue where to begin.</p>

              <P>Yet, I will not rest.</P>
              <p>I will travel the land in search.</p>
              <p>I will find it.</p>
              <p>I will find you.</p>
            </div>
            <p>- G</p>
          </div>
        </MultiNarrative>
      </Text>
    </Wrapper>
  );
};
