"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import {
  getDashboardMonthlySummary,
  getDashboardToday,
  getRevenueTrend,
} from "@/api";
import { dashboardKeys } from "@/constants/query-keys";

/**
 * Fetches today's operational snapshot: cash collected, attendance, pending actions, recent transactions.
 * Uses Suspense — wrap with <Suspense fallback={...}>.
 */
export function useDashboardToday() {
  return useSuspenseQuery({
    queryKey: dashboardKeys.today(),
    queryFn: async () => {
      const res = await getDashboardToday();
      return res.data;
    },
    staleTime: 60_000, // 1 minute — dashboard data is live-ish
    refetchInterval: 120_000, // auto-refresh every 2 minutes
  });
}

/**
 * Fetches the monthly financial + academic + batch summary.
 * Uses Suspense — wrap with <Suspense fallback={...}>.
 */
export function useDashboardMonthlySummary(params?: {
  month?: number;
  year?: number;
}) {
  return useSuspenseQuery({
    queryKey: dashboardKeys.monthlySummary(params),
    queryFn: async () => {
      const res = await getDashboardMonthlySummary(params);
      return res.data;
    },
    staleTime: 5 * 60_000, // 5 minutes
  });
}

/**
 * Fetches the revenue trend data for the last N months (for charts).
 * Uses Suspense — wrap with <Suspense fallback={...}>.
 */
export function useDashboardRevenueTrend(months = 6) {
  return useSuspenseQuery({
    queryKey: dashboardKeys.revenueTrend(months),
    queryFn: async () => {
      const res = await getRevenueTrend(months);
      return res.data;
    },
    staleTime: 5 * 60_000, // 5 minutes
  });
}
