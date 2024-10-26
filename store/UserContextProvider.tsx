'use client';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { createContext, useContext, useMemo, useState } from 'react';

interface UserContextInterface {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextInterface>({
  user: null,
  setUser: (user: User | null) => {},
  isLoading: false,
});

function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export default function UserContextProvider(props: {
  children: React.ReactNode;
  user: User | null;
}) {
  const [user, setUser] = useState<User | null>(props.user);
  const [isLoading, setIsLoading] = useState(false);

  useMemo(() => {
    const getUser = async () => {
      const client = createClient();

      client.auth.onAuthStateChange((event, _) => {
        if (event === 'SIGNED_OUT') {
          setIsLoading(false);
          setUser(null);
          window.location.reload();
        }
      });

      setIsLoading(true);

      const { error, data } = await client.auth.getUser();

      if (!error && data?.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }

      setIsLoading(false);
    };

    getUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, isLoading }}>
      {props.children}
    </UserContext.Provider>
  );
}

const { Provider } = UserContext;

export { Provider, useUser };
