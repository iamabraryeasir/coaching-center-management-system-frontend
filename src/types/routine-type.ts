export type DayOfWeek =
  | "SATURDAY"
  | "SUNDAY"
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY";

export const ACADEMIC_DAYS_ORDER: DayOfWeek[] = [
  "SATURDAY",
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
];

export interface RoutineTeacherSummary {
  id: string;
  name: string;
  email: string;
  phone: string;
  designation: string | null;
  specialization: string | null;
}

export interface RoutineBatchSummary {
  id: string;
  name: string;
  fee: number;
}

export interface RoutineSlot {
  id: string;
  batchId: string;
  dayOfWeek: DayOfWeek;
  startTime: string; // "09:00"
  endTime: string; // "10:30"
  subject: string | null;
  room: string | null;
  teacherId: string | null;
  teacher?: RoutineTeacherSummary | null;
  batch?: RoutineBatchSummary | null;
  createdAt: string;
  updatedAt: string;
}

export interface DayTimetableGroup {
  dayOfWeek: DayOfWeek;
  slots: RoutineSlot[];
}

export interface BatchTimetableData {
  batch?: RoutineBatchSummary;
  totalSlots: number;
  schedule: DayTimetableGroup[];
}

export interface TeacherScheduleData {
  teacher: RoutineTeacherSummary;
  totalSlots: number;
  schedule: DayTimetableGroup[];
}

export interface StudentScheduleData {
  studentId: string;
  totalSlots: number;
  enrolledBatchesCount: number;
  schedule: DayTimetableGroup[];
}

export interface CreateRoutineSlotDto {
  batchId: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  subject?: string;
  room?: string;
  teacherId?: string;
}

export interface UpdateRoutineSlotDto {
  dayOfWeek?: DayOfWeek;
  startTime?: string;
  endTime?: string;
  subject?: string;
  room?: string;
  teacherId?: string | null;
}

export interface RoutineQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  batchId?: string;
  dayOfWeek?: DayOfWeek;
  teacherId?: string;
  room?: string;
  subject?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
