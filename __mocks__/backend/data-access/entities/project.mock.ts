import { Project } from '@/src/backend/data-access/database/entities/time-tracking/project';
import moment from 'moment';
import {
  mockUser,
  otherMockUser,
} from '@/__mocks__/backend/data-access/entities/user.mock';

export const mockProject: Project = {
  id: 'fb491449-5745-4ea2-b6d6-fc44b6a671a8',
  name: 'Project 1',
  description: 'Description for Project 1',
  owner: mockUser.id,
  createdAt: moment('2024-10-26 23:10:19.227+00', 'YYYY-MM-DD HH:mm:ss.SSSZ'),
};

export const otherMockProject: Project = {
  id: 'bd231d80-a7a5-4d80-97df-fd41cf647ab3',
  name: 'Project 2',
  description: 'Description for Project 2',
  owner: otherMockUser.id,
  createdAt: moment('2025-04-22 12:05:03.212+00', 'YYYY-MM-DD HH:mm:ss.SSSZ'),
};
