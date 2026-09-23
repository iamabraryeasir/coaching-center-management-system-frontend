import apiClient from "@/lib/api-client";
import type { ApiResponse, User } from "@/types";

/**
 * Upload or replace authenticated user's own profile avatar (All Roles).
 * Stores media asset on Cloudinary and updates user avatarUrl.
 */
export async function uploadMyAvatar(file: File): Promise<ApiResponse<User>> {
  const formData = new FormData();
  formData.append("avatar", file);

  return await apiClient<ApiResponse<User>>("/users/me/avatar", {
    method: "PATCH",
    body: formData,
  });
}

/**
 * Delete authenticated user's own avatar from Cloudinary and clears avatarUrl.
 */
export async function deleteMyAvatar(): Promise<ApiResponse<User | null>> {
  return await apiClient<ApiResponse<User | null>>("/users/me/avatar", {
    method: "DELETE",
  });
}

/**
 * Administrative upload/replacement of avatar for any specific user (student or teacher).
 */
export async function uploadUserAvatar(
  targetUserId: string,
  file: File,
): Promise<ApiResponse<User>> {
  const formData = new FormData();
  formData.append("avatar", file);

  return await apiClient<ApiResponse<User>>(
    `/uploads/users/${targetUserId}/avatar`,
    {
      method: "POST",
      body: formData,
    },
  );
}
