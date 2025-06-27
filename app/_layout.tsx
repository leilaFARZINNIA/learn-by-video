import { Stack } from 'expo-router';
import { AppProvider } from '../context/AppContext';
import { ThemeProvider } from '../theme/ThemeProvider';

export default function RootLayout() {
  return (
    <AppProvider>
      <ThemeProvider>
        <Stack />
      </ThemeProvider>
    </AppProvider>
  );
}
