// Theme management utility
export const THEME = {
    LIGHT: 'light',
    DARK: 'dark',
};
export const getSystemTheme = () => {
    if (typeof window === 'undefined')
        return THEME.LIGHT;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? THEME.DARK : THEME.LIGHT;
};
export const getStoredTheme = () => {
    const stored = localStorage.getItem('theme');
    return stored === THEME.DARK || stored === THEME.LIGHT ? stored : null;
};
export const setTheme = (theme) => {
    localStorage.setItem('theme', theme);
    const html = document.documentElement;
    if (theme === THEME.DARK) {
        html.classList.add('dark');
    }
    else {
        html.classList.remove('dark');
    }
};
export const getTheme = () => {
    return getStoredTheme() || getSystemTheme();
};
export const toggleTheme = () => {
    const currentTheme = getTheme();
    const newTheme = currentTheme === THEME.DARK ? THEME.LIGHT : THEME.DARK;
    setTheme(newTheme);
    return newTheme;
};
export const initializeTheme = () => {
    const theme = getTheme();
    setTheme(theme);
};
