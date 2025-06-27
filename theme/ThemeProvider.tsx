import { ThemeProvider as NavigationThemeProvider, Theme } from '@react-navigation/native';
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { darkColors, fonts, lightColors } from './colors';

const themeBuilder = (scheme: 'light' | 'dark'): Theme => ({
  dark: scheme === 'dark',
  colors: scheme === 'dark' ? darkColors : lightColors,
  fonts,
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useAppContext();
  const built = themeBuilder(theme);

  return (
    <NavigationThemeProvider value={built}>
      {children}
    </NavigationThemeProvider>
  );
};
