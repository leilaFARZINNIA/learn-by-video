import { AuthProvider } from '@/auth/auth-context';
import { ToastProvider } from "@/components/ui/Toast";
import { useFonts } from 'expo-font';
import * as Linking from 'expo-linking';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect } from 'react';
import { ThemeProviderCustom } from '../context/ThemeContext';
import { ThemeProvider } from '../theme/ThemeProvider';
import DrawerContainer from './side-menu';

SplashScreen.preventAutoHideAsync();
WebBrowser.maybeCompleteAuthSession();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    RubikOne: require('../assets/fonts/RubikOne-Regular.ttf'),
    Inter: require('../assets/fonts/Inter-Regular.ttf'),
    PatrickHand: require('../assets/fonts/PatrickHand-Regular.ttf'),
    Caprasimo: require('../assets/fonts/Caprasimo-Regular.ttf')
  });
  

     useEffect(() => {
        const sub = Linking.addEventListener('url', e => {
          console.log('[auth] URL EVENT =', e.url);
         });
         return () => sub.remove();
      }, []);

  if (!fontsLoaded) return null;

  return (
    
    <AuthProvider>
    <ThemeProviderCustom>
      <ThemeProvider>
      <ToastProvider>
        <DrawerContainer>
       
      
        <Stack screenOptions={{ headerShown: false }} />
        </DrawerContainer>
        </ToastProvider>
      </ThemeProvider>
    </ThemeProviderCustom>
    </AuthProvider>
  );
}
