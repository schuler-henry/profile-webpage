import { TimeEntry } from '@/src/backend/data-access/database/entities/time-tracking/timeEntry';
import { TimeEntryDTO } from '@/src/app/api/data-transfer-object/timeTrackingDTO.interface';
import moment from 'moment';

export class TimeTrackingDTOMapper {
  public static toDTO(timeEntry: TimeEntry): TimeEntryDTO {
    return {
      id: timeEntry.id,
      date: timeEntry.date.format('yyyy-MM-DD'),
      startTime: timeEntry.startTime.format('HH:mm:ss'),
      endTime: timeEntry.endTime?.format('HH:mm:ss') ?? null,
      description: timeEntry.description,
      project: timeEntry.project,
    };
  }

  public static toTimeEntry(dto: TimeEntryDTO): TimeEntry {
    return {
      id: dto.id,
      date: moment(dto.date, 'YYYY-MM-DD'),
      startTime: moment(dto.startTime, 'HH:mm:ss'),
      endTime: dto.endTime ? moment(dto.endTime, 'HH:mm:ss') : null,
      description: dto.description,
      project: dto.project,
    };
  }
}
