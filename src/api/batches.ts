import apiClient from "@/lib/api-client";
import type {
  ApiResponse,
  Batch,
  BatchEnrollment,
  BatchQueryParams,
  CreateBatchDto,
  DirectEnrollDto,
  PaginatedResponse,
  QueryParams,
  UpdateBatchDto,
} from "@/types";

/**
 * Fetch paginated batches list with QueryBuilder filters & search
 */
export async function getBatches(
  params?: BatchQueryParams,
): Promise<PaginatedResponse<Batch>> {
  const query: Record<string, string | number> = {};

  if (params?.page) query.page = params.page;
  if (params?.limit) query.limit = params.limit;
  if (params?.search && params.search.trim() !== "") {
    query.search = params.search.trim();
  }
  if (params?.status && params.status !== "ALL") {
    query.status = params.status;
  }
  if (params?.fee_gte !== undefined && params.fee_gte !== null) {
    query.fee_gte = params.fee_gte;
  }
  if (params?.fee_lte !== undefined && params.fee_lte !== null) {
    query.fee_lte = params.fee_lte;
  }
  if (params?.sortBy) query.sortBy = params.sortBy;
  if (params?.sortOrder) query.sortOrder = params.sortOrder;

  return await apiClient<PaginatedResponse<Batch>>("/batches", {
    method: "GET",
    query,
  });
}

/**
 * Fetch single batch details by batchId
 */
export async function getBatchById(
  batchId: string,
): Promise<ApiResponse<Batch>> {
  return await apiClient<ApiResponse<Batch>>(`/batches/${batchId}`, {
    method: "GET",
  });
}

/**
 * Create a new academic batch (Admin only)
 */
export async function createBatch(
  payload: CreateBatchDto,
): Promise<ApiResponse<Batch>> {
  return await apiClient<ApiResponse<Batch>>("/batches", {
    method: "POST",
    body: payload,
  });
}

/**
 * Update batch parameters (Admin only)
 */
export async function updateBatch(
  batchId: string,
  payload: UpdateBatchDto,
): Promise<ApiResponse<Batch>> {
  return await apiClient<ApiResponse<Batch>>(`/batches/${batchId}`, {
    method: "PATCH",
    body: payload,
  });
}

/**
 * Soft delete batch (Admin only — sets status to CANCELLED)
 */
export async function deleteBatch(
  batchId: string,
): Promise<ApiResponse<Batch>> {
  return await apiClient<ApiResponse<Batch>>(`/batches/${batchId}`, {
    method: "DELETE",
  });
}

/**
 * Get pending student self-enrollment applications across all batches (Admin only)
 */
export async function getPendingEnrollments(
  params?: QueryParams,
): Promise<PaginatedResponse<BatchEnrollment>> {
  const query: Record<string, string | number> = {};

  if (params?.page) query.page = params.page;
  if (params?.limit) query.limit = params.limit;
  if (params?.search && params.search.trim() !== "") {
    query.search = params.search.trim();
  }
  if (params?.sortBy) query.sortBy = params.sortBy;
  if (params?.sortOrder) query.sortOrder = params.sortOrder;

  return await apiClient<PaginatedResponse<BatchEnrollment>>(
    "/batches/enrollments/pending",
    {
      method: "GET",
      query,
    },
  );
}

/**
 * Approve pending student enrollment (Admin only)
 */
export async function approveEnrollment(
  enrollmentId: string,
): Promise<ApiResponse<BatchEnrollment>> {
  return await apiClient<ApiResponse<BatchEnrollment>>(
    `/batches/enrollments/${enrollmentId}/approve`,
    {
      method: "PATCH",
      body: {},
    },
  );
}

/**
 * Reject pending student enrollment (Admin only)
 */
export async function rejectEnrollment(
  enrollmentId: string,
  reason?: string,
): Promise<ApiResponse<BatchEnrollment>> {
  return await apiClient<ApiResponse<BatchEnrollment>>(
    `/batches/enrollments/${enrollmentId}/reject`,
    {
      method: "PATCH",
      body: reason ? { reason } : {},
    },
  );
}

/**
 * Get student roster for a specific batch (Admin & Teacher)
 */
export async function getBatchStudents(
  batchId: string,
  params?: QueryParams & { status?: string },
): Promise<PaginatedResponse<BatchEnrollment>> {
  const query: Record<string, string | number> = {};

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

  return await apiClient<PaginatedResponse<BatchEnrollment>>(
    `/batches/${batchId}/students`,
    {
      method: "GET",
      query,
    },
  );
}

/**
 * Admin directly enroll an existing active student into a batch
 */
export async function directEnrollStudent(
  batchId: string,
  payload: DirectEnrollDto,
): Promise<ApiResponse<BatchEnrollment>> {
  return await apiClient<ApiResponse<BatchEnrollment>>(
    `/batches/${batchId}/students`,
    {
      method: "POST",
      body: payload,
    },
  );
}

/**
 * Admin drop / remove student from a batch
 */
export async function removeStudentFromBatch(
  batchId: string,
  userId: string,
): Promise<ApiResponse<{ success: boolean }>> {
  return await apiClient<ApiResponse<{ success: boolean }>>(
    `/batches/${batchId}/students/${userId}`,
    {
      method: "DELETE",
    },
  );
}
