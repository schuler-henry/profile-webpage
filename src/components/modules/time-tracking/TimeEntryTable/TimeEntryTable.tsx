'use client';
import { TimeTrackingTimeEntry } from '@/src/backend/data-access/database/supabaseTypes';
import { useSnackbar } from '@/src/store/SnackbarContextProvider';
import { getTimeStringFromSeconds } from '@/src/utils/time-tracking/timeFormatFunctions';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  useTheme,
} from '@mui/material';
import moment from 'moment';
import React, { useState } from 'react';

export interface TimeEntryTableProps {
  timeEntries: TimeTrackingTimeEntry[];
  onSelectEntry: (id: string) => void;
}

export default function TimeEntryTable({
  timeEntries,
  onSelectEntry,
}: TimeEntryTableProps) {
  const [selected, setSelected] = useState<readonly string[]>([]);
  const theme = useTheme();
  const { pushMessage } = useSnackbar();

  const handleSelectCheckbox = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string,
  ): void => {
    e.stopPropagation();
    if (selected.includes(id)) {
      setSelected(selected.filter((entry) => entry !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const handleSelectTableRow = (id: string): void => {
    if (
      selected.length != 0 &&
      !(selected.length == 1 && selected.includes(id))
    ) {
      pushMessage({
        message: 'Please unselect the current entries first.',
        severity: 'error',
      });
      return;
    }
    onSelectEntry(id);
  };

  return (
    <TableContainer>
      <Table aria-labelledby="Time Entries" size="medium">
        <TableBody>
          {timeEntries
            .sort(
              (a, b) =>
                // sort by date and then by start time
                moment(b.date).diff(moment(a.date)) ||
                moment(b.startTime, 'HH:mm:ss').diff(
                  moment(a.startTime, 'HH:mm:ss'),
                ),
            )
            .map((entry, index) => {
              const today = moment(new Date());
              const date = moment(entry.date);
              const startTime = moment(entry.startTime, ['hh:mm:ss']);
              const endTime = entry.endTime
                ? moment(entry.endTime, ['hh:mm:ss'])
                : null;

              const isToday = date.isSame(today, 'day');
              const isWeek = date.isSame(today, 'W');

              const isItemSelected = selected.includes(entry.id);
              const labelId = `enhanced-table-checkbox-${index}`;

              return (
                <TableRow
                  hover
                  key={entry.id}
                  onClick={() => handleSelectTableRow(entry.id)}
                  sx={{
                    '& .MuiTableCell-root': {
                      color: isWeek
                        ? isToday
                          ? theme.palette.success.main
                          : theme.palette.secondary.main
                        : undefined,
                    },
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    backgroundColor: isItemSelected
                      ? theme.palette.action.selected
                      : undefined,
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isItemSelected}
                      onClick={(e) => handleSelectCheckbox(e, entry.id)}
                      slotProps={{
                        input: {
                          'aria-labelledby': labelId,
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>{'KW ' + date.format('W (YYYY)')}</TableCell>
                  <TableCell>{date.format('ddd')}</TableCell>
                  <TableCell>{date.format('DD.MM')}</TableCell>
                  <TableCell>{startTime.format('HH:mm:ss')}</TableCell>
                  <TableCell>
                    {endTime ? endTime.format('HH:mm:ss') : '-'}
                  </TableCell>
                  <TableCell
                    sx={
                      endTime
                        ? undefined
                        : { fontStyle: 'italic', opacity: 0.7 }
                    }
                  >
                    {endTime
                      ? getTimeStringFromSeconds(
                          endTime.diff(startTime, 'seconds'),
                        )
                      : getTimeStringFromSeconds(
                          today.diff(startTime, 'seconds'),
                        )}
                  </TableCell>
                  <TableCell>{entry.description}</TableCell>
                  <TableCell
                    sx={{
                      paddingTop: 0,
                      paddingBottom: 0,
                    }}
                    align="center"
                    width="fit-content"
                  >
                    <IconButton
                      size="medium"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (navigator.clipboard) {
                          navigator.clipboard.writeText(entry.description);
                          pushMessage({
                            message: 'Description copied to clipboard.',
                            severity: 'success',
                          });
                        } else {
                          pushMessage({
                            message: 'Could not copy description to clipboard.',
                            severity: 'error',
                          });
                        }
                      }}
                    >
                      <FontAwesomeIcon icon={faCopy} size="sm" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
