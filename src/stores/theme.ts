import { writable } from 'svelte/store';

type Theme = 'light' | 'dark';

function createThemeStore() {
  const storedTheme = typeof localStorage !== 'undefined' 
    ? localStorage.getItem('theme') as Theme | null 
    : null;
  
  const mediaQuery = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-color-scheme: dark)') 
    : null;
  
  const prefersDark = mediaQuery?.matches ?? false;
  
  const initialTheme: Theme = storedTheme || (prefersDark ? 'dark' : 'light');
  
  const { subscribe, set, update } = writable<Theme>(initialTheme);
  
  let hasUserPreference = !!storedTheme;
  
  if (mediaQuery) {
    mediaQuery.addEventListener('change', (e) => {
      if (!hasUserPreference) {
        set(e.matches ? 'dark' : 'light');
      }
    });
  }
  
  return {
    subscribe,
    toggle: () => {
      update(current => {
        const newTheme = current === 'light' ? 'dark' : 'light';
        hasUserPreference = true;
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('theme', newTheme);
        }
        return newTheme;
      });
    },
    set: (theme: Theme) => {
      hasUserPreference = true;
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('theme', theme);
      }
      set(theme);
    },
    clearPreference: () => {
      hasUserPreference = false;
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('theme');
      }
      const currentSystemPref = mediaQuery?.matches ? 'dark' : 'light';
      set(currentSystemPref);
    }
  };
}

export const theme = createThemeStore();
