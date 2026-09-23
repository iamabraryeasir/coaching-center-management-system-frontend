"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteMyAvatar, uploadMyAvatar, uploadUserAvatar } from "@/api/media";
import {
  authKeys,
  mediaKeys,
  studentKeys,
  teacherKeys,
  userKeys,
} from "@/constants/query-keys";
import type { User } from "@/types";

function getErrorMessage(error: unknown, fallback: string): string {
  if (!error) return fallback;
  if (typeof error === "string") return error;
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }
  return fallback;
}

/**
 * Mutation hook to upload or replace the authenticated user's own profile avatar
 */
export function useUploadMyAvatarMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadMyAvatar(file),
    onSuccess: (response) => {
      // Update the current user data directly in the cache for instant UI feedback
      if (response.data) {
        queryClient.setQueryData(
          authKeys.currentUser(),
          (prev: User | null) => {
            if (!prev) return response.data;
            return {
              ...prev,
              avatarUrl: response.data?.avatarUrl ?? prev.avatarUrl,
            };
          },
        );
      }
      // Invalidate queries to guarantee freshness
      queryClient.invalidateQueries({ queryKey: authKeys.currentUser() });
      queryClient.invalidateQueries({ queryKey: mediaKeys.all });
      toast.success("Profile avatar updated successfully!");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to upload avatar."));
    },
  });
}

/**
 * Mutation hook to delete the authenticated user's own avatar from Cloudinary
 */
export function useDeleteMyAvatarMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteMyAvatar(),
    onSuccess: () => {
      // Clear avatarUrl in the current user cache
      queryClient.setQueryData(authKeys.currentUser(), (prev: User | null) => {
        if (!prev) return null;
        return {
          ...prev,
          avatarUrl: null,
        };
      });
      queryClient.invalidateQueries({ queryKey: authKeys.currentUser() });
      queryClient.invalidateQueries({ queryKey: mediaKeys.all });
      toast.success("Profile avatar removed successfully.");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to remove avatar."));
    },
  });
}

/**
 * Administrative mutation hook to upload/replace the avatar of a specific student or teacher
 */
export function useUploadUserAvatarMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      targetUserId,
      file,
    }: {
      targetUserId: string;
      file: File;
    }) => uploadUserAvatar(targetUserId, file),
    onSuccess: (_, variables) => {
      // Invalidate relevant directories and specific user detail caches
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      queryClient.invalidateQueries({ queryKey: studentKeys.all });
      queryClient.invalidateQueries({ queryKey: teacherKeys.all });
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(variables.targetUserId),
      });
      queryClient.invalidateQueries({
        queryKey: studentKeys.detail(variables.targetUserId),
      });
      queryClient.invalidateQueries({
        queryKey: teacherKeys.detail(variables.targetUserId),
      });
      toast.success("User avatar updated successfully!");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to update user avatar."));
    },
  });
}
