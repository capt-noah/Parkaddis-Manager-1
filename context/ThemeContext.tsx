import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance, ColorSchemeName, useColorScheme as useNativeColorScheme } from 'react-native';
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
  const systemColorScheme = useNativeColorScheme();

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    setColorScheme(newTheme);
  };

  useEffect(() => {
    // Initial sync
    setColorScheme(theme);
  }, []);

  // Determine actual active theme for JS-level conditional styling
  const isDark = theme === 'system' ? systemColorScheme === 'dark' : theme === 'dark';

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
