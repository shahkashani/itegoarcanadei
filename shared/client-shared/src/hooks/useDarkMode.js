import { useMediaQuery } from 'usehooks-ts';

const COLOR_SCHEME_QUERY = '(prefers-color-scheme: dark)';

export function useDarkMode() {
  const isDarkMode = useMediaQuery(COLOR_SCHEME_QUERY);

  return {
    isDarkMode,
  };
}
