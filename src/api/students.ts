import apiClient from "@/lib/api-client";
import type {
  ApiResponse,
  PaginatedResponse,
  PendingStudent,
  QueryParams,
  RegisterStudentDto,
  StudentQueryParams,
  User,
  UserStatus,
} from "@/types";

/**
 * Fetch paginated active students list with server-side filters & search
 */
export async function getStudents(
  params?: StudentQueryParams,
): Promise<PaginatedResponse<User>> {
  const query: Record<string, string | number> = {
    role: "STUDENT",
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
 * Fetch detailed profile of a single student by user ID
 */
export async function getStudentById(
  userId: string,
): Promise<ApiResponse<User>> {
  return await apiClient<ApiResponse<User>>(`/users/${userId}`, {
    method: "GET",
  });
}

/**
 * Admin direct student registration
 */
export async function registerStudent(
  payload: RegisterStudentDto,
): Promise<ApiResponse<User>> {
  return await apiClient<ApiResponse<User>>("/auth/register-student", {
    method: "POST",
    body: payload,
  });
}

/**
 * Update student account status (ACTIVE, INACTIVE, BLOCKED, etc.)
 */
export async function updateStudentStatus(
  userId: string,
  status: UserStatus,
): Promise<ApiResponse<User>> {
  return await apiClient<ApiResponse<User>>(`/users/${userId}/status`, {
    method: "PATCH",
    body: { status },
  });
}

/**
 * Soft delete a student user
 */
export async function deleteStudent(
  userId: string,
): Promise<ApiResponse<null>> {
  return await apiClient<ApiResponse<null>>(`/users/${userId}`, {
    method: "DELETE",
  });
}

/**
 * Fetch paginated pending student registration applications
 */
export async function getPendingStudents(
  params?: QueryParams,
): Promise<PaginatedResponse<PendingStudent>> {
  const query: Record<string, string | number> = {};

  if (params?.page) query.page = params.page;
  if (params?.limit) query.limit = params.limit;
  if (params?.search && params.search.trim() !== "") {
    query.search = params.search.trim();
  }
  if (params?.sortBy) query.sortBy = params.sortBy;
  if (params?.sortOrder) query.sortOrder = params.sortOrder;

  return await apiClient<PaginatedResponse<PendingStudent>>(
    "/auth/pending-students",
    {
      method: "GET",
      query,
    },
  );
}

/**
 * Approve a pending student application
 */
export async function approvePendingStudent(
  pendingStudentId: string,
): Promise<ApiResponse<User>> {
  return await apiClient<ApiResponse<User>>(
    `/auth/pending-students/${pendingStudentId}/approve`,
    {
      method: "PATCH",
    },
  );
}

/**
 * Reject a pending student application
 */
export async function rejectPendingStudent(
  pendingStudentId: string,
  rejectionReason?: string,
): Promise<ApiResponse<null>> {
  return await apiClient<ApiResponse<null>>(
    `/auth/pending-students/${pendingStudentId}/reject`,
    {
      method: "PATCH",
      body: rejectionReason ? { rejectionReason } : undefined,
    },
  );
}
