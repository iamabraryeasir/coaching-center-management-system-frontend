import apiClient from "@/lib/api-client";
import type {
  ApiResponse,
  AuthTokens,
  ChangePasswordDto,
  GoogleAuthPayload,
  GoogleAuthResponseData,
  GoogleOnboardDto,
  LoginResponse,
  PendingStudent,
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
 * Verify Google Identity Services (GIS) ID token.
 * If user exists and approved: sets HttpOnly cookies, returns { isNewUser: false, user }
 * If new user: returns { isNewUser: true, googleId, email, name, avatarUrl }
 */
export async function verifyGoogleToken(
  payload: GoogleAuthPayload,
): Promise<ApiResponse<GoogleAuthResponseData>> {
  return await apiClient<ApiResponse<GoogleAuthResponseData>>("/auth/google", {
    method: "POST",
    body: payload,
  });
}

/**
 * Submit student onboarding credentials for new Google OAuth applicant.
 * Puts user account in PENDING_ACTIVATION awaiting administrative approval.
 */
export async function submitGoogleOnboarding(
  payload: GoogleOnboardDto,
): Promise<ApiResponse<PendingStudent | User>> {
  return await apiClient<ApiResponse<PendingStudent | User>>(
    "/auth/google/onboard",
    {
      method: "POST",
      body: payload,
    },
  );
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

/**
 * Initiate password recovery link via email
 */
export async function forgotPassword(payload: {
  email: string;
}): Promise<ApiResponse<null>> {
  return await apiClient<ApiResponse<null>>("/auth/forgot-password", {
    method: "POST",
    body: payload,
  });
}

/**
 * Reset user password using token from email link
 */
export async function resetPassword(payload: {
  password: string;
  token?: string;
}): Promise<ApiResponse<null>> {
  return await apiClient<ApiResponse<null>>("/auth/reset-password", {
    method: "POST",
    body: payload,
  });
}

