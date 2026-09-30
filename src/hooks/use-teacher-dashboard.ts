export { useTeacherDashboard } from "./use-dashboard";

import { useSuspenseQuery } from "@tanstack/react-query";
import {
  getBatches,
  getExams,
  getMyTeacherAttendanceSummary,
  getMyTeacherSchedule,
} from "@/api";
import {
  attendanceKeys,
  batchKeys,
  examKeys,
  routineKeys,
} from "@/constants/query-keys";

/**
 * Fetches batches assigned to or accessible by the teacher.
 * Uses Suspense — wrap with <Suspense fallback={...}>.
 */
export function useTeacherDashboardBatches() {
  return useSuspenseQuery({
    queryKey: batchKeys.list({ limit: 100 }),
    queryFn: async () => {
      try {
        const res = await getBatches({ limit: 100 });
        return res.data || [];
      } catch {
        return [];
      }
    },
    staleTime: 60_000,
  });
}

/**
 * Fetches authenticated teacher's weekly class routine schedule.
 * Uses Suspense — wrap with <Suspense fallback={...}>.
 */
export function useTeacherDashboardSchedule() {
  return useSuspenseQuery({
    queryKey: routineKeys.myTeacherSchedule(),
    queryFn: async () => {
      try {
        const res = await getMyTeacherSchedule();
        return res.data || null;
      } catch {
        return null;
      }
    },
    staleTime: 60_000,
  });
}

/**
 * Fetches exams list for teacher's batches.
 * Uses Suspense — wrap with <Suspense fallback={...}>.
 */
export function useTeacherDashboardExams() {
  return useSuspenseQuery({
    queryKey: examKeys.list({ limit: 100 }),
    queryFn: async () => {
      try {
        const res = await getExams({ limit: 100 });
        return res.data || [];
      } catch {
        return [];
      }
    },
    staleTime: 60_000,
  });
}

/**
 * Fetches authenticated teacher's personal campus attendance summary.
 * Uses Suspense — wrap with <Suspense fallback={...}>.
 */
export function useTeacherDashboardAttendanceSummary() {
  return useSuspenseQuery({
    queryKey: attendanceKeys.myTeacherSummary(),
    queryFn: async () => {
      try {
        const res = await getMyTeacherAttendanceSummary();
        return res.data || null;
      } catch {
        return null;
      }
    },
    staleTime: 60_000,
  });
}
