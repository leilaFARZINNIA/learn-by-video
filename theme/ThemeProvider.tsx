import React, { ReactNode } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components/native';
import { useTheme } from '../context/ThemeContext';
import { darkColors, lightColors } from './colors';

interface Props {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: Props) => {
  const { isDarkMode } = useTheme();

  const theme = isDarkMode ? darkColors : lightColors;

  return <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>;
};
