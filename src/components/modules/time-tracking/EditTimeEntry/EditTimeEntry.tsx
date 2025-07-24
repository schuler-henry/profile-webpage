'use client';
import { TimeTrackingTimeEntry } from '@/src/app/api/supabaseTypes';
import { useSnackbar } from '@/src/store/SnackbarContextProvider';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  TextField,
} from '@mui/material';
import {
  DatePicker,
  LocalizationProvider,
  TimeField,
  TimePicker,
  renderDateViewCalendar,
  renderTimeViewClock,
  PickersActionBarProps,
  usePickerActionsContext,
} from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment, { Moment } from 'moment';
import React, { useEffect, useRef } from 'react';

export interface EditTimeEntryProps {
  timeEntry: TimeTrackingTimeEntry | null;
  onSaveAction: (timeEntry: TimeTrackingTimeEntry) => void;
  onDeleteAction: (id: string) => void;
}

export default function EditTimeEntry({
  timeEntry,
  onSaveAction,
  onDeleteAction,
}: EditTimeEntryProps) {
  const prevTimeEntry = useRef<TimeTrackingTimeEntry | null>(null);

  const [newDate, setNewDate] = React.useState<Moment | null>(null);
  const [newStartTime, setNewStartTime] = React.useState<Moment | null>(null);
  const [newEndTime, setNewEndTime] = React.useState<Moment | null>(null);
  const [newDescription, setNewDescription] = React.useState<string>('');
  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] =
    React.useState<boolean>(false);

  const { pushMessage } = useSnackbar();

  useEffect(() => {
    function initialize(timeEntry: TimeTrackingTimeEntry | null) {
      if (timeEntry == null) {
        setNewDate(null);
        setNewStartTime(null);
        setNewEndTime(null);
        setNewDescription('');
      } else {
        setNewDate(moment(timeEntry.date));
        setNewStartTime(moment(timeEntry.startTime, ['hh:mm:ss']));
        setNewEndTime(
          timeEntry.endTime ? moment(timeEntry.endTime, ['hh:mm:ss']) : null,
        );
        setNewDescription(timeEntry.description);
      }
    }

    function update(
      oldTimeEntry: TimeTrackingTimeEntry | null,
      updatedTimeEntry: TimeTrackingTimeEntry | null,
    ) {
      if (oldTimeEntry == null) {
        initialize(updatedTimeEntry);
        return;
      }
      if (updatedTimeEntry == null) {
        return;
      }

      if (oldTimeEntry.date != updatedTimeEntry.date) {
        setNewDate(moment(updatedTimeEntry.date));
      }
      if (oldTimeEntry.startTime != updatedTimeEntry.startTime) {
        setNewStartTime(moment(updatedTimeEntry.startTime, ['hh:mm:ss']));
      }
      if (oldTimeEntry.endTime != updatedTimeEntry.endTime) {
        setNewEndTime(
          updatedTimeEntry.endTime
            ? moment(updatedTimeEntry.endTime, ['hh:mm:ss'])
            : null,
        );
      }
      if (oldTimeEntry.description != updatedTimeEntry.description) {
        setNewDescription(updatedTimeEntry.description);
      }
    }

    if (
      prevTimeEntry.current == null ||
      prevTimeEntry.current.id != timeEntry?.id
    ) {
      // User selected a different time entry => reset form
      initialize(timeEntry);
    } else {
      // Some event changed the props => update form
      update(prevTimeEntry.current, timeEntry);
    }

    prevTimeEntry.current = timeEntry;
  }, [timeEntry]);

  const handleDateChange = (date: Moment | null) => {
    setNewDate(date);
  };

  const handleResetDate = () => {
    setNewDate(timeEntry ? moment(timeEntry.date) : null);
  };

  const handleStartTimeChange = (date: Moment | null) => {
    setNewStartTime(date);
  };

  const handleResetStartTime = () => {
    setNewStartTime(
      timeEntry?.startTime ? moment(timeEntry?.startTime, ['hh:mm:ss']) : null,
    );
  };

  const handleEndTimeChange = (date: Moment | null) => {
    setNewEndTime(date);
  };

  const handleResetEndTime = () => {
    setNewEndTime(
      timeEntry?.endTime ? moment(timeEntry?.endTime, ['hh:mm:ss']) : null,
    );
  };

  const handleUpdateDescription = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setNewDescription(event.target.value);
  };

  const handleResetDescription = () => {
    setNewDescription(timeEntry?.description || '');
  };

  function save() {
    if (!timeEntry) {
      pushMessage({
        message: 'Cannot save if no time entry is selected.',
        severity: 'error',
      });
      return;
    }
    if (
      newStartTime?.isSame(moment(timeEntry.startTime, ['hh:mm:ss'])) &&
      (timeEntry.endTime
        ? newEndTime?.isSame(moment(timeEntry.endTime, ['hh:mm:ss']))
        : newEndTime == null) &&
      newDescription === timeEntry.description
    ) {
      pushMessage({
        message: 'No changes detected.',
        severity: 'info',
      });
      return;
    }

    if (newDate == null || newStartTime == null) {
      pushMessage({
        message: 'Date and start time are required.',
        severity: 'error',
      });
      return;
    }

    onSaveAction({
      ...timeEntry,
      date: newDate.format('YYYY-MM-DD'),
      startTime: newStartTime.format('HH:mm:ss'),
      endTime: newEndTime ? newEndTime.format('HH:mm:ss') : null,
      description: newDescription,
    });
  }

  const handleDeleteEntry = () => {
    if (!timeEntry) {
      pushMessage({
        message: 'Cannot delete if no time entry is selected.',
        severity: 'error',
      });
      return;
    }

    setOpenConfirmDeleteDialog(true);
  };

  const handleProceedDelete = () => {
    setOpenConfirmDeleteDialog(false);
    if (timeEntry == null) {
      pushMessage({
        message: 'Cannot delete if no time entry is selected.',
        severity: 'error',
      });
      return;
    }
    pushMessage({
      message: 'Deleting time entry...',
      severity: 'info',
      autoHideDuration: 1000,
    });
    onDeleteAction(timeEntry.id);
  };

  const handleAbortDelete = () => {
    setOpenConfirmDeleteDialog(false);
    pushMessage({
      message: 'Deletion aborted.',
      severity: 'info',
      autoHideDuration: 1000,
    });
  };

  function CustomDatePickerActionBar(props: PickersActionBarProps) {
    const { setValueToToday, acceptValueChanges, cancelValueChanges } =
      usePickerActionsContext();

    return (
      <DialogActions sx={{ gridColumn: 2, gridRow: 3 }}>
        <Button onClick={setValueToToday}>Today</Button>
        <Divider orientation="vertical" flexItem />
        <Button onClick={cancelValueChanges}>Cancel</Button>
        <Button onClick={acceptValueChanges}>Ok</Button>
      </DialogActions>
    );
  }

  function CustomSoDTimePickerActionBar(props: PickersActionBarProps) {
    const { setValueToToday, acceptValueChanges, cancelValueChanges } =
      usePickerActionsContext();

    return (
      <DialogActions sx={{ gridColumn: 2, gridRow: 3 }}>
        <Button
          onClick={() => {
            setNewStartTime(moment().startOf('day'));
            acceptValueChanges();
          }}
        >
          SoD
        </Button>
        <Button onClick={setValueToToday}>Now</Button>
        <Divider orientation="vertical" flexItem />
        <Button onClick={cancelValueChanges}>Cancel</Button>
        <Button onClick={acceptValueChanges}>Ok</Button>
      </DialogActions>
    );
  }

  function CustomEoDTimePickerActionBar(props: PickersActionBarProps) {
    const { setValueToToday, acceptValueChanges, cancelValueChanges } =
      usePickerActionsContext();

    return (
      <DialogActions sx={{ gridColumn: 2, gridRow: 3 }}>
        <Button onClick={setValueToToday}>Now</Button>
        <Button
          onClick={() => {
            setNewEndTime(moment().endOf('day'));
            acceptValueChanges();
          }}
        >
          EoD
        </Button>
        <Divider orientation="vertical" flexItem />
        <Button onClick={cancelValueChanges}>Cancel</Button>
        <Button onClick={acceptValueChanges}>Ok</Button>
      </DialogActions>
    );
  }

  return (
    <React.Fragment>
      {timeEntry ? (
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <Box
            display="grid"
            gridTemplateColumns={'auto min-content min-content'}
            gap={1}
          >
            <Box gridRow={1} gridColumn={'1 / 3'}>
              <DatePicker
                // The key is required to force a re-render when the start time changes
                // => the cancel button will reset to the correct time when the props change.
                key={`date-picker-${newDate?.toString()}`}
                label="Date"
                viewRenderers={{
                  day: renderDateViewCalendar,
                }}
                value={newDate}
                onChange={handleDateChange}
                maxDate={moment()}
                slots={{
                  actionBar: CustomDatePickerActionBar,
                }}
                sx={{ width: '100%' }}
              />
            </Box>
            <Box
              gridRow={1}
              gridColumn={3}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Button
                variant="outlined"
                color="primary"
                onClick={handleResetDate}
                disabled={newDate?.isSame(moment(timeEntry.date), 'day')}
              >
                Reset
              </Button>
            </Box>
            <Box gridRow={2} gridColumn={'1 / 3'}>
              <TimePicker
                // The key is required to force a re-render when the start time changes
                // => the cancel button will reset to the correct time when the props change.
                key={`start-time-picker-${newStartTime?.toString()}`}
                label="Start Time"
                views={['hours', 'minutes', 'seconds']}
                ampm={false}
                viewRenderers={{
                  hours: renderTimeViewClock,
                  minutes: renderTimeViewClock,
                  seconds: renderTimeViewClock,
                }}
                value={newStartTime}
                onChange={handleStartTimeChange}
                maxTime={newEndTime || undefined}
                slots={{
                  actionBar: CustomSoDTimePickerActionBar,
                }}
                sx={{ width: '100%' }}
              />
            </Box>
            <Box
              gridRow={2}
              gridColumn={3}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Button
                variant="outlined"
                color="primary"
                onClick={handleResetStartTime}
                disabled={newStartTime?.isSame(
                  moment(timeEntry.startTime, ['hh:mm:ss']),
                )}
              >
                Reset
              </Button>
            </Box>
            <Box gridRow={3} gridColumn={'1 / 3'}>
              <TimePicker
                // The key is required to force a re-render when the start time changes
                // => the cancel button will reset to the correct time when the props change.
                key={`end-time-picker-${newEndTime?.toString()}`}
                label="End Time"
                views={['hours', 'minutes', 'seconds']}
                ampm={false}
                viewRenderers={{
                  hours: renderTimeViewClock,
                  minutes: renderTimeViewClock,
                  seconds: renderTimeViewClock,
                }}
                value={newEndTime}
                onChange={handleEndTimeChange}
                minTime={newStartTime || undefined}
                slots={{
                  actionBar: CustomEoDTimePickerActionBar,
                }}
                sx={{ width: '100%' }}
              />
            </Box>
            <Box
              gridRow={3}
              gridColumn={3}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Button
                variant="outlined"
                color="primary"
                onClick={handleResetEndTime}
                disabled={
                  timeEntry?.endTime
                    ? newEndTime?.isSame(
                        moment(timeEntry.endTime, ['hh:mm:ss']),
                      )
                    : newEndTime == null
                }
              >
                Reset
              </Button>
            </Box>
            <Box gridRow={4} gridColumn={'1 / 3'}>
              <TextField
                label="Description"
                placeholder="Summary of the work done"
                value={newDescription}
                onChange={handleUpdateDescription}
                multiline
                fullWidth
              />
            </Box>
            <Box
              gridRow={4}
              gridColumn={3}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Button
                variant="outlined"
                color="primary"
                onClick={handleResetDescription}
                disabled={newDescription === timeEntry?.description}
              >
                Reset
              </Button>
            </Box>
            <Box gridRow={5} gridColumn={1}>
              <TimeField
                label="Duration"
                value={moment()
                  .startOf('day')
                  .seconds(newEndTime?.diff(newStartTime, 'seconds') || 0)}
                format="HH:mm:ss"
                disabled
                sx={{ width: '100%' }}
              />
            </Box>
            <Box
              gridRow={5}
              gridColumn={2}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Button
                variant="outlined"
                color="primary"
                onClick={handleDeleteEntry}
              >
                Delete
              </Button>
            </Box>
            <Box
              gridRow={5}
              gridColumn={3}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Button
                variant="outlined"
                color="primary"
                onClick={() => save()}
                disabled={
                  newDate?.isSame(moment(timeEntry.date), 'day') &&
                  newStartTime?.isSame(
                    moment(timeEntry?.startTime, ['hh:mm:ss']),
                  ) &&
                  (timeEntry?.endTime
                    ? newEndTime?.isSame(
                        moment(timeEntry?.endTime, ['hh:mm:ss']),
                      )
                    : newEndTime == null) &&
                  newDescription === timeEntry?.description
                }
              >
                Save
              </Button>
            </Box>
          </Box>
        </LocalizationProvider>
      ) : (
        <div>
          <Alert severity="info">Please select a time entry to edit.</Alert>
        </div>
      )}
      <Dialog
        open={openConfirmDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'Do you want to delete this time entry?'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Alert variant="outlined" severity="warning">
              This action cannot be undone.
            </Alert>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={handleProceedDelete}>
            Yes
          </Button>
          <Button color="secondary" onClick={handleAbortDelete} autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
