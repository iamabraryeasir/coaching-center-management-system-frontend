import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  deleteTeacher,
  getTeacherById,
  getTeachers,
  registerTeacher,
  updateTeacher,
  updateTeacherPermissions,
  updateTeacherStatus,
} from "@/api";
import { authKeys, teacherKeys, userKeys } from "@/constants";
import type {
  RegisterTeacherDto,
  TeacherPermission,
  TeacherQueryParams,
  UpdateTeacherDto,
  UserStatus,
} from "@/types";

/**
 * Fetch paginated faculty teachers with filters and search
 */
export function useTeachers(params?: TeacherQueryParams) {
  return useQuery({
    queryKey: teacherKeys.list(params as Record<string, unknown>),
    queryFn: () => getTeachers(params),
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Fetch detailed profile of a single teacher
 */
export function useTeacher(userId: string) {
  return useQuery({
    queryKey: teacherKeys.detail(userId),
    queryFn: () => getTeacherById(userId),
    enabled: Boolean(userId),
  });
}

/**
 * Mutation: Register new faculty teacher
 */
export function useRegisterTeacherMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RegisterTeacherDto) => registerTeacher(payload),
    onMutate: () => {
      return toast.loading("Onboarding faculty member...");
    },
    onSuccess: (response, _vars, toastId) => {
      queryClient.invalidateQueries({ queryKey: teacherKeys.all });
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast.success(
        response.message || "Faculty member registered successfully!",
        {
          id: toastId,
        },
      );
    },
    onError: (error: Error, _vars, toastId) => {
      toast.error(error.message || "Failed to register teacher", {
        id: toastId,
      });
    },
  });
}

/**
 * Mutation: Update faculty member profile details
 */
export function useUpdateTeacherMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      payload,
    }: {
      userId: string;
      payload: UpdateTeacherDto;
    }) => updateTeacher(userId, payload),
    onMutate: () => {
      return toast.loading("Updating faculty details...");
    },
    onSuccess: (response, variables, toastId) => {
      queryClient.invalidateQueries({ queryKey: teacherKeys.all });
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      queryClient.invalidateQueries({
        queryKey: teacherKeys.detail(variables.userId),
      });
      toast.success(
        response.message || "Faculty details updated successfully!",
        {
          id: toastId,
        },
      );
    },
    onError: (error: Error, _vars, toastId) => {
      toast.error(error.message || "Failed to update faculty details", {
        id: toastId,
      });
    },
  });
}

/**
 * Mutation: Update teacher operational status (ACTIVE, INACTIVE, BLOCKED)
 */
export function useUpdateTeacherStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: UserStatus }) =>
      updateTeacherStatus(userId, status),
    onMutate: ({ status }) => {
      const action =
        status === "ACTIVE"
          ? "Activating"
          : status === "BLOCKED"
            ? "Blocking"
            : "Deactivating";
      return toast.loading(`${action} faculty account...`);
    },
    onSuccess: (response, variables, toastId) => {
      queryClient.invalidateQueries({ queryKey: teacherKeys.all });
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      queryClient.invalidateQueries({
        queryKey: teacherKeys.detail(variables.userId),
      });
      toast.success(
        response.message || `Account status changed to ${variables.status}`,
        {
          id: toastId,
        },
      );
    },
    onError: (error: Error, _vars, toastId) => {
      toast.error(error.message || "Failed to update teacher status", {
        id: toastId,
      });
    },
  });
}

/**
 * Mutation: Update delegated administrative permissions for a teacher
 */
export function useUpdateTeacherPermissionsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      permissions,
    }: {
      userId: string;
      permissions: TeacherPermission[];
    }) => updateTeacherPermissions(userId, permissions),
    onMutate: () => {
      return toast.loading("Updating teacher permissions...");
    },
    onSuccess: (response, variables, toastId) => {
      queryClient.invalidateQueries({ queryKey: teacherKeys.all });
      queryClient.invalidateQueries({
        queryKey: teacherKeys.detail(variables.userId),
      });
      queryClient.invalidateQueries({ queryKey: authKeys.currentUser() });
      toast.success(
        response.message || "Teacher permissions updated successfully!",
        {
          id: toastId,
        },
      );
    },
    onError: (error: Error, _vars, toastId) => {
      toast.error(error.message || "Failed to update permissions", {
        id: toastId,
      });
    },
  });
}

/**
 * Mutation: Soft-delete / archive teacher account
 */
export function useDeleteTeacherMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => deleteTeacher(userId),
    onMutate: () => {
      return toast.loading("Archiving faculty account...");
    },
    onSuccess: (response, _vars, toastId) => {
      queryClient.invalidateQueries({ queryKey: teacherKeys.all });
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast.success(
        response.message || "Faculty account archived successfully!",
        {
          id: toastId,
        },
      );
    },
    onError: (error: Error, _vars, toastId) => {
      toast.error(error.message || "Failed to archive faculty account", {
        id: toastId,
      });
    },
  });
}
