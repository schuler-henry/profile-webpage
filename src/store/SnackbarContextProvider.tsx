'use client';
import { AlertColor } from '@mui/material';
import { createContext, useCallback, useContext, useRef, useState, } from 'react';

export interface SnackbarMessage {
  message: string;
  severity?: AlertColor;
  autoHideDuration?: number;
}

interface SnackbarContextInterface {
  pushMessage: (message: SnackbarMessage) => void;
  shiftMessage: () => void;
  currentMessage: SnackbarMessage | null;
  messageCount: number;
}

const SnackbarContext = createContext<SnackbarContextInterface>({
  pushMessage: (message: SnackbarMessage) => {},
  shiftMessage: () => {},
  currentMessage: null,
  messageCount: 0,
});

function useSnackbar() {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
}

export default function SnackbarContextProvider(props: {
  children: React.ReactNode;
}) {
  // In order to assure, that at all times the current state of messages is updated, we use ref instead of state.
  // This prevents loosing messages when messages are pushed/get after a timeout.
  // https://stackoverflow.com/questions/55198517/react-usestate-why-settimeout-function-does-not-have-latest-state-value
  const messages = useRef<SnackbarMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState<SnackbarMessage | null>(
    null,
  );
  const [messageCount, setMessageCount] = useState<number>(0);

  const pushMessage = useCallback(
    (message: SnackbarMessage) => {
      messages.current = [...messages.current, message];
      setMessageCount(messages.current.length + (currentMessage ? 1 : 0));
    },
    [currentMessage],
  );

  const shiftMessage = useCallback(() => {
    if (messages.current.length === 0) {
      setMessageCount(0);
      setCurrentMessage(null);
      return;
    }

    const message = messages.current[0];
    messages.current = messages.current.slice(1);
    setMessageCount(messages.current.length);
    setCurrentMessage(message);
  }, []);

  return (
    <SnackbarContext.Provider
      value={{
        pushMessage,
        shiftMessage,
        currentMessage: currentMessage,
        messageCount: messageCount,
      }}
    >
      {props.children}
    </SnackbarContext.Provider>
  );
}

const { Provider } = SnackbarContext;

export { Provider, useSnackbar };
