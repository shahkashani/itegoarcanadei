import React from 'react';
import { useSprite } from '../../hooks/useSprite';

export const AnimatedSprite = ({
  startFrame = 0,
  sprite,
  width,
  height,
  direction = 'horizontal',
  onError = () => null,
  onLoad = () => null,
  onEnd = () => null,
  frameCount,
  fps,
  shouldAnimate,
  stopLastFrame = false,
  reset,
  frame,
  className,
  scale = 1,
  wrapAfter,
  stopAtFrame,
  style,
}) => {
  const spriteStyle = useSprite({
    startFrame,
    sprite,
    width,
    height,
    direction,
    onError,
    onLoad,
    onEnd,
    frameCount,
    fps,
    shouldAnimate,
    stopLastFrame,
    reset,
    frame,
    scale,
    wrapAfter,
    stopAtFrame,
  });
  return <div className={className} style={{ ...spriteStyle, ...style }} />;
};
