'use client';
import { darkTheme, lightTheme } from '@/components/layouts/theme';
import { Theme, ThemeProvider } from '@mui/material';
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext({
  currentTheme: darkTheme,
  themeSwitchHandler: (themeName: 'dark' | 'light') => {},
});

function useThemeContext() {
  const store = useContext(ThemeContext);
  if (!store) {
    throw new Error('useStore must be used within a StoreProvider.');
  }
  return store;
}

export default function ThemeContextProvider(props: any) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(darkTheme);

  const themeSwitchHandler = (themeName: 'dark' | 'light') => {
    setCurrentTheme(themeName === 'dark' ? darkTheme : lightTheme);
    // Set theme property to body html for access in css
    document.body.dataset.theme = themeName;
  };

  return (
    <ThemeContext.Provider
      value={{
        currentTheme: currentTheme,
        themeSwitchHandler: themeSwitchHandler,
      }}
    >
      <ThemeProvider theme={currentTheme}>{props.children}</ThemeProvider>
    </ThemeContext.Provider>
  );
}

const { Provider } = ThemeContext;

export { Provider, useThemeContext };
