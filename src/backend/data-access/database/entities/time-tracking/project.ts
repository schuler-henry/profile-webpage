import { Moment } from 'moment';

export interface Project {
  id: string;
  name: string;
  description: string;
  owner: string;
  createdAt: Moment;
}
