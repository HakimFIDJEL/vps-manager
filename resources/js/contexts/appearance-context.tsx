// contexts/appearance-context.tsx

import { isCookieConsent } from '@/lib/utils';
import { createContext, useContext, useEffect, useState } from 'react';

export type Appearance = 'light'|'dark'|'system';
interface ContextValue { appearance: Appearance; setAppearance(mode: Appearance): void; }

const prefersDark = () => {
    if (typeof window === 'undefined') {
        return false;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const setCookie = (name: string, value: string, days = 365) => {
    if (typeof document === 'undefined') {
        return;
    }
    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};

const applyTheme = (appearance: Appearance) => {
    const isDark = appearance === 'dark' || (appearance === 'system' && prefersDark());
    document.documentElement.classList.toggle('dark', isDark);
};

const AppearanceContext = createContext<ContextValue | undefined>(undefined);

export const AppearanceProvider = ({ children }: { children: React.ReactNode }) => {
  const [appearance, setAppearanceState] = useState<Appearance>(
    (localStorage.getItem('appearance') as Appearance) || 'system'
  );

  useEffect(() => {
    applyTheme(appearance);
    localStorage.setItem('appearance', appearance);
    if(isCookieConsent()) {
      setCookie('appearance', appearance);
    }
  }, [appearance]);

  // Écoute système (mode "system")
  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => appearance === 'system' && applyTheme('system');
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [appearance]);

  const setAppearance = (mode: Appearance) => {
    setAppearanceState(mode);
  };

  return (
    <AppearanceContext.Provider value={{ appearance, setAppearance }}>
      {children}
    </AppearanceContext.Provider>
  );
};

// Hook renvoyant le contexte  
export const useAppearance = () => {
  const ctx = useContext(AppearanceContext);
  if (!ctx) throw new Error('useAppearance must be used within AppearanceProvider');
  return ctx;
};
