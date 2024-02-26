import { useEffect, useState } from 'react';

import { Valdrada } from '../Valdrada';
import { ShadowValdrada } from '../ShadowValdrada';

export const Cities = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isShadow, setIsShadow] = useState(false);

  useEffect(() => {
    (async () => {
      const response = await fetch('/crossroads');
      if (!response.ok) {
        setIsLoading(false);
        return;
      }
      const { shadowland } = await response.json();
      setIsShadow(shadowland);
      setIsLoading(false);
    })();
  }, []);

  if (isLoading) {
    return null;
  }

  return isShadow ? <ShadowValdrada /> : <Valdrada />;
};
