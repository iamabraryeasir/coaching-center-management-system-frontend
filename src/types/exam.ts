import type { ApiMeta } from "./api-type";
import type { User } from "./auth-type";
import type { Batch } from "./batch-type";

export type ExamStatus = "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";
export type ExamResultStatus = "DRAFT" | "PUBLISHED";

export interface ExamStats {
  highestMark?: number;
  lowestMark?: number;
  averageMark?: number;
  totalStudents?: number;
  totalExaminees?: number;
  passCount?: number;
  failCount?: number;
  passRate?: number;
}

export interface Exam {
  id: string;
  batchId: string;
  title: string;
  description?: string | null;
  totalMarks: number;
  passMarks: number;
  examDate: string;
  status: ExamStatus;
  resultStatus?: ExamResultStatus;
  createdById?: string;
  createdBy?: User;
  batch?: Batch;
  stats?: ExamStats;
  createdAt?: string;
  updatedAt?: string;
}

export interface ExamMarkRecord {
  id: string;
  examId: string;
  studentId: string;
  marksObtained: number;
  letterGrade?: string;
  gpa?: number;
  isPassed?: boolean;
  rank?: number;
  remarks?: string | null;
  student?: User | null;
  batch?: Batch | null;
  exam?: Exam | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface BatchMeritList {
  exam: Exam;
  results: ExamMarkRecord[];
  stats: ExamStats;
  meta?: ApiMeta;
}

export interface StudentExamResultItem {
  id: string;
  examId: string;
  examTitle: string;
  examDate: string;
  batchName: string;
  totalMarks: number;
  passMarks: number;
  marksObtained: number;
  letterGrade: string;
  gpa: number;
  isPassed: boolean;
  rank?: number;
  remarks?: string | null;
  highestMark?: number;
  averageMark?: number;
}

export interface StudentReportCard {
  student: User;
  results: StudentExamResultItem[];
  cumulativeStats: {
    totalExams: number;
    gpaAverage: number;
    overallPassRate: number;
  };
  meta?: ApiMeta;
}

/**
 * Request DTOs
 */
export interface CreateExamDto {
  batchId: string;
  title: string;
  description?: string;
  totalMarks: number;
  passMarks: number;
  examDate: string;
  status?: ExamStatus;
}

export interface UpdateExamDto {
  title?: string;
  description?: string;
  totalMarks?: number;
  passMarks?: number;
  examDate?: string;
  status?: ExamStatus;
}

export interface StudentMarkEntryItem {
  studentId: string;
  marksObtained: number;
  remarks?: string;
}

export interface BulkMarksEntryDto {
  records: StudentMarkEntryItem[];
}

export interface UpdateStudentMarkDto {
  marksObtained: number;
  remarks?: string;
}

export interface ExamQueryParams {
  batchId?: string;
  status?: ExamStatus;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
