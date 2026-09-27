import apiClient from "@/lib/api-client";
import type {
  ApiResponse,
  AuthTokens,
  ChangePasswordDto,
  LoginResponse,
  UpdateMyProfileDto,
  User,
  UserSession,
} from "@/types";
import type { LoginInput } from "@/validators";

/**
 * Log in with user credentials (backend sets HttpOnly session cookies)
 */
export async function loginUser(data: LoginInput): Promise<LoginResponse> {
  return await apiClient<LoginResponse>("/auth/login", {
    method: "POST",
    body: data,
  });
}

/**
 * Fetch current authenticated user's profile using HttpOnly cookie.
 * If the 15-minute access token is expired, apiClient will automatically
 * refresh it using the 30-day HttpOnly refresh token cookie.
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
 * Log out current session (backend clears HttpOnly session cookies)
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
 * Refresh authentication access token via HttpOnly refresh cookie
 */
export async function refreshToken(): Promise<ApiResponse<AuthTokens>> {
  return await apiClient<ApiResponse<AuthTokens>>("/auth/refresh-token", {
    method: "POST",
  });
}

/**
 * Get all active sessions/devices for the authenticated user
 */
export async function getActiveSessions(): Promise<ApiResponse<UserSession[]>> {
  return await apiClient<ApiResponse<UserSession[]>>("/auth/sessions", {
    method: "GET",
  });
}

/**
 * Change authenticated user's password
 */
export async function changePassword(
  payload: ChangePasswordDto,
): Promise<ApiResponse<null>> {
  return await apiClient<ApiResponse<null>>("/users/change-password", {
    method: "PATCH",
    body: payload,
  });
}

/**
 * Update authenticated user's personal profile (name, phone, gender)
 */
export async function updateMyProfile(
  payload: UpdateMyProfileDto,
): Promise<ApiResponse<User>> {
  return await apiClient<ApiResponse<User>>("/users/me", {
    method: "PATCH",
    body: payload,
  });
}
