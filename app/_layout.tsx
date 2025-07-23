import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import DrawerContainer from '../app/sideMenu/DrawerContainer';
import { ThemeProviderCustom } from '../context/ThemeContext';
import { ThemeProvider } from '../theme/ThemeProvider';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    RubikOne: require('../assets/fonts/RubikOne-Regular.ttf'),
    Inter: require('../assets/fonts/Inter-Regular.ttf'),
    PatrickHand: require('../assets/fonts/PatrickHand-Regular.ttf'),
    Caprasimo: require('../assets/fonts/Caprasimo-Regular.ttf')
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
        <DrawerContainer>
       
      
        <Stack screenOptions={{ headerShown: false }} />
        </DrawerContainer>
      </ThemeProvider>
    </ThemeProviderCustom>
  );
}
