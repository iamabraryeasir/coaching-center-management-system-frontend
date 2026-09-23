import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { getAuditLogById, getAuditLogStats, getAuditLogs } from "@/api";
import { auditLogKeys } from "@/constants/query-keys";
import type {
  ApiResponse,
  AuditLog,
  AuditLogQueryParams,
  AuditLogStats,
  PaginatedResponse,
} from "@/types";

/**
 * Suspense-enabled hook to retrieve paginated audit logs
 * Triggers React <Suspense> boundary during initial load
 * GET /audit-logs
 */
export function useSuspenseAuditLogs(params?: AuditLogQueryParams) {
  return useSuspenseQuery<PaginatedResponse<AuditLog>>({
    queryKey: auditLogKeys.list(params as Record<string, unknown>),
    queryFn: () => getAuditLogs(params),
    staleTime: 1000 * 30, // 30 seconds
  });
}

/**
 * Suspense-enabled hook to retrieve aggregate audit activity statistics
 * Triggers React <Suspense> boundary during load
 * GET /audit-logs/stats
 */
export function useSuspenseAuditLogStats() {
  return useSuspenseQuery<ApiResponse<AuditLogStats>>({
    queryKey: auditLogKeys.stats(),
    queryFn: getAuditLogStats,
    staleTime: 1000 * 60, // 1 minute
  });
}

/**
 * Hook to retrieve paginated audit logs with search, filter, and pagination
 * GET /audit-logs
 */
export function useAuditLogs(params?: AuditLogQueryParams) {
  return useQuery<PaginatedResponse<AuditLog>>({
    queryKey: auditLogKeys.list(params as Record<string, unknown>),
    queryFn: () => getAuditLogs(params),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 30, // 30 seconds
  });
}

/**
 * Hook to retrieve aggregate audit activity statistics
 * GET /audit-logs/stats
 */
export function useAuditLogStats() {
  return useQuery<ApiResponse<AuditLogStats>>({
    queryKey: auditLogKeys.stats(),
    queryFn: getAuditLogStats,
    staleTime: 1000 * 60, // 1 minute
  });
}

/**
 * Hook to retrieve single audit log details by ID
 * GET /audit-logs/:auditLogId
 */
export function useAuditLogDetail(auditLogId?: string) {
  return useQuery<ApiResponse<AuditLog>>({
    queryKey: auditLogKeys.detail(auditLogId || ""),
    queryFn: () => getAuditLogById(auditLogId as string),
    enabled: Boolean(auditLogId),
    staleTime: 1000 * 60 * 5, // 5 minutes (immutable audit log)
  });
}
