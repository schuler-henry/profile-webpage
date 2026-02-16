import { Moment } from 'moment';

export interface TimeEntry {
  id: string;
  date: Moment;
  startTime: Moment;
  endTime: Moment | null;
  description: string;
  project: string;
}
