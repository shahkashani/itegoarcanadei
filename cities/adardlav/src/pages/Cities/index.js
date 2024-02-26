import { useEffect, useState } from 'react';

import { Adardlav } from '../Adardlav';
import { ShadowAdardlav } from '../ShadowAdardlav';

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

  return isShadow ? <ShadowAdardlav /> : <Adardlav />;
};
