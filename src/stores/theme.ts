import { writable } from 'svelte/store';

type Theme = 'light' | 'dark';

function createThemeStore() {
  const storedTheme = typeof localStorage !== 'undefined' 
    ? localStorage.getItem('theme') as Theme | null 
    : null;
  
  const prefersDark = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-color-scheme: dark)').matches 
    : false;
  
  const initialTheme: Theme = storedTheme || (prefersDark ? 'dark' : 'light');
  
  const { subscribe, set, update } = writable<Theme>(initialTheme);
  
  return {
    subscribe,
    toggle: () => {
      update(current => {
        const newTheme = current === 'light' ? 'dark' : 'light';
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('theme', newTheme);
        }
        return newTheme;
      });
    },
    set: (theme: Theme) => {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('theme', theme);
      }
      set(theme);
    }
  };
}

export const theme = createThemeStore();
