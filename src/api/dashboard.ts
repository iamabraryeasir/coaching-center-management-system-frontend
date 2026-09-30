import apiClient from "@/lib/api-client";
import type {
  ApiResponse,
  DashboardMonthlySummary,
  DashboardRevenueTrend,
  DashboardTodaySnapshot,
  StudentDashboardSummary,
  TeacherDashboardSummary,
} from "@/types";

/**
 * GET /api/v1/dashboard/today
 * Today's operational snapshot: collection, attendance, pending actions, recent transactions
 */
export async function getDashboardToday(): Promise<
  ApiResponse<DashboardTodaySnapshot>
> {
  return await apiClient<ApiResponse<DashboardTodaySnapshot>>(
    "/dashboard/today",
    { method: "GET" },
  );
}

/**
 * GET /api/v1/dashboard/monthly-summary?month=M&year=YYYY
 * Full financial + academic + batch health summary for a given month
 */
export async function getDashboardMonthlySummary(params?: {
  month?: number;
  year?: number;
}): Promise<ApiResponse<DashboardMonthlySummary>> {
  const query: Record<string, number> = {};
  if (params?.month) query.month = params.month;
  if (params?.year) query.year = params.year;

  return await apiClient<ApiResponse<DashboardMonthlySummary>>(
    "/dashboard/monthly-summary",
    { method: "GET", query },
  );
}

/**
 * GET /api/v1/payments/revenue-trend?months=N
 * Month-by-month revenue trend for the last N months (for charts)
 */
export async function getRevenueTrend(
  months = 6,
): Promise<ApiResponse<DashboardRevenueTrend>> {
  return await apiClient<ApiResponse<DashboardRevenueTrend>>(
    "/payments/revenue-trend",
    { method: "GET", query: { months } },
  );
}

/**
 * GET /api/v1/dashboard/student
 * Student aggregated dashboard: hero stats, KPIs, today's schedule, billing alert, recent exams, enrolled batches
 */
export async function getStudentDashboard(): Promise<
  ApiResponse<StudentDashboardSummary>
> {
  return await apiClient<ApiResponse<StudentDashboardSummary>>(
    "/dashboard/student",
    { method: "GET" },
  );
}

/**
 * GET /api/v1/dashboard/teacher
 * Teacher aggregated dashboard: KPIs, today's classes, assigned batches, pending exams, attendance snapshot, permissions
 */
export async function getTeacherDashboard(): Promise<
  ApiResponse<TeacherDashboardSummary>
> {
  return await apiClient<ApiResponse<TeacherDashboardSummary>>(
    "/dashboard/teacher",
    { method: "GET" },
  );
}
