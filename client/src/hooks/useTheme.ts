import { useState, useEffect, useCallback } from 'react';

export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    try {
      return localStorage.getItem('te-theme') === 'dark';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    document.body.classList.toggle('dark', isDark);
    try {
      localStorage.setItem('te-theme', isDark ? 'dark' : 'light');
    } catch { /* noop */ }
  }, [isDark]);

  const toggle = useCallback(() => setIsDark(prev => !prev), []);

  return { isDark, toggle };
}
