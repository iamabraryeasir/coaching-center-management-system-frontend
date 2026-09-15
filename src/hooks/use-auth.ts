"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { getCurrentUser, logoutAllDevices, logoutUser } from "@/api/auth";
import { authKeys } from "@/constants/query-keys";
import type { TeacherPermission, User } from "@/types";

/**
 * Reusable Production-Grade Auth Hook
 *
 * Provides reactive authentication state, role-based helpers, permission checks,
 * query-key based caching, and centralized session mutation methods.
 */
export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();

  // Primary authenticated user query using hierarchical tag keys
  const {
    data: user,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: getCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes fresh
    gcTime: 15 * 60 * 1000, // 15 minutes garbage collection
    retry: false,
    refetchOnWindowFocus: true,
  });

  // Logout current session mutation
  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onMutate: async () => {
      // Optimistically clear current user from cache
      queryClient.setQueryData(authKeys.currentUser(), null);
    },
    onSuccess: () => {
      // Invalidate and purge all auth-related cache tags
      queryClient.removeQueries({ queryKey: authKeys.all });
      toast.success("Logged out successfully");
      router.push("/");
    },
    onError: (err: unknown) => {
      const message =
        err instanceof Error ? err.message : "Failed to logout cleanly";
      // Even if network fails, purge local session cache and redirect
      queryClient.removeQueries({ queryKey: authKeys.all });
      toast.error(message);
      router.push("/");
    },
  });

  // Logout all sessions mutation
  const logoutAllMutation = useMutation({
    mutationFn: logoutAllDevices,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: authKeys.all });
      toast.success("Logged out from all devices");
      router.push("/");
    },
    onError: (err: unknown) => {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to logout from all devices";
      queryClient.removeQueries({ queryKey: authKeys.all });
      toast.error(message);
      router.push("/");
    },
  });

  // Role and status derivations
  const isAuthenticated = Boolean(user && user.status === "ACTIVE");
  const role = user?.role;
  const isAdmin = role === "ADMIN";
  const isTeacher = role === "TEACHER";
  const isStudent = role === "STUDENT";
  const permissions = user?.permissions ?? [];

  // Permission validation helper (Admins inherit all permissions automatically)
  const hasPermission = (permission: TeacherPermission): boolean => {
    if (isAdmin) return true;
    return permissions.includes(permission);
  };

  // Optimistic/Manual cache updater
  const setUser = (updatedUser: User | null) => {
    queryClient.setQueryData(authKeys.currentUser(), updatedUser);
  };

  // Invalidate auth queries manually
  const invalidateAuth = async () => {
    await queryClient.invalidateQueries({ queryKey: authKeys.all });
  };

  return {
    // State & User Data
    user: user ?? null,
    isLoading,
    isFetching,
    isError,
    error,
    isAuthenticated,

    // Role Checks
    role,
    isAdmin,
    isTeacher,
    isStudent,
    status: user?.status,

    // Profiles & Permissions
    adminProfile: user?.adminProfile,
    teacherProfile: user?.teacherProfile,
    studentProfile: user?.studentProfile,
    permissions,
    hasPermission,

    // Actions & Handlers
    logout: logoutMutation.mutateAsync,
    logoutAll: logoutAllMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending || logoutAllMutation.isPending,
    setUser,
    refetchUser: refetch,
    invalidateAuth,
  };
}

export type UseAuthReturn = ReturnType<typeof useAuth>;
