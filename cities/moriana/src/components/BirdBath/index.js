import { useEffect, useState } from 'react';

import { ImgWithLoaded } from '@itegoarcanadei/client-shared';
import styled from 'styled-components';

export const BIRD_BATH_WIDTH = 2460;
export const BIRD_BATH_HEIGHT = 3200;

const Container = styled.div`
  aspect-ratio: ${BIRD_BATH_WIDTH} / ${BIRD_BATH_HEIGHT};
  position: relative;
  overflow: hidden;
`;

const Img = styled(ImgWithLoaded)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

export const BirdBath = ({ isAnimated, onLoaded }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }
    onLoaded?.();
  }, [isLoaded]);

  return (
    <Container>
      <Img src="/moriana.jpg" onLoaded={() => setIsLoaded(true)} />
      {isAnimated && (
        <Img src="/alabaster-gates.gif" onLoaded={() => setIsLoaded(true)} />
      )}
    </Container>
  );
};
