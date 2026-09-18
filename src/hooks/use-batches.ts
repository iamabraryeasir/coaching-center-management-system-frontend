import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  approveEnrollment,
  createBatch,
  deleteBatch,
  directEnrollStudent,
  getBatchById,
  getBatches,
  getBatchStudents,
  getPendingEnrollments,
  rejectEnrollment,
  removeStudentFromBatch,
  updateBatch,
} from "@/api";
import { batchKeys, studentKeys } from "@/constants";
import type {
  BatchQueryParams,
  CreateBatchDto,
  DirectEnrollDto,
  QueryParams,
  UpdateBatchDto,
} from "@/types";

/**
 * Fetch paginated batches
 */
export function useBatches(params?: BatchQueryParams) {
  return useQuery({
    queryKey: batchKeys.list(params as Record<string, unknown>),
    queryFn: () => getBatches(params),
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Fetch single batch by ID
 */
export function useBatch(batchId: string) {
  return useQuery({
    queryKey: batchKeys.detail(batchId),
    queryFn: () => getBatchById(batchId),
    enabled: Boolean(batchId),
  });
}

/**
 * Mutation: Create Batch
 */
export function useCreateBatchMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBatchDto) => createBatch(payload),
    onMutate: () => {
      return toast.loading("Creating new batch...");
    },
    onSuccess: (response, _vars, toastId) => {
      queryClient.invalidateQueries({ queryKey: batchKeys.all });
      toast.success(response.message || "Batch created successfully!", {
        id: toastId,
      });
    },
    onError: (error: Error, _vars, toastId) => {
      toast.error(error.message || "Failed to create batch", { id: toastId });
    },
  });
}

/**
 * Mutation: Update Batch
 */
export function useUpdateBatchMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      batchId,
      payload,
    }: {
      batchId: string;
      payload: UpdateBatchDto;
    }) => updateBatch(batchId, payload),
    onMutate: () => {
      return toast.loading("Updating batch details...");
    },
    onSuccess: (response, variables, toastId) => {
      queryClient.invalidateQueries({ queryKey: batchKeys.all });
      queryClient.invalidateQueries({
        queryKey: batchKeys.detail(variables.batchId),
      });
      toast.success(response.message || "Batch updated successfully!", {
        id: toastId,
      });
    },
    onError: (error: Error, _vars, toastId) => {
      toast.error(error.message || "Failed to update batch", { id: toastId });
    },
  });
}

/**
 * Mutation: Delete Batch (Soft Delete)
 */
export function useDeleteBatchMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (batchId: string) => deleteBatch(batchId),
    onMutate: () => {
      return toast.loading("Deleting batch...");
    },
    onSuccess: (response, _vars, toastId) => {
      queryClient.invalidateQueries({ queryKey: batchKeys.all });
      toast.success(response.message || "Batch deleted successfully!", {
        id: toastId,
      });
    },
    onError: (error: Error, _vars, toastId) => {
      toast.error(error.message || "Failed to delete batch", { id: toastId });
    },
  });
}

/**
 * Fetch pending enrollment requests across all batches
 */
export function usePendingEnrollments(params?: QueryParams) {
  return useQuery({
    queryKey: batchKeys.pendingEnrollments(params as Record<string, unknown>),
    queryFn: () => getPendingEnrollments(params),
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Mutation: Approve Student Enrollment
 */
export function useApproveEnrollmentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (enrollmentId: string) => approveEnrollment(enrollmentId),
    onMutate: () => {
      return toast.loading("Approving student enrollment...");
    },
    onSuccess: (response, _vars, toastId) => {
      queryClient.invalidateQueries({ queryKey: batchKeys.all });
      queryClient.invalidateQueries({ queryKey: studentKeys.all });
      toast.success(response.message || "Enrollment approved!", {
        id: toastId,
      });
    },
    onError: (error: Error, _vars, toastId) => {
      toast.error(error.message || "Failed to approve enrollment", {
        id: toastId,
      });
    },
  });
}

/**
 * Mutation: Reject Student Enrollment
 */
export function useRejectEnrollmentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      enrollmentId,
      reason,
    }: {
      enrollmentId: string;
      reason?: string;
    }) => rejectEnrollment(enrollmentId, reason),
    onMutate: () => {
      return toast.loading("Rejecting enrollment application...");
    },
    onSuccess: (response, _vars, toastId) => {
      queryClient.invalidateQueries({ queryKey: batchKeys.all });
      toast.success(response.message || "Enrollment rejected", {
        id: toastId,
      });
    },
    onError: (error: Error, _vars, toastId) => {
      toast.error(error.message || "Failed to reject enrollment", {
        id: toastId,
      });
    },
  });
}

/**
 * Fetch students enrolled in a specific batch
 */
export function useBatchStudents(
  batchId: string,
  params?: QueryParams & { status?: string },
) {
  return useQuery({
    queryKey: batchKeys.roster(batchId, params as Record<string, unknown>),
    queryFn: () => getBatchStudents(batchId, params),
    enabled: Boolean(batchId),
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Mutation: Directly enroll student into batch
 */
export function useDirectEnrollStudentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      batchId,
      payload,
      studentId,
    }: {
      batchId: string;
      payload?: DirectEnrollDto;
      studentId?: string;
    }) => {
      const resolvedPayload: DirectEnrollDto = payload || {
        studentId: studentId || "",
      };
      return directEnrollStudent(batchId, resolvedPayload);
    },
    onMutate: () => {
      return toast.loading("Enrolling student into batch...");
    },
    onSuccess: (response, variables, toastId) => {
      queryClient.invalidateQueries({ queryKey: batchKeys.all });
      queryClient.invalidateQueries({
        queryKey: batchKeys.roster(variables.batchId),
      });
      toast.success(
        response.message || "Student enrolled into batch successfully!",
        {
          id: toastId,
        },
      );
    },
    onError: (error: Error, _vars, toastId) => {
      toast.error(error.message || "Failed to enroll student", { id: toastId });
    },
  });
}

/**
 * Mutation: Remove/Drop student from batch
 */
export function useRemoveStudentFromBatchMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ batchId, userId }: { batchId: string; userId: string }) =>
      removeStudentFromBatch(batchId, userId),
    onMutate: () => {
      return toast.loading("Removing student from batch...");
    },
    onSuccess: (response, variables, toastId) => {
      queryClient.invalidateQueries({ queryKey: batchKeys.all });
      queryClient.invalidateQueries({
        queryKey: batchKeys.roster(variables.batchId),
      });
      toast.success(response.message || "Student removed from batch", {
        id: toastId,
      });
    },
    onError: (error: Error, _vars, toastId) => {
      toast.error(error.message || "Failed to remove student", { id: toastId });
    },
  });
}
