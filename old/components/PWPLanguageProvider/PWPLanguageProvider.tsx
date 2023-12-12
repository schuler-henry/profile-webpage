import { I18n, TFunction } from 'next-i18next';
import { createContext, useContext } from 'react';

export type PWPLanguageContextType = {
  i18n: I18n;
  t: TFunction;
}

type Props = {
  children: React.ReactNode;
  i18n: I18n;
  t: TFunction;
}

const PWPContextDefaultValues: PWPLanguageContextType = {
  i18n: null,
  t: null,
};

export const PWPLanguageContext = createContext<PWPLanguageContextType>(PWPContextDefaultValues);

export function PWPLanguageProvider({ children, i18n, t }: Props) {
  return (
    <PWPLanguageContext.Provider value={{i18n, t}}>
      {children}
    </PWPLanguageContext.Provider>
  );
}

export function usePWPLanguageContext() {
  return useContext(PWPLanguageContext);
}