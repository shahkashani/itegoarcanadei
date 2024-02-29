import { useEffect, useState } from 'react';

export const useSelection = () => {
  const [selection, setSelection] = useState('');

  useEffect(() => {
    const handleSelection = () => {
      setSelection(window.getSelection().toString());
    };
    window.addEventListener('mouseup', handleSelection);
    handleSelection();
    return () => {
      window.removeEventListener('mouseup', handleSelection);
    };
  }, []);

  return selection;
};
