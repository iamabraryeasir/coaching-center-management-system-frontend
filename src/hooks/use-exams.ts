import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  bulkSubmitMarks,
  createExam,
  deleteExam,
  getBatchExamResults,
  getExamById,
  getExams,
  getMyExamResults,
  getMySingleExamResult,
  publishExamResults,
  sendReportCardEmail,
  unpublishExamResults,
  updateExam,
  updateStudentMark,
} from "@/api";
import { examKeys } from "@/constants";
import type {
  BulkMarksEntryDto,
  CreateExamDto,
  ExamQueryParams,
  UpdateExamDto,
  UpdateStudentMarkDto,
} from "@/types";

/**
 * 1. Fetch Paginated & Filtered Exams
 */
export function useExams(params?: ExamQueryParams, enabled = true) {
  return useQuery({
    queryKey: examKeys.list(params as Record<string, unknown>),
    queryFn: () => getExams(params),
    enabled,
    placeholderData: (previousData) => previousData,
  });
}

/**
 * 2. Fetch Single Exam Details
 */
export function useExamDetails(examId: string, enabled = true) {
  return useQuery({
    queryKey: examKeys.detail(examId),
    queryFn: () => getExamById(examId),
    enabled: Boolean(examId) && enabled,
    placeholderData: (previousData) => previousData,
  });
}

/**
 * 3. Fetch Batch Exam Results / Merit List
 */
export function useBatchExamResults(examId: string, enabled = true) {
  return useQuery({
    queryKey: examKeys.results(examId),
    queryFn: () => getBatchExamResults(examId),
    enabled: Boolean(examId) && enabled,
    placeholderData: (previousData) => previousData,
  });
}

/**
 * 4. Fetch My Student Report Card (All Exams)
 */
export function useMyExamResults(enabled = true) {
  return useQuery({
    queryKey: examKeys.myResults(),
    queryFn: () => getMyExamResults(),
    enabled,
    placeholderData: (previousData) => previousData,
  });
}

/**
 * 5. Fetch My Single Exam Scorecard
 */
export function useMySingleExamResult(examId: string, enabled = true) {
  return useQuery({
    queryKey: examKeys.myResult(examId),
    queryFn: () => getMySingleExamResult(examId),
    enabled: Boolean(examId) && enabled,
    placeholderData: (previousData) => previousData,
  });
}

/**
 * 6. Mutation: Create Exam
 */
export function useCreateExamMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateExamDto) => createExam(payload),
    onMutate: () => {
      return toast.loading("Scheduling new exam...");
    },
    onSuccess: (response, _vars, toastId) => {
      queryClient.invalidateQueries({ queryKey: examKeys.all });
      toast.success(response.message || "Exam scheduled successfully!", {
        id: toastId,
      });
    },
    onError: (error: Error, _vars, toastId) => {
      toast.error(error.message || "Failed to schedule exam", {
        id: toastId,
      });
    },
  });
}

/**
 * 7. Mutation: Update Exam Metadata
 */
export function useUpdateExamMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      examId,
      payload,
    }: {
      examId: string;
      payload: UpdateExamDto;
    }) => updateExam(examId, payload),
    onMutate: () => {
      return toast.loading("Updating exam details...");
    },
    onSuccess: (response, variables, toastId) => {
      queryClient.invalidateQueries({
        queryKey: examKeys.detail(variables.examId),
      });
      queryClient.invalidateQueries({ queryKey: examKeys.lists() });
      toast.success(response.message || "Exam updated successfully!", {
        id: toastId,
      });
    },
    onError: (error: Error, _vars, toastId) => {
      toast.error(error.message || "Failed to update exam", {
        id: toastId,
      });
    },
  });
}

/**
 * 8. Mutation: Delete Exam
 */
export function useDeleteExamMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (examId: string) => deleteExam(examId),
    onMutate: () => {
      return toast.loading("Deleting exam record...");
    },
    onSuccess: (response, _vars, toastId) => {
      queryClient.invalidateQueries({ queryKey: examKeys.all });
      toast.success(response.message || "Exam deleted successfully!", {
        id: toastId,
      });
    },
    onError: (error: Error, _vars, toastId) => {
      toast.error(error.message || "Failed to delete exam", {
        id: toastId,
      });
    },
  });
}

