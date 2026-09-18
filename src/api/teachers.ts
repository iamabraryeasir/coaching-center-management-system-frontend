import apiClient from "@/lib/api-client";
import type {
  ApiResponse,
  PaginatedResponse,
  RegisterTeacherDto,
  TeacherPermission,
  TeacherQueryParams,
  UpdateTeacherDto,
  User,
  UserStatus,
} from "@/types";

/**
 * Fetch paginated faculty teachers list with server-side filters, search, and sorting
 */
export async function getTeachers(
  params?: TeacherQueryParams,
): Promise<PaginatedResponse<User>> {
  const query: Record<string, string | number> = {
    role: "TEACHER",
  };

  if (params?.page) query.page = params.page;
  if (params?.limit) query.limit = params.limit;
  if (params?.search && params.search.trim() !== "") {
    query.search = params.search.trim();
  }
  if (params?.status && params.status !== "ALL") {
    query.status = params.status;
  }
  if (params?.sortBy) query.sortBy = params.sortBy;
  if (params?.sortOrder) query.sortOrder = params.sortOrder;

  return await apiClient<PaginatedResponse<User>>("/users", {
    method: "GET",
    query,
  });
}

/**
 * Fetch complete profile dossier of a specific teacher by user ID
 */
export async function getTeacherById(
  userId: string,
): Promise<ApiResponse<User>> {
  return await apiClient<ApiResponse<User>>(`/users/${userId}`, {
    method: "GET",
  });
}

/**
 * Register a new faculty member with credentials, academic profile, and permissions
 */
export async function registerTeacher(
  payload: RegisterTeacherDto,
): Promise<ApiResponse<User>> {
  return await apiClient<ApiResponse<User>>("/auth/register-teacher", {
    method: "POST",
    body: payload,
  });
}

/**
 * Update faculty member profile details (name, phone, credentials, designation)
 */
export async function updateTeacher(
  userId: string,
  payload: UpdateTeacherDto,
): Promise<ApiResponse<User>> {
  return await apiClient<ApiResponse<User>>(`/users/teachers/${userId}`, {
    method: "PATCH",
    body: payload,
  });
}

/**
 * Update teacher operational status (ACTIVE, INACTIVE, BLOCKED)
 */
export async function updateTeacherStatus(
  userId: string,
  status: UserStatus,
): Promise<ApiResponse<User>> {
  return await apiClient<ApiResponse<User>>(`/users/${userId}/status`, {
    method: "PATCH",
    body: { status },
  });
}

/**
 * Update system access and management permissions for a teacher
 */
export async function updateTeacherPermissions(
  userId: string,
  permissions: TeacherPermission[],
): Promise<ApiResponse<User>> {
  return await apiClient<ApiResponse<User>>(
    `/users/teachers/${userId}/permissions`,
    {
      method: "PATCH",
      body: { permissions },
    },
  );
}

/**
 * Soft-delete a teacher account (sets deletedAt timestamp, sets status INACTIVE, revokes sessions)
 */
export async function deleteTeacher(
  userId: string,
): Promise<ApiResponse<{ success: boolean }>> {
  return await apiClient<ApiResponse<{ success: boolean }>>(
    `/users/${userId}`,
    {
      method: "DELETE",
    },
  );
}
