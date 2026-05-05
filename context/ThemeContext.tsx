import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import { useColorScheme } from 'nativewind';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const { colorScheme, setColorScheme } = useColorScheme();

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (newTheme === 'system') {
      const systemTheme = Appearance.getColorScheme();
      setColorScheme(systemTheme || 'light');
    } else {
      setColorScheme(newTheme);
    }
  };

  useEffect(() => {
    // Initial sync
    if (theme === 'system') {
      const systemTheme = Appearance.getColorScheme();
      setColorScheme(systemTheme || 'light');
    } else {
      setColorScheme(theme);
    }

    const subscription = Appearance.addChangeListener(({ colorScheme: newColorScheme }) => {
      if (theme === 'system') {
        setColorScheme(newColorScheme || 'light');
      }
    });

    return () => subscription.remove();
  }, [theme]);

  const isDark = colorScheme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
