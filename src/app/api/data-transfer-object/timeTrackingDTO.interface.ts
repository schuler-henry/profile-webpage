export interface TimeEntryDTO {
  id: string;
  date: string;
  startTime: string;
  endTime: string | null;
  description: string;
  project: string;
}