/**
 * 9. Mutation: Bulk Submit Marks
 */
export function useBulkSubmitMarksMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      examId,
      payload,
    }: {
      examId: string;
      payload: BulkMarksEntryDto;
    }) => bulkSubmitMarks(examId, payload),
    onMutate: () => {
      return toast.loading("Saving exam marks...");
    },
    onSuccess: (response, variables, toastId) => {
      queryClient.invalidateQueries({
        queryKey: examKeys.detail(variables.examId),
      });
      queryClient.invalidateQueries({
        queryKey: examKeys.results(variables.examId),
      });
      queryClient.invalidateQueries({ queryKey: examKeys.lists() });
      toast.success(response.message || "Exam marks saved successfully!", {
        id: toastId,
      });
    },
    onError: (error: Error, _vars, toastId) => {
      toast.error(error.message || "Failed to save exam marks", {
        id: toastId,
      });
    },
  });
}

/**
 * 10. Mutation: Update Single Student Mark
 */
export function useUpdateStudentMarkMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      examId,
      studentId,
      payload,
    }: {
      examId: string;
      studentId: string;
      payload: UpdateStudentMarkDto;
    }) => updateStudentMark(examId, studentId, payload),
    onMutate: () => {
      return toast.loading("Updating student mark...");
    },
    onSuccess: (response, variables, toastId) => {
      queryClient.invalidateQueries({
        queryKey: examKeys.detail(variables.examId),
      });
      queryClient.invalidateQueries({
        queryKey: examKeys.results(variables.examId),
      });
      toast.success(response.message || "Student mark updated successfully!", {
        id: toastId,
      });
    },
    onError: (error: Error, _vars, toastId) => {
      toast.error(error.message || "Failed to update student mark", {
        id: toastId,
      });
    },
  });
}

/**
 * 11. Mutation: Publish Exam Results
 */
export function usePublishExamResultsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (examId: string) => publishExamResults(examId),
    onMutate: () => {
      return toast.loading("Publishing exam results...");
    },
    onSuccess: (response, examId, toastId) => {
      queryClient.invalidateQueries({ queryKey: examKeys.detail(examId) });
      queryClient.invalidateQueries({ queryKey: examKeys.results(examId) });
      queryClient.invalidateQueries({ queryKey: examKeys.lists() });
      toast.success(response.message || "Exam results published to students!", {
        id: toastId,
      });
    },
    onError: (error: Error, _vars, toastId) => {
      toast.error(error.message || "Failed to publish exam results", {
        id: toastId,
      });
    },
  });
}

/**
 * 12. Mutation: Unpublish Exam Results (Admin)
 */
export function useUnpublishExamResultsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (examId: string) => unpublishExamResults(examId),
    onMutate: () => {
      return toast.loading("Reverting results to draft...");
    },
    onSuccess: (response, examId, toastId) => {
      queryClient.invalidateQueries({ queryKey: examKeys.detail(examId) });
      queryClient.invalidateQueries({ queryKey: examKeys.results(examId) });
      queryClient.invalidateQueries({ queryKey: examKeys.lists() });
      toast.success(
        response.message || "Exam results reverted to draft status.",
        {
          id: toastId,
        },
      );
    },
    onError: (error: Error, _vars, toastId) => {
      toast.error(error.message || "Failed to unpublish exam results", {
        id: toastId,
      });
    },
  });
}

/**
 * 13. Mutation: Send Report Card via Email
 */
export function useSendReportCardEmailMutation() {
  return useMutation({
    mutationFn: ({
      examId,
      studentId,
    }: {
      examId: string;
      studentId: string;
    }) => sendReportCardEmail(examId, studentId),
    onMutate: () => {
      return toast.loading("Dispatching report card email...");
    },
    onSuccess: (response, _vars, toastId) => {
      toast.success(
        response.message || "Report card PDF sent to student's email!",
        {
          id: toastId,
        },
      );
    },
    onError: (error: Error, _vars, toastId) => {
      toast.error(error.message || "Failed to send report card email", {
        id: toastId,
      });
    },
  });
}
