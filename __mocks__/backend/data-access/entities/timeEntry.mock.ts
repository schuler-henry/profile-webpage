import { TimeEntry } from '@/src/backend/data-access/database/entities/time-tracking/timeEntry';
import moment from 'moment/moment';
import {
  mockProject,
  otherMockProject,
} from '@/__mocks__/backend/data-access/entities/project.mock';
import { Moment } from 'moment';

export const mockTimeEntry: TimeEntry = {
  id: '07aa03f0-d7fe-4eb7-a45b-320de25a1cf9',
  date: moment('2025-03-19', 'YYYY-MM-DD'),
  startTime: moment('11:53:43', 'HH:mm:ss'),
  endTime: moment('14:20:13', 'HH:mm:ss'),
  description: 'Admin-Tool: Completed integration of E2E tests in CI.',
  project: mockProject.id,
};

export const otherMockTimeEntry: TimeEntry = {
  id: '3f217266-aebd-42ac-a851-1131d655d540',
  date: moment('2025-05-01', 'YYYY-MM-DD'),
  startTime: moment('08:16:22', 'HH:mm:ss'),
  endTime: moment('11:30:00', 'HH:mm:ss'),
  description: 'Time Entry for project 2',
  project: otherMockProject.id,
};

export const firstNewTimeEntry: TimeEntry = {
  id: '020a43ef-b88d-4292-9da4-5c63ce03c217',
  date: moment('2025-04-12', 'YYYY-MM-DD'),
  startTime: moment('00:00:00', 'HH:mm:ss'),
  endTime: moment('10:05:59', 'HH:mm:ss'),
  description: 'Test Description 2.',
  project: mockProject.id,
};

export const secondNewTimeEntry: TimeEntry = {
  id: '2fc6c034-1670-42d8-b428-f8ea65b27497',
  date: moment('2025-01-31', 'YYYY-MM-DD'),
  startTime: moment('22:22:22', 'HH:mm:ss'),
  endTime: moment('23:59:59', 'HH:mm:ss'),
  description: 'Test Description 3.',
  project: mockProject.id,
};

export const thirdNewTimeEntry: {
  project: string;
  date: Moment;
  startTime: Moment;
} = {
  project: mockProject.id,
  date: moment('2025-02-27', 'YYYY-MM-DD'),
  startTime: moment('08:00:00', 'HH:mm:ss'),
};
