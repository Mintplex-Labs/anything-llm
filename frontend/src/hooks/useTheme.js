import { useState, useEffect } from 'react';

const availableThemes = {
  default: 'Default',
  light: 'Light',
};

export function useTheme() {
  const [theme, setTheme] = useState('default');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return { theme, setTheme, availableThemes };
}