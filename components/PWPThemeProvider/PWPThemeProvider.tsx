import { createContext, useContext } from 'react';

type PWPThemeContextType = {
  theme: string;
}

type Props = {
  children: React.ReactNode;
  theme: string;
}

const PWPContextDefaultValues: PWPThemeContextType = {
  theme: 'light',
};

export const PWPThemeContext = createContext<PWPThemeContextType>(PWPContextDefaultValues);

export function PWPThemeProvider({ children, theme }: Props) {
  return (
    <PWPThemeContext.Provider value={{theme}}>
      {children}
    </PWPThemeContext.Provider>
  );
}

export function usePWPThemeContext() {
  return useContext(PWPThemeContext);
}