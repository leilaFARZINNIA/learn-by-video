import React, { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';

type AppContextType = {
  text: string;
  setText: (text: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
};

const AppContext = createContext<AppContextType>({} as AppContextType);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {

  const systemScheme = useColorScheme();

  const [theme, setTheme] = useState<'light' | 'dark'>(systemScheme ?? 'light');
  
  const [text, setText] = useState('');

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  return (
    <AppContext.Provider value={{ text, setText, theme, toggleTheme }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
