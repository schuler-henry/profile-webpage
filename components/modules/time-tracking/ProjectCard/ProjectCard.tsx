'use client';
import {
  TimeTrackingProject,
  TimeTrackingTimeEntry,
} from '@/app/api/supabaseTypes';
import { getTimeStringFromMinutes } from '@/utils/time-tracking/timeFormatFunctions';
import {
  Box,
  Card,
  CardActionArea,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';
import moment, { Moment } from 'moment';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

export interface ProjectCardProps {
  project: TimeTrackingProject;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const HISTORY_DAYS = 7;
  const [timeEntries, setTimeEntries] = React.useState<TimeTrackingTimeEntry[]>(
    [],
  );
  const [totalTimeInMinutes, setTotalTimeInMinutes] = React.useState<number>(0);
  const [runningTimeEntrySeconds, setRunningTimeEntrySeconds] =
    React.useState<number>(0);
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    const fetchTimeEntries = async () => {
      const response = await fetch(
        '/api/time-tracking/' + project.id + '/getEntries',
        {
          method: 'GET',
        },
      );

      if (response.ok) {
        const timeEntries: TimeTrackingTimeEntry[] = await response.json();
        setTimeEntries(timeEntries);

        if (getRunningTimeEntry(timeEntries)) {
          setInterval(() => {
            const runningTimeEntry = getRunningTimeEntry(timeEntries);
            if (runningTimeEntry) {
              setRunningTimeEntrySeconds(
                moment().diff(
                  moment(runningTimeEntry.startTime, ['hh:mm:ss']),
                  'seconds',
                ),
              );
            } else {
              setRunningTimeEntrySeconds(0);
            }
          }, 1000);
        }
      }
    };

    fetchTimeEntries();
  }, []);

  useEffect(() => {
    const totalTimeInMinutes = timeEntries.reduce((acc, entry) => {
      if (!entry.endTime) {
        return acc;
      }

      const duration = moment(entry.endTime, ['hh:mm:ss']).diff(
        moment(entry.startTime, ['hh:mm:ss']),
        'minutes',
      );
      return acc + duration;
    }, 0);

    setTotalTimeInMinutes(totalTimeInMinutes || 0);
  }, [timeEntries]);

  function getTotalTimeInMinutesForDay(date: Moment): number {
    return timeEntries.reduce((acc, entry) => {
      if (!entry.endTime) {
        return acc;
      }

      const entryDate = moment(entry.date);
      if (entryDate.isSame(moment(date), 'date')) {
        const duration = moment(entry.endTime, ['hh:mm:ss']).diff(
          moment(entry.startTime, ['hh:mm:ss']),
          'minutes',
        );
        return acc + duration;
      }

      return acc;
    }, 0);
  }

  function getRunningTimeEntry(
    timeEntries: TimeTrackingTimeEntry[],
  ): TimeTrackingTimeEntry | null {
    return timeEntries.find((entry) => !entry.endTime) || null;
  }

  const openProject = async (_: any) => {
    router.push(`/time-tracking/${project.id}`);
  };

  return (
    <Card variant="outlined">
      <CardActionArea onClick={openProject}>
        <Box sx={{ p: 2 }}>
          <Stack
            direction="row"
            spacing={2}
            sx={{ justifyContent: 'space-between', alignItems: 'center' }}
          >
            <Typography gutterBottom variant="h5" component="div">
              {project.name}
            </Typography>
            <Box>
              <Stack direction="column" alignItems={'end'}>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ whiteSpace: 'nowrap' }}
                >
                  {getTimeStringFromMinutes(totalTimeInMinutes)}
                </Typography>
                <Typography
                  variant="subtitle1"
                  component="div"
                  sx={{
                    whiteSpace: 'nowrap',
                    color:
                      runningTimeEntrySeconds > 0
                        ? theme.palette.secondary.main
                        : undefined,
                    opacity: runningTimeEntrySeconds > 0 ? undefined : 0.7,
                  }}
                >
                  {runningTimeEntrySeconds > 0
                    ? // ? getTimeStringFromSeconds(runningTimeEntrySeconds)
                      moment()
                        .startOf('day')
                        .seconds(runningTimeEntrySeconds)
                        .format('HH:mm:ss')
                    : '--:--:--'}
                </Typography>
              </Stack>
            </Box>
          </Stack>
          <Divider sx={{ mt: 1, mb: 1 }} />
          <Typography
            variant="subtitle2"
            fontStyle="italic"
            textAlign="justify"
            sx={{ color: 'text.secondary' }}
          >
            &quot;{project.description}&quot;
          </Typography>
        </Box>
      </CardActionArea>
      <Divider />
      <Box sx={{ p: 2 }}>
        <TableContainer sx={{ direction: 'rtl' }}>
          <Table sx={{ direction: 'ltr', whiteSpace: 'nowrap' }}>
            <TableHead>
              <TableRow>
                {Array.from(
                  new Array(HISTORY_DAYS),
                  (_, i) => i + 1 - HISTORY_DAYS,
                ).map((dayOffset) => {
                  return (
                    <TableCell
                      key={'CardHead' + project.id + dayOffset}
                      align="center"
                      sx={
                        dayOffset == 0
                          ? { color: theme.palette.success.main }
                          : undefined
                      }
                    >
                      {moment().add(dayOffset, 'days').format('DD.MM. (dd)')}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow sx={{ whiteSpace: 'nowrap' }}>
                {Array.from(
                  new Array(HISTORY_DAYS),
                  (_, i) => i + 1 - HISTORY_DAYS,
                ).map((dayOffset) => {
                  const minutesForDay = getTotalTimeInMinutesForDay(
                    moment().add(dayOffset, 'days'),
                  );

                  return (
                    <TableCell
                      key={'CardBody' + project.id + dayOffset}
                      align="center"
                      sx={{
                        opacity: minutesForDay == 0 ? 0.7 : undefined,
                        color:
                          dayOffset == 0
                            ? theme.palette.success.main
                            : undefined,
                      }}
                    >
                      {getTimeStringFromMinutes(
                        minutesForDay +
                          (dayOffset == 0 ? runningTimeEntrySeconds / 60 : 0),
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Card>
  );
}
