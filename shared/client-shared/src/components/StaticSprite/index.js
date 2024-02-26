import styled, { css } from 'styled-components';

import { forwardRef } from 'react';

const Wrapper = styled.div`
  position: fixed;
  z-index: 3;
  user-select: none;
`;

const Sprite = styled.div`
  ${({ $renderSprite }) => css`
    background: url(${$renderSprite.sprite});
    height: ${$renderSprite.height}px;
    width: ${$renderSprite.width}px;
  `};
  background-size: auto 100%;
  background-position: center center;
  background-repeat: no-repeat;
  opacity: ${({ $useOpacity }) => $useOpacity};
  transition: opacity 4000ms ease-out;
  position: relative;

  ${({ $isFlipped }) =>
    !$isFlipped &&
    css`
      transform: scaleX(-1);
    `};
`;

const MirrorSprite = styled.div`
  transform: scaleY(-1);
`;

export const StaticSprite = forwardRef(
  (
    {
      x,
      y,
      isFlipped,
      sprite,
      selfOpacity = 1,
      shadowOpacity = 0.3,
      scale = 1,
      children,
      className,
      ...rest
    },
    ref
  ) => {
    return (
      <Wrapper
        ref={ref}
        {...rest}
        className={className}
        style={{
          transform: `translateX(${x}px) translateY(${y}px) scale(${scale})`,
        }}
      >
        {children}
        <Sprite
          $isFlipped={isFlipped}
          $renderSprite={sprite}
          $useOpacity={selfOpacity}
        />
        <MirrorSprite>
          <Sprite
            $isFlipped={isFlipped}
            $renderSprite={sprite}
            $useOpacity={shadowOpacity}
          />
        </MirrorSprite>
      </Wrapper>
    );
  }
);
