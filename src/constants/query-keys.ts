/**
 * Centralized TanStack Query Key Factory
 *
 * Implements hierarchical, tag-based query keys for deterministic caching,
 * granular cache invalidation, and optimistic state synchronization across features.
 */
export const authKeys = {
  all: ["auth"] as const,
  currentUser: () => [...authKeys.all, "currentUser"] as const,
  session: () => [...authKeys.all, "session"] as const,
  profile: () => [...authKeys.all, "profile"] as const,
} as const;

export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (params?: Record<string, unknown>) =>
    [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
} as const;

export const studentKeys = {
  all: ["students"] as const,
  lists: () => [...studentKeys.all, "list"] as const,
  list: (params?: Record<string, unknown>) =>
    [...studentKeys.lists(), params] as const,
  details: () => [...studentKeys.all, "detail"] as const,
  detail: (id: string) => [...studentKeys.details(), id] as const,
  pendingLists: () => [...studentKeys.all, "pending"] as const,
  pendingList: (params?: Record<string, unknown>) =>
    [...studentKeys.pendingLists(), params] as const,
} as const;

export const teacherKeys = {
  all: ["teachers"] as const,
  lists: () => [...teacherKeys.all, "list"] as const,
  list: (params?: Record<string, unknown>) =>
    [...teacherKeys.lists(), params] as const,
  details: () => [...teacherKeys.all, "detail"] as const,
  detail: (id: string) => [...teacherKeys.details(), id] as const,
  schedule: (id: string) => [...teacherKeys.all, "schedule", id] as const,
} as const;

export const batchKeys = {
  all: ["batches"] as const,
  lists: () => [...batchKeys.all, "list"] as const,
  list: (params?: Record<string, unknown>) =>
    [...batchKeys.lists(), params] as const,
  details: () => [...batchKeys.all, "detail"] as const,
  detail: (id: string) => [...batchKeys.details(), id] as const,
  pendingEnrollments: (params?: Record<string, unknown>) =>
    [...batchKeys.all, "pending-enrollments", params] as const,
  roster: (batchId: string, params?: Record<string, unknown>) =>
    [...batchKeys.all, "roster", batchId, params] as const,
} as const;

export const routineKeys = {
  all: ["routines"] as const,
  lists: () => [...routineKeys.all, "list"] as const,
  list: (params?: Record<string, unknown>) =>
    [...routineKeys.lists(), params] as const,
  details: () => [...routineKeys.all, "detail"] as const,
  detail: (id: string) => [...routineKeys.details(), id] as const,
  batch: (batchId: string) => [...routineKeys.all, "batch", batchId] as const,
  teacher: (teacherUserId: string) =>
    [...routineKeys.all, "teacher", teacherUserId] as const,
  myTeacherSchedule: () => [...routineKeys.all, "my-teacher-schedule"] as const,
  myStudentSchedule: () => [...routineKeys.all, "my-student-schedule"] as const,
} as const;

export const attendanceKeys = {
  all: ["attendance"] as const,
  lists: () => [...attendanceKeys.all, "list"] as const,
  list: (params?: Record<string, unknown>) =>
    [...attendanceKeys.lists(), params] as const,
  summary: (params?: Record<string, unknown>) =>
    [...attendanceKeys.all, "summary", params] as const,
  batchSheet: (batchId: string, date?: string) =>
    [...attendanceKeys.all, "batch-sheet", batchId, date] as const,
  studentHistory: (studentUserId: string, params?: Record<string, unknown>) =>
    [...attendanceKeys.all, "student-history", studentUserId, params] as const,
  mySummary: (params?: Record<string, unknown>) =>
    [...attendanceKeys.all, "my-summary", params] as const,
  teacherSheet: (date?: string, params?: Record<string, unknown>) =>
    [...attendanceKeys.all, "teacher-sheet", date, params] as const,
  teacherSummary: (teacherUserId: string, params?: Record<string, unknown>) =>
    [...attendanceKeys.all, "teacher-summary", teacherUserId, params] as const,
  myTeacherSummary: (params?: Record<string, unknown>) =>
    [...attendanceKeys.all, "my-teacher-summary", params] as const,
} as const;

export const examKeys = {
  all: ["exams"] as const,
  lists: () => [...examKeys.all, "list"] as const,
  list: (params?: Record<string, unknown>) =>
    [...examKeys.lists(), params] as const,
  details: () => [...examKeys.all, "detail"] as const,
  detail: (id: string) => [...examKeys.details(), id] as const,
  results: (examId: string) => [...examKeys.all, "results", examId] as const,
  myResults: () => [...examKeys.all, "my-results"] as const,
  myResult: (examId: string) => [...examKeys.all, "my-result", examId] as const,
} as const;

export const paymentKeys = {
  all: ["payments"] as const,
  lists: () => [...paymentKeys.all, "list"] as const,
  list: (params?: Record<string, unknown>) =>
    [...paymentKeys.lists(), params] as const,
  details: () => [...paymentKeys.all, "detail"] as const,
  detail: (id: string) => [...paymentKeys.details(), id] as const,
  summary: () => [...paymentKeys.all, "summary"] as const,
} as const;
