import { Stack } from 'expo-router';
import { ThemeProviderCustom } from '../context/ThemeContext';
import { ThemeProvider } from '../theme/ThemeProvider';

import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    RubikOne: require('../assets/fonts/RubikOne-Regular.ttf'),
    Inter: require('../assets/fonts/Inter-Regular.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <ThemeProviderCustom>
      <ThemeProvider>
      <Stack
         
        />
      </ThemeProvider>
    </ThemeProviderCustom>
  );
}
