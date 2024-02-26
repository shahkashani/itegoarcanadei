import styled, { css } from 'styled-components';
import { useEffect, useState } from 'react';

const Container = styled.div`
  ${({ $isFadeEnabled, $fadeDuration }) =>
    $isFadeEnabled &&
    css`
      transition: opacity ${$fadeDuration}ms;
    `};

  opacity: ${({ $opacity }) => $opacity};
`;

export const WithFade = ({
  fadeDuration = 1000,
  isFadeEnabled = true,
  isVisible = false,
  ...props
}) => {
  const [isHidden, setIsHidden] = useState(!isVisible);
  const [timerId, setTimerId] = useState(null);
  const [opacity, setOpacity] = useState(isHidden ? 0 : 1);

  useEffect(() => {
    clearTimeout(timerId);

    if (!isFadeEnabled) {
      setOpacity(isVisible ? 1 : 0);
      setIsHidden(!isVisible);
      return;
    }

    if (isVisible) {
      setOpacity(0.01);
      setIsHidden(false);
      const id = setTimeout(() => {
        setOpacity(1);
      }, 50);
      setTimerId(id);
    }

    if (!isVisible) {
      setOpacity(0);
      const id = setTimeout(() => {
        setIsHidden(true);
      }, fadeDuration);
      setTimerId(id);
    }
  }, [isVisible, isFadeEnabled]);

  if (isHidden) {
    return null;
  }

  return (
    <Container
      $opacity={opacity}
      $fadeDuration={fadeDuration}
      $isFadeEnabled={isFadeEnabled}
      {...props}
    />
  );
};
