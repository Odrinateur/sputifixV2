import { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import { ThemeType } from '@/types/common.ts';

type ThemeContextType = {
    theme: string;
    setTheme: (theme: ThemeType) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState<ThemeType>('dark');

    useEffect(() => {
        document.body.className = '';
        if (theme.includes(' ')) {
            const themes = theme.split(' ');
            themes.forEach((t) => document.body.classList.add(t));
        } else document.body.classList.add(theme);
    }, [theme]);

    return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
