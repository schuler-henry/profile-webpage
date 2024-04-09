'use client';
import React, { MouseEventHandler, useEffect } from 'react';
import styles from './ConfirmationDialog.module.css';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

export interface ConfirmationDialogProps {
  title: string;
  open: boolean;
  onClose: (value?: string) => void;
  children?: React.ReactNode;
}

export default function ConfirmationDialog(props: ConfirmationDialogProps) {
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  const handleCancel = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    props.onClose();
  };

  const handleOk = () => {
    props.onClose('ok');
  };

  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
      maxWidth="xs"
      open={open}
    >
      <DialogTitle>{props.title}</DialogTitle>
      {props.children ? <DialogContent>{props.children}</DialogContent> : null}
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleOk}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
}
