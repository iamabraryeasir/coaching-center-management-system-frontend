import apiClient from "@/lib/api-client";
import type { ApiResponse, AuthTokens, LoginResponse, User } from "@/types";
import type { LoginInput } from "@/validators";

/**
 * Log in with user credentials
 */
export async function loginUser(data: LoginInput): Promise<LoginResponse> {
  return await apiClient<LoginResponse>("/auth/login", {
    method: "POST",
    body: data,
  });
}

/**
 * Fetch current authenticated user's full profile
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await apiClient<ApiResponse<User>>("/users/me", {
      method: "GET",
    });
    return response.data ?? null;
  } catch {
    return null;
  }
}

/**
 * Log out current session
 */
export async function logoutUser(): Promise<ApiResponse<null>> {
  return await apiClient<ApiResponse<null>>("/auth/logout", {
    method: "POST",
  });
}

/**
 * Log out from all active sessions/devices
 */
export async function logoutAllDevices(): Promise<ApiResponse<null>> {
  return await apiClient<ApiResponse<null>>("/auth/logout-all", {
    method: "POST",
  });
}

/**
 * Refresh authentication access token
 */
export async function refreshToken(): Promise<ApiResponse<AuthTokens>> {
  return await apiClient<ApiResponse<AuthTokens>>("/auth/refresh-token", {
    method: "POST",
  });
}
