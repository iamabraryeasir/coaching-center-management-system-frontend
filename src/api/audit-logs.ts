import apiClient from "@/lib/api-client";
import type {
  ApiResponse,
  AuditLog,
  AuditLogQueryParams,
  AuditLogStats,
  PaginatedResponse,
} from "@/types";

/**
 * Fetch paginated audit logs with server-side filters & search
 */
export async function getAuditLogs(
  params?: AuditLogQueryParams,
): Promise<PaginatedResponse<AuditLog>> {
  const query: Record<string, string | number> = {};

  if (params?.page) query.page = params.page;
  if (params?.limit) query.limit = params.limit;
  if (params?.search && params.search.trim() !== "") {
    query.search = params.search.trim();
  }
  if (params?.action && params.action !== "ALL") {
    query.action = params.action;
  }
  if (params?.entity && params.entity !== "ALL") {
    query.entity = params.entity;
  }
  if (params?.userId && params.userId !== "ALL") {
    query.userId = params.userId;
  }
  if (params?.status && params.status !== "ALL") {
    query.status = params.status;
  }
  if (params?.startDate) query.startDate = params.startDate;
  if (params?.endDate) query.endDate = params.endDate;
  if (params?.sortBy) query.sortBy = params.sortBy;
  if (params?.sortOrder) query.sortOrder = params.sortOrder;

  return await apiClient<PaginatedResponse<AuditLog>>("/audit-logs", {
    method: "GET",
    query,
  });
}

/**
 * Fetch aggregate audit activity statistics & security overview
 */
export async function getAuditLogStats(): Promise<ApiResponse<AuditLogStats>> {
  return await apiClient<ApiResponse<AuditLogStats>>("/audit-logs/stats", {
    method: "GET",
  });
}

/**
 * Fetch complete audit log details by ID
 */
export async function getAuditLogById(
  auditLogId: string,
): Promise<ApiResponse<AuditLog>> {
  return await apiClient<ApiResponse<AuditLog>>(`/audit-logs/${auditLogId}`, {
    method: "GET",
  });
}
