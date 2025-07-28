'use client';
import { AlertColor } from '@mui/material';
import { createContext, useContext, useRef, useState } from 'react';

export interface SnackbarMessage {
  message: string;
  severity?: AlertColor;
  autoHideDuration?: number;
}

interface SnackbarContextInterface {
  pushMessage: (message: SnackbarMessage) => void;
  getMessage: () => SnackbarMessage | null;
  hasMessages: boolean;
  messageCount: number;
}

const SnackbarContext = createContext<SnackbarContextInterface>({
  pushMessage: (message: SnackbarMessage) => {},
  getMessage: () => null,
  hasMessages: false,
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
  const [messageCount, setMessageCount] = useState<number>(0);
  const [hasMessages, setHasMessages] = useState<boolean>(false);

  const pushMessage = (message: SnackbarMessage) => {
    messages.current = [...messages.current, message];
    setMessageCount(messages.current.length);

    if (!hasMessages) {
      setHasMessages(true);
    }
  };

  const getMessage = () => {
    const message: SnackbarMessage | null =
      messages.current.length > 0 ? messages.current[0] : null;
    messages.current = messages.current.slice(1);
    setMessageCount(messages.current.length);
    if (messages.current.length === 0) {
      setHasMessages(false);
    }
    return message;
  };

  return (
    <SnackbarContext.Provider
      value={{
        pushMessage,
        getMessage,
        hasMessages,
        messageCount,
      }}
    >
      {props.children}
    </SnackbarContext.Provider>
  );
}

const { Provider } = SnackbarContext;

export { Provider, useSnackbar };
