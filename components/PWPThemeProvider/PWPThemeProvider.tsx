import { createContext, useContext } from 'react';

type PWPContextType = {
  theme: string;
}

type Props = {
  children: React.ReactNode;
  theme: string;
}

const PWPContextDefaultValues: PWPContextType = {
  theme: 'light',
};

export const PWPContext = createContext<PWPContextType>(PWPContextDefaultValues);

export function PWPThemeProvider({ children, theme }: Props) {
  return (
    <PWPContext.Provider value={{theme}}>
      {children}
    </PWPContext.Provider>
  );
}

export function usePWPContext() {
  return useContext(PWPContext);
}