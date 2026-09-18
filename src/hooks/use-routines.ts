import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  createRoutineSlot,
  deleteRoutineSlot,
  getBatchTimetable,
  getMyStudentSchedule,
  getMyTeacherSchedule,
  getRoutineById,
  getRoutines,
  getTeacherSchedule,
  updateRoutineSlot,
} from "@/api";
import { batchKeys, routineKeys } from "@/constants";
import type {
  CreateRoutineSlotDto,
  RoutineQueryParams,
  UpdateRoutineSlotDto,
} from "@/types";

/**
 * Fetch paginated routine slots with QueryBuilder filters
 */
export function useRoutines(params?: RoutineQueryParams, enabled = true) {
  return useQuery({
    queryKey: routineKeys.list(params as Record<string, unknown>),
    queryFn: () => getRoutines(params),
    placeholderData: (previousData) => previousData,
    enabled,
  });
}

/**
 * Fetch a single routine slot by ID
 */
export function useRoutine(routineId: string) {
  return useQuery({
    queryKey: routineKeys.detail(routineId),
    queryFn: () => getRoutineById(routineId),
    enabled: Boolean(routineId),
  });
}

/**
 * Fetch complete weekly timetable for a specific batch (Saturday -> Friday)
 */
export function useBatchTimetable(batchId: string, enabled = true) {
  return useQuery({
    queryKey: routineKeys.batch(batchId),
    queryFn: () => getBatchTimetable(batchId),
    enabled: Boolean(batchId) && enabled,
  });
}

/**
 * Fetch complete weekly teaching schedule for a specific teacher
 */
export function useTeacherSchedule(teacherUserId: string, enabled = true) {
  return useQuery({
    queryKey: routineKeys.teacher(teacherUserId),
    queryFn: () => getTeacherSchedule(teacherUserId),
    enabled: Boolean(teacherUserId) && enabled,
  });
}

/**
 * Fetch personal weekly schedule for authenticated teacher
 */
export function useMyTeacherSchedule() {
  return useQuery({
    queryKey: routineKeys.myTeacherSchedule(),
    queryFn: () => getMyTeacherSchedule(),
  });
}

/**
 * Fetch personal weekly timetable for authenticated student
 */
export function useMyStudentSchedule() {
  return useQuery({
    queryKey: routineKeys.myStudentSchedule(),
    queryFn: () => getMyStudentSchedule(),
  });
}

/**
 * Mutation: Schedule a new routine slot
 */
export function useCreateRoutineMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateRoutineSlotDto) => createRoutineSlot(payload),
    onMutate: () => {
      return toast.loading("Scheduling routine slot...");
    },
    onSuccess: (response, variables, toastId) => {
      queryClient.invalidateQueries({ queryKey: routineKeys.all });
      queryClient.invalidateQueries({ queryKey: batchKeys.all });
      if (variables.batchId) {
        queryClient.invalidateQueries({
          queryKey: routineKeys.batch(variables.batchId),
        });
      }
      if (variables.teacherId) {
        queryClient.invalidateQueries({
          queryKey: routineKeys.teacher(variables.teacherId),
        });
      }
      toast.success(
        response.message || "Class routine scheduled successfully!",
        {
          id: toastId,
        },
      );
    },
    onError: (error: Error, _vars, toastId) => {
      toast.error(error.message || "Failed to schedule routine slot", {
        id: toastId,
      });
    },
  });
}

/**
 * Mutation: Update a routine slot
 */
export function useUpdateRoutineMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      routineId,
      payload,
    }: {
      routineId: string;
      payload: UpdateRoutineSlotDto;
    }) => updateRoutineSlot(routineId, payload),
    onMutate: () => {
      return toast.loading("Updating routine slot...");
    },
    onSuccess: (response, variables, toastId) => {
      queryClient.invalidateQueries({ queryKey: routineKeys.all });
      queryClient.invalidateQueries({
        queryKey: routineKeys.detail(variables.routineId),
      });
      toast.success(response.message || "Routine slot updated successfully!", {
        id: toastId,
      });
    },
    onError: (error: Error, _vars, toastId) => {
      toast.error(error.message || "Failed to update routine slot", {
        id: toastId,
      });
    },
  });
}

/**
 * Mutation: Delete a routine slot
 */
export function useDeleteRoutineMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (routineId: string) => deleteRoutineSlot(routineId),
    onMutate: () => {
      return toast.loading("Deleting routine slot...");
    },
    onSuccess: (response, _vars, toastId) => {
      queryClient.invalidateQueries({ queryKey: routineKeys.all });
      toast.success(response.message || "Routine slot removed successfully!", {
        id: toastId,
      });
    },
    onError: (error: Error, _vars, toastId) => {
      toast.error(error.message || "Failed to delete routine slot", {
        id: toastId,
      });
    },
  });
}
