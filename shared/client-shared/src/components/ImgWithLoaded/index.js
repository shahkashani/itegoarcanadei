import { useEffect, useState } from 'react';

export const ImgWithLoaded = ({ onLoaded, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      onLoaded?.();
    }
  }, [isLoaded]);

  return <img onLoad={() => setIsLoaded(true)} {...props} />;
};
