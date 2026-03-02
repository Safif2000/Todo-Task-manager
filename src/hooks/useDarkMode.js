// =====================================================
// hooks/useDarkMode.js — Dark mode management hook
// =====================================================

import { useEffect } from 'react';
import useLocalStorage from './useLocalStorage';

/**
 * Custom hook to manage dark/light mode.
 * Persists preference in localStorage and applies the
 * 'dark' class to the <html> element for Tailwind's darkMode: 'class'.
 *
 * @returns {[boolean, Function]} [isDark, toggleDark]
 */
const useDarkMode = () => {
  // Check system preference as the default
  const systemPrefersDark =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : false;

  const [isDark, setIsDark] = useLocalStorage('tasko-theme-dark', systemPrefersDark);

  // Apply/remove 'dark' class on the root element
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      // Only auto-switch if user hasn't set a preference
      const hasPreference = window.localStorage.getItem('tasko-theme-dark');
      if (hasPreference === null) {
        setIsDark(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [setIsDark]);

  const toggleDark = () => setIsDark(prev => !prev);

  return [isDark, toggleDark];
};

export default useDarkMode;
