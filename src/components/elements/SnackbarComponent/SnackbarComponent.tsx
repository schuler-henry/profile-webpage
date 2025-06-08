'use client';
import { SnackbarMessage, useSnackbar } from '@/src/store/SnackbarContextProvider';
import { Alert, Badge, Slide, SlideProps } from '@mui/material';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import { TransitionProps } from '@mui/material/transitions';
import React, { useEffect, useState } from 'react';

export default function SnackbarComponent() {
  const [state, setState] = useState<{
    open: boolean;
    Transition: React.ComponentType<
      TransitionProps & {
        children: React.ReactElement<any, any>;
      }
    >;
    snackbarMessage: SnackbarMessage | null;
  }>({
    open: false,
    Transition: SlideTransition,
    snackbarMessage: null,
  });

  const { getMessage, hasMessages, messageCount } = useSnackbar();

  useEffect(() => {
    fetchMessage();
  }, [hasMessages]);

  useEffect(() => {
    if (!state.open) {
      setTimeout(() => {
        fetchMessage();
      }, 500);
    }
  }, [state]);

  function fetchMessage() {
    if (hasMessages && !state.open) {
      const message: SnackbarMessage | null = getMessage();
      if (message) {
        setState({
          ...state,
          open: true,
          snackbarMessage: message,
        });
      }
    }
  }

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason == 'clickaway') {
      return;
    }

    setState({
      ...state,
      open: false,
      snackbarMessage: null,
    });
  };

  function SlideTransition(props: SlideProps) {
    return <Slide {...props} direction="up" />;
  }

  return (
    <React.Fragment>
      <Snackbar
        open={state.open}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ width: '-webkit-fill-available' }}
        autoHideDuration={state.snackbarMessage?.autoHideDuration || 3000}
        onClose={handleClose}
        TransitionComponent={state.Transition}
        key={state.Transition.name}
      >
        <Badge
          badgeContent={messageCount}
          color="primary"
          sx={{ width: '90%' }}
        >
          <Alert
            onClose={handleClose}
            severity={state.snackbarMessage?.severity}
            sx={{ width: '100%' }}
            variant="filled"
          >
            {state.snackbarMessage?.message}
          </Alert>
        </Badge>
      </Snackbar>
    </React.Fragment>
  );
}
