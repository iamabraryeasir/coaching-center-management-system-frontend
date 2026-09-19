import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getBatchAttendanceSheet,
  getMyStudentAttendanceSummary,
  getMyTeacherAttendanceSummary,
  getStudentAttendanceHistory,
  getTeacherAttendanceSheet,
  getTeacherAttendanceSummary,
  markBatchAttendance,
  markBulkTeacherAttendance,
  teacherSelfCheckIn,
  updateAttendanceRecord,
  updateTeacherAttendanceRecord,
} from "@/api";
import { attendanceKeys, batchKeys } from "@/constants";
import type {
  BulkStudentAttendanceDto,
  BulkTeacherAttendanceDto,
  TeacherCheckInDto,
  UpdateAttendanceDto,
  UpdateTeacherAttendanceDto,
} from "@/types";

/**
 * Fetch Batch Attendance Sheet for a specific batch and date
 */
export function useBatchAttendanceSheet(
  batchId: string,
  date?: string,
  enabled = true,
) {
  return useQuery({
    queryKey: attendanceKeys.batchSheet(batchId, date),
    queryFn: () => getBatchAttendanceSheet(batchId, date),
    enabled: Boolean(batchId) && enabled,
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Mutation: Mark Bulk Daily Attendance for a Batch
 */
export function useMarkBatchAttendanceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      batchId,
      payload,
    }: {
      batchId: string;
      payload: BulkStudentAttendanceDto;
    }) => markBatchAttendance(batchId, payload),
    onMutate: () => {
      return toast.loading("Saving batch attendance...");
    },
    onSuccess: (response, variables, toastId) => {
      queryClient.invalidateQueries({
        queryKey: attendanceKeys.batchSheet(
          variables.batchId,
          variables.payload.date,
        ),
      });
      queryClient.invalidateQueries({ queryKey: attendanceKeys.all });
      queryClient.invalidateQueries({ queryKey: batchKeys.all });
      toast.success(
        response.message || "Batch attendance recorded successfully!",
        {
          id: toastId,
        },
      );
    },
    onError: (error: Error, _vars, toastId) => {
      toast.error(error.message || "Failed to record batch attendance", {
        id: toastId,
      });
    },
  });
}

/**
 * Mutation: Update Single Attendance Record
 */
export function useUpdateAttendanceRecordMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      attendanceId,
      payload,
    }: {
      attendanceId: string;
      payload: UpdateAttendanceDto;
    }) => updateAttendanceRecord(attendanceId, payload),
    onMutate: () => {
      return toast.loading("Updating attendance record...");
    },
    onSuccess: (response, _vars, toastId) => {
      queryClient.invalidateQueries({ queryKey: attendanceKeys.all });
      toast.success(
        response.message || "Attendance record updated successfully!",
        {
          id: toastId,
        },
      );
    },
    onError: (error: Error, _vars, toastId) => {
      toast.error(error.message || "Failed to update attendance record", {
        id: toastId,
      });
    },
  });
}

/**
 * Fetch Student Attendance History & Stats
 */
export function useStudentAttendanceHistory(
  studentUserId: string,
  params?: { page?: number; limit?: number },
  enabled = true,
) {
  return useQuery({
    queryKey: attendanceKeys.studentHistory(studentUserId, params),
    queryFn: () => getStudentAttendanceHistory(studentUserId, params),
    enabled: Boolean(studentUserId) && enabled,
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Fetch My Student Attendance Summary (for Student role)
 */
export function useMyStudentAttendanceSummary(
  params?: { page?: number; limit?: number },
  enabled = true,
) {
  return useQuery({
    queryKey: attendanceKeys.mySummary(params),
    queryFn: () => getMyStudentAttendanceSummary(params),
    enabled,
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Fetch Teacher Daily Attendance Sheet (Admin)
 */
export function useTeacherAttendanceSheet(
  date?: string,
  params?: { page?: number; limit?: number },
  enabled = true,
) {
  return useQuery({
    queryKey: attendanceKeys.teacherSheet(date, params),
    queryFn: () => getTeacherAttendanceSheet(date, params),
    enabled,
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Mutation: Teacher Self Check-In
 */
export function useTeacherCheckInMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload?: TeacherCheckInDto) => teacherSelfCheckIn(payload),
    onMutate: () => {
      return toast.loading("Checking in for today...");
    },
    onSuccess: (response, _vars, toastId) => {
      queryClient.invalidateQueries({ queryKey: attendanceKeys.all });
      toast.success(
        response.message || "Checked in successfully! Have a great day.",
        {
          id: toastId,
        },
      );
    },
    onError: (error: Error, _vars, toastId) => {
      toast.error(error.message || "Failed to check in", {
        id: toastId,
      });
    },
  });
}

/**
 * Mutation: Mark Bulk Teacher Attendance (Admin)
 */
export function useMarkBulkTeacherAttendanceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: BulkTeacherAttendanceDto) =>
      markBulkTeacherAttendance(payload),
    onMutate: () => {
      return toast.loading("Saving teacher attendance...");
    },
    onSuccess: (response, variables, toastId) => {
      queryClient.invalidateQueries({
        queryKey: attendanceKeys.teacherSheet(variables.date),
      });
      queryClient.invalidateQueries({ queryKey: attendanceKeys.all });
      toast.success(
        response.message || "Teacher attendance recorded successfully!",
        {
          id: toastId,
        },
      );
    },
    onError: (error: Error, _vars, toastId) => {
      toast.error(error.message || "Failed to record teacher attendance", {
        id: toastId,
      });
    },
  });
}

/**
 * Mutation: Update Single Teacher Attendance Record
 */
export function useUpdateTeacherAttendanceRecordMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      teacherAttendanceId,
      payload,
    }: {
      teacherAttendanceId: string;
      payload: UpdateTeacherAttendanceDto;
    }) => updateTeacherAttendanceRecord(teacherAttendanceId, payload),
    onMutate: () => {
      return toast.loading("Updating teacher attendance record...");
    },
    onSuccess: (response, _vars, toastId) => {
      queryClient.invalidateQueries({ queryKey: attendanceKeys.all });
      toast.success(
        response.message || "Teacher record updated successfully!",
        {
          id: toastId,
        },
      );
    },
    onError: (error: Error, _vars, toastId) => {
      toast.error(
        error.message || "Failed to update teacher attendance record",
        {
          id: toastId,
        },
      );
    },
  });
}

/**
 * Fetch My Teacher Attendance Summary
 */
export function useMyTeacherAttendanceSummary(
  params?: { page?: number; limit?: number },
  enabled = true,
) {
  return useQuery({
    queryKey: attendanceKeys.myTeacherSummary(params),
    queryFn: () => getMyTeacherAttendanceSummary(params),
    enabled,
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Fetch Specific Teacher Attendance Summary (Admin)
 */
export function useTeacherAttendanceSummary(
  teacherUserId: string,
  params?: { page?: number; limit?: number },
  enabled = true,
) {
  return useQuery({
    queryKey: attendanceKeys.teacherSummary(teacherUserId, params),
    queryFn: () => getTeacherAttendanceSummary(teacherUserId, params),
    enabled: Boolean(teacherUserId) && enabled,
    placeholderData: (previousData) => previousData,
  });
}
