import { createContext, useContext } from 'react';
import { IUser } from '../../interfaces/database'
import { FrontEndController } from '../../controller/frontEndController'

type PWPAuthContextType = {
  user: IUser | null;
}

type Props = {
  children: React.ReactNode;
  user: IUser | null;
}

const PWPAuthContextDefaultValues: PWPAuthContextType = {
  user: undefined // await FrontEndController.getUserFromToken(FrontEndController.getUserToken()),
};

export const PWPAuthContext = createContext<PWPAuthContextType>(PWPAuthContextDefaultValues);

export function PWPAuthProvider({ children, user }: Props) {
  return (
    <PWPAuthContext.Provider value={{ user }}>
      {children}
    </PWPAuthContext.Provider>
  );
}

export function usePWPAuthContext() {
  return useContext(PWPAuthContext);
}