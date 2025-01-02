'use client';
import {
  TimeTrackingProject,
  TimeTrackingTimeEntry,
} from '@/app/api/supabaseTypes';
import { useSnackbar } from '@/store/SnackbarContextProvider';
import { faCloudUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, styled } from '@mui/material';
import { v4 as uuid4 } from 'uuid';
import React from 'react';
import moment from 'moment';

export interface ImportEntriesButtonProps {
  project: TimeTrackingProject;
  setEntries: (entries: TimeTrackingTimeEntry[]) => void;
}

export default function ImportEntriesButton({
  project,
  setEntries,
}: ImportEntriesButtonProps) {
  const { pushMessage } = useSnackbar();

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  const handleImportEntries = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      pushMessage({
        message: 'No file selected.',
        severity: 'error',
      });
      return;
    }

    const file = event.target.files[0];

    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result as string;

      pushMessage({
        message: 'Parsing time entries...',
        severity: 'info',
        autoHideDuration: 1000,
      });

      const parsedEntries: TimeTrackingTimeEntry[] = content
        .split('\n')
        .map((line) => {
          const [id, startDate, endDate, description] = line.split(';');

          return {
            id: uuid4(),
            date: moment(startDate).format('YYYY-MM-DD'),
            startTime: moment(startDate).format('HH:mm:ss'),
            endTime: moment(endDate).format('HH:mm:ss'),
            description: description || '',
            project: project.id,
          };
        });

      pushMessage({
        message: 'Importing time entries...',
        severity: 'info',
        autoHideDuration: 1000,
      });

      const response = await fetch(
        '/api/time-tracking/' + project.id + '/importEntries',
        {
          method: 'POST',
          body: JSON.stringify(parsedEntries),
        },
      );

      if (response.ok) {
        const newEntries: TimeTrackingTimeEntry[] = await response.json();
        setEntries(newEntries);

        pushMessage({
          message: 'Imported time entries.',
          severity: 'success',
        });
      } else {
        pushMessage({
          message: 'Failed to import time entries.',
          severity: 'error',
        });
      }
    };

    reader.readAsText(file);
  };

  return (
    <Button
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<FontAwesomeIcon icon={faCloudUpload} />}
      disabled
    >
      Import Time Entries
      <VisuallyHiddenInput type="file" onChange={handleImportEntries} />
    </Button>
  );
}
