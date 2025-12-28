import { writable } from 'svelte/store';

type Theme = 'light' | 'dark';

const THEME_COLORS = {
  light: '#ffffff',
  dark: '#1d1d1d'
} as const;

function updateHtmlClass(theme: Theme) {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.style.backgroundColor = THEME_COLORS[theme];
    
    const themeColorMeta = document.getElementById('theme-color') as HTMLMetaElement | null;
    if (themeColorMeta) {
      themeColorMeta.content = THEME_COLORS[theme];
    }
  }
}

function createThemeStore() {
  const storedTheme = typeof localStorage !== 'undefined' 
    ? localStorage.getItem('theme') as Theme | null 
    : null;
  
  const mediaQuery = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-color-scheme: dark)') 
    : null;
  
  const prefersDark = mediaQuery?.matches ?? false;
  
  const initialTheme: Theme = storedTheme || (prefersDark ? 'dark' : 'light');
  
  updateHtmlClass(initialTheme);
  
  const { subscribe, set: originalSet, update: originalUpdate } = writable<Theme>(initialTheme);
  
  const set = (theme: Theme) => {
    updateHtmlClass(theme);
    originalSet(theme);
  };
  
  const update = (fn: (current: Theme) => Theme) => {
    originalUpdate(current => {
      const newTheme = fn(current);
      updateHtmlClass(newTheme);
      return newTheme;
    });
  };
  
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
