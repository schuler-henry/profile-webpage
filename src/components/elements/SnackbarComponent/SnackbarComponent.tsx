'use client';
import { useSnackbar } from '@/src/store/SnackbarContextProvider';
import { Alert, Badge, Slide, SlideProps } from '@mui/material';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import React, { useCallback, useEffect } from 'react';

export default function SnackbarComponent() {
  const { shiftMessage, currentMessage, messageCount } = useSnackbar();

  useEffect(() => {
    if (!currentMessage) {
      shiftMessage();
    }
  }, [shiftMessage, currentMessage, messageCount]);

  const getSlideTransition = useCallback((props: SlideProps) => {
    return <Slide {...props} direction="up" />;
  }, []);

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason == 'clickaway') {
      return;
    }

    shiftMessage();
  };

  return (
    <React.Fragment>
      <Snackbar
        open={currentMessage !== null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ width: '-webkit-fill-available' }}
        autoHideDuration={currentMessage?.autoHideDuration || 3000}
        onClose={handleClose}
        slots={{ transition: getSlideTransition }}
        key={getSlideTransition.name}
      >
        <Badge
          badgeContent={messageCount}
          color="primary"
          sx={{ width: '90%' }}
        >
          <Alert
            onClose={handleClose}
            severity={currentMessage?.severity}
            sx={{ width: '100%' }}
            variant="filled"
          >
            {currentMessage?.message}
          </Alert>
        </Badge>
      </Snackbar>
    </React.Fragment>
  );
}
