import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  approvePendingStudent,
  deleteStudent,
  getPendingStudents,
  getStudentById,
  getStudents,
  registerStudent,
  rejectPendingStudent,
  updateStudentStatus,
} from "@/api";
import { studentKeys, userKeys } from "@/constants";
import type {
  QueryParams,
  RegisterStudentDto,
  StudentQueryParams,
  UserStatus,
} from "@/types";

/**
 * Fetch paginated active students
 */
export function useStudents(params?: StudentQueryParams) {
  return useQuery({
    queryKey: studentKeys.list(params as Record<string, unknown>),
    queryFn: () => getStudents(params),
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Fetch single student details
 */
export function useStudent(userId: string) {
  return useQuery({
    queryKey: studentKeys.detail(userId),
    queryFn: () => getStudentById(userId),
    enabled: Boolean(userId),
  });
}

/**
 * Fetch pending student applications awaiting approval
 */
export function usePendingStudents(params?: QueryParams) {
  return useQuery({
    queryKey: studentKeys.pendingList(params as Record<string, unknown>),
    queryFn: () => getPendingStudents(params),
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Mutation: Direct student registration
 */
export function useRegisterStudentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RegisterStudentDto) => registerStudent(payload),
    onMutate: () => {
      return toast.loading("Admitting student...");
    },
    onSuccess: (response, _vars, toastId) => {
      queryClient.invalidateQueries({ queryKey: studentKeys.all });
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast.success(response.message || "Student admitted successfully!", {
        id: toastId,
      });
    },
    onError: (error: Error, _vars, toastId) => {
      toast.error(error.message || "Failed to admit student", { id: toastId });
    },
  });
}

/**
 * Mutation: Update student account status (ACTIVE, INACTIVE, BLOCKED)
 */
export function useUpdateStudentStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: UserStatus }) =>
      updateStudentStatus(userId, status),
    onMutate: () => {
      return toast.loading("Updating student status...");
    },
    onSuccess: (response, _vars, toastId) => {
      queryClient.invalidateQueries({ queryKey: studentKeys.all });
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast.success(response.message || "Status updated successfully!", {
        id: toastId,
      });
    },
    onError: (error: Error, _vars, toastId) => {
      toast.error(error.message || "Failed to update status", { id: toastId });
    },
  });
}

/**
 * Mutation: Delete student user
 */
export function useDeleteStudentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => deleteStudent(userId),
    onMutate: () => {
      return toast.loading("Deleting student record...");
    },
    onSuccess: (response, _vars, toastId) => {
      queryClient.invalidateQueries({ queryKey: studentKeys.all });
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast.success(response.message || "Student deleted successfully!", {
        id: toastId,
      });
    },
    onError: (error: Error, _vars, toastId) => {
      toast.error(error.message || "Failed to delete student", { id: toastId });
    },
  });
}

/**
 * Mutation: Approve online student application
 */
export function useApproveStudentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pendingStudentId: string) =>
      approvePendingStudent(pendingStudentId),
    onMutate: () => {
      return toast.loading("Approving student application...");
    },
    onSuccess: (response, _vars, toastId) => {
      queryClient.invalidateQueries({ queryKey: studentKeys.all });
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast.success(response.message || "Application approved!", {
        id: toastId,
      });
    },
    onError: (error: Error, _vars, toastId) => {
      toast.error(error.message || "Failed to approve application", {
        id: toastId,
      });
    },
  });
}

/**
 * Mutation: Reject online student application
 */
export function useRejectStudentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pendingStudentId,
      id,
      reason,
    }: {
      pendingStudentId?: string;
      id?: string;
      reason?: string;
    }) => {
      const targetId = pendingStudentId || id;
      if (!targetId) {
        throw new Error("Student ID is required to reject application");
      }
      return rejectPendingStudent(targetId, reason);
    },
    onMutate: () => {
      return toast.loading("Rejecting application...");
    },
    onSuccess: (response, _vars, toastId) => {
      queryClient.invalidateQueries({ queryKey: studentKeys.all });
      toast.success(response.message || "Application rejected", {
        id: toastId,
      });
    },
    onError: (error: Error, _vars, toastId) => {
      toast.error(error.message || "Failed to reject application", {
        id: toastId,
      });
    },
  });
}

export {
  useApproveStudentMutation as useApprovePendingStudentMutation,
  useRejectStudentMutation as useRejectPendingStudentMutation,
};
