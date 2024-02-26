import { useEffect, useState } from 'react';

const loadImage = (url) => {
  return new Promise((resolve) => {
    const image = new Image();
    const onLoad = () => {
      image.remove();
      resolve();
    };
    const onError = () => {
      image.remove();
      resolve();
    };
    image.addEventListener('load', onLoad);
    image.addEventListener('error', onError);
    image.src = url;
  });
};

export function useImageLoaded(images) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    Promise.all(images.map((image) => loadImage(image))).then(() => {
      setIsImageLoaded(true);
    });
  }, [images.join('')]);

  return [isImageLoaded];
}
