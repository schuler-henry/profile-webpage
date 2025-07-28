import { User } from '@supabase/supabase-js';
import { Moment } from 'moment';

export interface StudiesSummary {
  id?: number;
  title?: string;
  description?: string;
  degree?: number | StudiesDegree;
  language?: string | StudiesLanguage;
  university?: string | StudiesUniversity;
  semester?: number;
  semesterPeriod?: string | StudiesSemester;
  lastModified?: string;
  file?: string;
  professors?: StudiesProfessor[];
}

export interface StudiesSemester {
  name?: string;
}

export interface StudiesDegree {
  degree?: string;
  subject?: string;
  id?: number;
}

export interface StudiesLanguage {
  code?: string;
}

export interface StudiesProfessor {
  id?: number;
  firstName?: string;
  lastName?: string;
}

export interface StudiesUniversity {
  name?: string;
}

export interface TimeTrackingProject {
  id: string;
  name: string;
  description: string;
  owner: string | User;
  createdAt: string;
}

export interface TimeTrackingTimeEntry {
  id: string;
  date: string;
  startTime: string;
  endTime: string | null;
  description: string;
  project: string | TimeTrackingProject;
}
