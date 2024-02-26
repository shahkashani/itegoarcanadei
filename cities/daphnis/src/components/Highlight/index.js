import { useEffect, useState } from 'react';

import styled from 'styled-components';

const TOKEN = '|';

const Wrapper = styled.span`
  transition: opacity ${({ $delay }) => $delay}ms;
  padding: 20px;
  margin: -20px;
  ${({ $isDimmed, $dimOpacity }) => $isDimmed && `opacity: ${$dimOpacity}`}
`;

const Container = styled.p`
  line-height: 2rem;
  margin: 10px 0;
`;

const getFormatting = (text) => {
  if (!text || text.length === 0 || text.indexOf(TOKEN) === -1) {
    return {
      text,
      indexes: [],
    };
  }
  const textArray = text.split('');
  const indexes = [];
  let finalIndex = 0;
  let finalText = '';
  let isInsideToken = false;
  textArray.forEach((letter, index) => {
    if (letter === TOKEN) {
      isInsideToken = !isInsideToken;
    } else {
      if (isInsideToken) {
        indexes[finalIndex] = true;
      }
      finalIndex += 1;
      finalText += letter;
    }
  });
  return {
    text: finalText,
    indexes,
  };
};

export const Highlight = ({
  children,
  isHighlight = false,
  dimOpacity = 0.17,
}) => {
  const [useChildren, setUseChildren] = useState([]);
  const [isLit, setIsLit] = useState(false);

  useEffect(() => {
    if (!isHighlight) {
      return;
    }
    setTimeout(() => setIsLit(true), 2000);
  }, [isHighlight]);

  useEffect(() => {
    const { text, indexes } = getFormatting(children);
    const delay = isLit ? 2000 : 1000;
    if (indexes.length === 0) {
      const useChildren = (
        <Wrapper
          $delay={delay}
          $isDimmed={isHighlight}
          $dimOpacity={dimOpacity}
        >
          {text}
        </Wrapper>
      );
      setUseChildren(useChildren);
      return;
    }
    const useChildren = text.split('').map((letter, i) => {
      return (
        <Wrapper
          key={i}
          $delay={delay}
          $isDimmed={isHighlight ? !isLit || !indexes[i] : false}
          $dimOpacity={dimOpacity}
        >
          {letter}
        </Wrapper>
      );
    });
    setUseChildren(useChildren);
  }, [isHighlight, isLit]);

  return <Container>{useChildren}</Container>;
};
