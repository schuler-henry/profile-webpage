'use client';
import {
  TimeTrackingProject,
  TimeTrackingTimeEntry,
} from '@/src/app/api/supabaseTypes';
import EditTimeEntry from '@/src/components/modules/time-tracking/EditTimeEntry/EditTimeEntry';
import TimeEntryTable from '@/src/components/modules/time-tracking/TimeEntryTable/TimeEntryTable';
import { useSnackbar } from '@/src/store/SnackbarContextProvider';
import { getTimeStringFromMinutes } from '@/src/utils/time-tracking/timeFormatFunctions';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Divider,
  Paper,
  Typography,
} from '@mui/material';
import moment from 'moment';
import React, { useEffect } from 'react';
import ImportEntriesButton from '@/src/components/modules/time-tracking/ImportEntriesButton/ImportEntriesButton';

export interface TimeTrackingContentProps {
  project: TimeTrackingProject;
  timeEntries: TimeTrackingTimeEntry[];
}

export default function TimeTrackingContent({
  project,
  timeEntries,
}: TimeTrackingContentProps) {
  const [entries, setEntries] =
    React.useState<TimeTrackingTimeEntry[]>(timeEntries);
  const [selectedTimeEntry, setSelectedTimeEntry] =
    React.useState<TimeTrackingTimeEntry | null>(
      timeEntries.find((entry) => !entry.endTime) || null,
    );
  const { pushMessage } = useSnackbar();

  useEffect(() => {
    setEntries(timeEntries);
    if (!timeEntries.find((entry) => entry.id === selectedTimeEntry?.id)) {
      setSelectedTimeEntry(timeEntries.find((entry) => !entry.endTime) || null);
    }
  }, [project, timeEntries]);

  const handleSaveEntryChanges = async (entry: TimeTrackingTimeEntry) => {
    const response = await fetch(
      '/api/time-tracking/' + project.id + '/updateEntry',
      {
        method: 'POST',
        body: JSON.stringify(entry),
      },
    );

    if (response.ok) {
      // Update entries
      setEntries(entries.map((e) => (e.id === entry.id ? entry : e)));

      if (selectedTimeEntry?.id === entry.id) {
        setSelectedTimeEntry(entry);
      }

      pushMessage({
        message: 'Time entry updated.',
        severity: 'success',
      });
    } else {
      pushMessage({
        message: 'Failed to update time entry.',
        severity: 'error',
      });
    }
  };

  const handleCreateNewEntry = async () => {
    pushMessage({
      message: 'Creating a new time entry...',
      severity: 'info',
      autoHideDuration: 1000,
    });

    const response = await fetch(
      '/api/time-tracking/' + project.id + '/createEntry',
      {
        method: 'POST',
        body: JSON.stringify({ startTime: moment().format('HH:mm:ss'), date: moment().format('yyyy-MM-DD') }),
      },
    );

    if (response.ok) {
      const newEntry: TimeTrackingTimeEntry = await response.json();
      setEntries([...entries, newEntry]);

      pushMessage({
        message: 'Created a new time entry.',
        severity: 'success',
      });
    } else {
      const { error } = await response.json();
      pushMessage({
        message: error,
        severity: 'error',
      });
    }
  };

  const handleStopRunningEntry = async () => {
    const runningEntry = entries.find((entry) => !entry.endTime);
    if (!runningEntry) {
      pushMessage({
        message: 'No running time entry found.',
        severity: 'error',
      });
      return;
    }

    pushMessage({
      message: 'Stopping running time entry...',
      severity: 'info',
      autoHideDuration: 1000,
    });

    // If the runningEntry is updated directly, the reference in the entry list is updated. 
    // However, without the setEntries function, the UI is not updated.
    // Therefore, we create a new object and update the list in the handleSaveEntryChanges function.
    const updatedEntry: TimeTrackingTimeEntry = { ...runningEntry, endTime: moment().format('HH:mm:ss') };

    handleSaveEntryChanges(updatedEntry);
  };

  const handleDeleteEntry = async (id: string) => {
    const response = await fetch(
      '/api/time-tracking/' + project.id + '/deleteEntry',
      {
        method: 'POST',
        body: JSON.stringify({ id }),
      },
    );

    if (response.ok) {
      setEntries(entries.filter((entry) => entry.id !== id));
      setSelectedTimeEntry(null);

      pushMessage({
        message: 'Time entry deleted.',
        severity: 'success',
      });
    } else {
      pushMessage({
        message: 'Failed to delete time entry.',
        severity: 'error',
      });
    }
  };

  const handleSelectEntry = (id: string) => {
    if (selectedTimeEntry && selectedTimeEntry.id === id) {
      return;
    }
    const timeEntry = entries.find((entry) => entry.id === id);
    if (!timeEntry) {
      pushMessage({
        message: `Time entry with id ${id} not found.`,
        severity: 'error',
      });
      return;
    }

    setSelectedTimeEntry(timeEntry);
  };

  return (
    <React.Fragment>
      <Box sx={{ mt: 1, mb: 1 }}>
        <Box sx={{ mb: 1 }}>
          <Box
            sx={{ mt: 5, mb: 5 }}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {entries.find((entry) => !entry.endTime) ? (
              <Button
                variant="contained"
                color="secondary"
                onClick={handleStopRunningEntry}
                disabled={entries.find((entry) => !entry.endTime) === undefined}
              >
                Stop
              </Button>
            ) : (
              <Button
                variant="contained"
                color="secondary"
                onClick={handleCreateNewEntry}
                disabled={entries.find((entry) => !entry.endTime) !== undefined}
              >
                Start (Create new Entry)
              </Button>
            )}
          </Box>
          <Alert severity="info" variant="outlined">
            {entries.find((entry) => !entry.endTime)
              ? 'Tracking time since ' +
                entries.find((entry) => !entry.endTime)?.startTime +
                ' - ' +
                getTimeStringFromMinutes(
                  moment().diff(
                    moment(entries.find((entry) => !entry.endTime)?.startTime, [
                      'HH:mm:ss',
                    ]),
                    'minutes',
                  ),
                ) +
                '.'
              : 'You are currently not tracking time.'}
          </Alert>
        </Box>
        <Divider />
        <Accordion>
          <AccordionSummary
            expandIcon={<FontAwesomeIcon icon={faArrowDown} />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            {selectedTimeEntry
              ? 'Edit Time Entry: ' +
                moment(selectedTimeEntry.date).format('DD.MM.YY') +
                ' - ' +
                getTimeStringFromMinutes(
                  (selectedTimeEntry.endTime
                    ? moment(selectedTimeEntry.endTime, ['hh:mm:ss'])
                    : moment()
                  ).diff(
                    moment(selectedTimeEntry.startTime, ['hh:mm:ss']),
                    'minutes',
                  ),
                )
              : 'No Time Entry Selected'}
          </AccordionSummary>
          <AccordionDetails>
            <EditTimeEntry
              timeEntry={selectedTimeEntry}
              onSave={handleSaveEntryChanges}
              onDelete={handleDeleteEntry}
            />
          </AccordionDetails>
        </Accordion>
      </Box>
      <Divider />
      <Box sx={{ mt: 1, mb: 1 }}>
        <Typography variant="h6" gutterBottom>
          Time Entries
        </Typography>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <TimeEntryTable
            timeEntries={entries}
            onSelectEntry={handleSelectEntry}
          />
        </Paper>
      </Box>
      <Divider />
      <Box sx={{ mt: 1, mb: 1 }}>
        <ImportEntriesButton project={project} setEntries={setEntries} />
      </Box>
    </React.Fragment>
  );
}
