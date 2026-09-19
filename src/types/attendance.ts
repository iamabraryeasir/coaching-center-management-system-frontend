import type { ApiMeta } from "./api-type";
import type { User } from "./auth-type";

export type AttendanceStatus =
  | "PRESENT"
  | "ABSENT"
  | "LATE"
  | "EXCUSED"
  | "LEAVE";
export type TeacherAttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "LEAVE";

/**
 * Attendance Record for a student in a batch on a specific date
 */
export interface AttendanceRecord {
  id: string;
  studentId: string;
  batchId?: string;
  date: string;
  status: AttendanceStatus;
  remarks?: string | null;
  markedById?: string;
  markedBy?: User;
  student?: User;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Batch Attendance Sheet response for a specific date
 */
export interface BatchAttendanceSheetData {
  batchId: string;
  date: string;
  totalEnrolled: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  excusedCount?: number;
  leaveCount?: number;
  attendanceRate: number;
  records: AttendanceRecord[];
}

/**
 * DTO for Bulk Daily Attendance Submission
 */
export interface BulkStudentAttendanceItemDto {
  studentId: string;
  status: AttendanceStatus;
  remarks?: string;
}

export interface BulkStudentAttendanceDto {
  date: string;
  records: BulkStudentAttendanceItemDto[];
}

/**
 * DTO for Updating Single Attendance Record
 */
export interface UpdateAttendanceDto {
  status: AttendanceStatus;
  remarks?: string;
}

/**
 * Student Attendance Summary & History
 */
export interface StudentAttendanceHistoryItem {
  id: string;
  date: string;
  status: AttendanceStatus;
  remarks?: string | null;
  batchName?: string;
  batchId?: string;
  batch?: {
    id: string;
    name: string;
  } | null;
  markedById?: string;
  markedBy?: {
    id: string;
    name: string;
    email?: string;
    role?: string;
  } | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudentAttendanceSummary {
  studentId?: string;
  studentName?: string;
  student?: User;
  stats: {
    totalSessions?: number;
    totalClasses?: number;
    presentCount: number;
    absentCount: number;
    lateCount: number;
    excusedCount?: number;
    leaveCount?: number;
    attendanceRate: number;
  };
  recentRecords?: StudentAttendanceHistoryItem[];
  history?: StudentAttendanceHistoryItem[];
  records?: StudentAttendanceHistoryItem[];
  meta?: ApiMeta;
}

/**
 * Teacher Attendance Record
 */
export interface TeacherAttendanceRecord {
  id: string;
  teacherId: string;
  date: string;
  status: TeacherAttendanceStatus;
  checkInTime?: string | null;
  remarks?: string | null;
  markedById?: string;
  markedBy?: User;
  teacher?: User;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * DTO for Bulk Teacher Attendance Submission
 */
export interface BulkTeacherAttendanceItemDto {
  teacherId: string;
  status: TeacherAttendanceStatus;
  remarks?: string;
}

export interface BulkTeacherAttendanceDto {
  date: string;
  records: BulkTeacherAttendanceItemDto[];
}

/**
 * DTO for Teacher Self Check-In
 */
export interface TeacherCheckInDto {
  remarks?: string;
}

/**
 * DTO for Updating Single Teacher Attendance Record
 */
export interface UpdateTeacherAttendanceDto {
  status: TeacherAttendanceStatus;
  remarks?: string;
}

/**
 * Teacher Attendance Summary
 */
export interface TeacherAttendanceSummary {
  teacher: User;
  stats: {
    totalWorkingDays: number;
    presentDays: number;
    absentDays: number;
    lateDays: number;
    leaveDays: number;
    attendanceRate: number;
  };
  history: TeacherAttendanceRecord[];
  meta?: ApiMeta;
}
