// hooks/use-appearance.tsx

import { useAppearance as useAppearanceContext } from '@/contexts/appearance-context';
import type { Appearance } from '@/contexts/appearance-context';

export type { Appearance };

const prefersDark = () => {
    if (typeof window === 'undefined') {
        return false;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const mediaQuery = () => {
    if (typeof window === 'undefined') {
        return null;
    }
    return window.matchMedia('(prefers-color-scheme: dark)');
};

const handleSystemThemeChange = () => {
    const currentAppearance = localStorage.getItem('appearance') as Appearance;
    if (currentAppearance === 'system') {
        const isDark = prefersDark();
        document.documentElement.classList.toggle('dark', isDark);
    }
};

export function initializeTheme() {
    const savedAppearance = (localStorage.getItem('appearance') as Appearance) || 'system';
    const isDark = savedAppearance === 'dark' || (savedAppearance === 'system' && prefersDark());
    document.documentElement.classList.toggle('dark', isDark);

    // Add the event listener for system theme changes
    mediaQuery()?.addEventListener('change', handleSystemThemeChange);
}

export function useAppearance() {
    const context = useAppearanceContext();
    return context;
}
