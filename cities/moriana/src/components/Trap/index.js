import { useEffect, useState } from 'react';

import { ImgWithLoaded } from '@itegoarcanadei/client-shared';
import styled from 'styled-components';

export const BIRD_BATH_WIDTH = 2091;
export const BIRD_BATH_HEIGHT = 1308;

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

export const Trap = ({ isAnimated, onLoaded }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }
    onLoaded?.();
  }, [isLoaded]);

  return (
    <Container>
      <Img src="/hidden-moriana.jpg" onLoaded={() => setIsLoaded(true)} />
      {isAnimated && <Img src="/the-obverse.gif" onLoaded={() => setIsLoaded(true)} />}
    </Container>
  );
};
