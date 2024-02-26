import { forwardRef, useEffect, useMemo, useState } from 'react';

import { AnimatedSprite } from '../AnimatedSprite';
import styled from 'styled-components';
import { useInterval } from '../../hooks/useInterval';

const Sprite = styled.div`
  position: fixed;
  z-index: 2;
  transition: all 100ms linear;
`;

const MirrorSprite = styled.div`
  transform: scaleY(-1) translateY(-${({ $shadowOffset }) => $shadowOffset}px);
  opacity: ${({ $shadowOpacity }) => $shadowOpacity};
  transition: opacity 4000ms ease-out;
`;

export const MovableSprite = forwardRef(
  (
    {
      sprite,
      increment,
      screenWidth,
      className,
      startPX,
      px,
      getY,
      onPositionChange,
      onIsMoving,
      onFlip,
      isReflected,
      isFlipped,
      scale = 1,
      shadowOffset = 0,
      shadowOpacity = 0.3,
      selfOpacity = 1,
    },
    ref
  ) => {
    const [currentPX, setCurrentPX] = useState(startPX);
    const [currentY, setCurrentY] = useState(0);
    const [isMoving, setIsMoving] = useState(false);
    const realX = useMemo(
      () => currentPX * screenWidth,
      [currentPX, screenWidth]
    );

    useInterval(() => {
      setIsMoving(currentPX !== px);
      if (currentPX < px) {
        onFlip(false);
        setCurrentPX((cX) => Math.min(px, cX + increment));
      } else if (currentPX > px) {
        onFlip(true);
        setCurrentPX((cX) => Math.max(px, cX - increment));
      }
    }, 60);

    useEffect(() => {
      onPositionChange?.(currentPX);
    }, [currentPX]);

    useEffect(() => {
      onIsMoving?.(isMoving);
    }, [isMoving]);

    useEffect(() => {
      if (getY) {
        setCurrentY(getY(realX));
      }
    }, [realX]);

    const flipStyle = isFlipped ? { transform: 'scaleX(-1)' } : {};

    return (
      <Sprite
        className={className}
        ref={ref}
        style={{
          transform: `translateX(${realX}px) translateY(${currentY}px) scale(${scale})`,
        }}
      >
        <AnimatedSprite
          {...sprite}
          style={{
            ...flipStyle,
            opacity: selfOpacity,
            transition: 'opacity 4000ms ease-out',
          }}
          shouldAnimate={isMoving}
        />
        {isReflected && (
          <MirrorSprite
            $shadowOffset={shadowOffset}
            $shadowOpacity={shadowOpacity}
          >
            <AnimatedSprite
              {...sprite}
              style={flipStyle}
              shouldAnimate={isMoving}
            />
          </MirrorSprite>
        )}
      </Sprite>
    );
  }
);
