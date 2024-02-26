import { contain, cover } from 'intrinsic-scale';
import { useEffect, useState } from 'react';

import { useWindowSize } from '../hooks';

export const useImageScale = ({
  width: originalWidth,
  height: originalHeight,
  isCover = true,
  isCenter = false,
  padding = 0,
}) => {
  const { width, height } = useWindowSize();
  const [scale, setScale] = useState(null);
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);

  useEffect(() => {
    const usePadding = padding < 1 ? padding * width : padding;
    const method = isCover ? cover : contain;
    const result = method(
      width - usePadding * 2,
      height - usePadding * 2,
      originalWidth,
      originalHeight
    );
    setLeft(result.x + usePadding);
    setTop(usePadding + (isCover && !isCenter ? 0 : result.y));
    setScale(result.width / originalWidth);
  }, [
    width,
    height,
    isCover,
    isCenter,
    originalHeight,
    originalWidth,
    padding,
  ]);

  return {
    left,
    top,
    scale,
  };
};
