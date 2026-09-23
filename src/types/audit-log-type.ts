import type { QueryParams } from "./api-type";

export interface AuditLogActor {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  avatarUrl?: string | null;
}

export interface AuditLog {
  id: string;
  userId?: string | null;
  user?: AuditLogActor | null;
  action: string;
  entity?: string | null;
  entityId?: string | null;
  status?: "SUCCESS" | "FAILED" | "PENDING" | string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  payload?: Record<string, unknown> | null;
  details?: Record<string, unknown> | string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt?: string;
}

export interface AuditLogQueryParams extends QueryParams {
  action?: string;
  entity?: string;
  userId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export interface AuditActionStat {
  action: string;
  count: number;
}

export interface AuditEntityStat {
  entity: string;
  count: number;
}

export interface AuditUserStat {
  userId: string;
  userName?: string;
  email?: string;
  count: number;
}

export interface AuditLogStats {
  totalLogs?: number;
  totalEvents?: number;
  todayCount?: number;
  uniqueUsersCount?: number;
  failedEventsCount?: number;
  actionBreakdown?: AuditActionStat[] | Record<string, number>;
  entityBreakdown?: AuditEntityStat[] | Record<string, number>;
  topActors?: AuditUserStat[];
  recentFailures?: number;
}
