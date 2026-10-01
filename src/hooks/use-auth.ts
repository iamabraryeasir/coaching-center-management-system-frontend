"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import {
  changePassword,
  getActiveSessions,
  getCurrentUser,
  logoutAllDevices,
  logoutUser,
  submitGoogleOnboarding,
  updateMyProfile,
  verifyGoogleToken,
} from "@/api/auth";
import { authKeys } from "@/constants/query-keys";
import { authChannel } from "@/lib/auth-channel";
import {
  clearClientSessionFlag,
  setClientSessionFlag,
} from "@/lib/session-cookie";
import {
  type ChangePasswordDto,
  type GoogleAuthPayload,
  type GoogleOnboardDto,
  getTeacherPermissions,
  type TeacherPermission,
  type UpdateMyProfileDto,
  type User,
} from "@/types";

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
    queryFn: async () => {
      const u = await getCurrentUser();
      if (u && u.status === "ACTIVE") {
        setClientSessionFlag();
      }
      return u;
    },
    staleTime: 60 * 1000, // 1 minute fresh
    gcTime: 15 * 60 * 1000, // 15 minutes garbage collection
    retry: false,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  // Logout current session mutation
  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onMutate: async () => {
      clearClientSessionFlag();
      // Optimistically clear current user from cache
      queryClient.setQueryData(authKeys.currentUser(), null);
      // Synchronize logout across all open browser tabs
      authChannel.postMessage({ type: "LOGOUT" });
    },
    onSuccess: () => {
      clearClientSessionFlag();
      // Invalidate and purge all auth-related cache tags
      queryClient.removeQueries({ queryKey: authKeys.all });
      toast.success("Logged out successfully");
      router.push("/");
    },
    onError: (err: unknown) => {
      clearClientSessionFlag();
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
    onMutate: async () => {
      clearClientSessionFlag();
      queryClient.setQueryData(authKeys.currentUser(), null);
      authChannel.postMessage({ type: "LOGOUT" });
    },
    onSuccess: () => {
      clearClientSessionFlag();
      queryClient.removeQueries({ queryKey: authKeys.all });
      toast.success("Logged out from all devices");
      router.push("/");
    },
    onError: (err: unknown) => {
      clearClientSessionFlag();
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
  const permissions = user ? getTeacherPermissions(user) : [];

  // Permission validation helper (Admins inherit all permissions automatically)
  const hasPermission = (permission: TeacherPermission): boolean => {
    if (isAdmin) return true;
    const target = String(permission).toUpperCase().trim();
    return permissions.some((p) => String(p).toUpperCase().trim() === target);
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

/**
 * Fetch all active sessions/devices for the authenticated user
 */
export function useActiveSessions() {
  return useQuery({
    queryKey: authKeys.sessions(),
    queryFn: async () => {
      const res = await getActiveSessions();
      return res.data ?? [];
    },
    staleTime: 60 * 1000,
  });
}

/**
 * Mutation to change authenticated user's password
 */
export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: (data: ChangePasswordDto) => changePassword(data),
  });
}

/**
 * Mutation to update authenticated user's personal profile (name, phone, gender)
 */
export function useUpdateMyProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateMyProfileDto) => updateMyProfile(data),
    onSuccess: (response) => {
      if (response.data) {
        queryClient.setQueryData(authKeys.currentUser(), response.data);
      }
      queryClient.invalidateQueries({ queryKey: authKeys.currentUser() });
    },
  });
}

/**
 * Mutation to log out from all devices and clear sessions
 */
export function useLogoutAllMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: logoutAllDevices,
    onMutate: async () => {
      queryClient.setQueryData(authKeys.currentUser(), null);
      authChannel.postMessage({ type: "LOGOUT" });
    },
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
}

/**
 * Mutation to verify Google Identity Services ID token.
 * If approved user: updates cache and triggers login broadcast.
 * If new user: returns { isNewUser: true, googleId, email, name, avatarUrl }.
 */
export function useGoogleAuthMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: GoogleAuthPayload) => verifyGoogleToken(payload),
    onSuccess: (res) => {
      const data = res.data;
      if (data && !data.isNewUser && data.user) {
        queryClient.setQueryData(authKeys.currentUser(), data.user);
        authChannel.postMessage({ type: "LOGIN" });
      }
    },
  });
}

/**
 * Mutation for submitting Google student onboarding form.
 * Puts applicant into PENDING_ACTIVATION state.
 */
export function useGoogleOnboardingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: GoogleOnboardDto) => submitGoogleOnboarding(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-students"] });
    },
  });
}
