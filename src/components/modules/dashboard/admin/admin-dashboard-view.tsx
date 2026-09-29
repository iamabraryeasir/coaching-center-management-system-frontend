"use client";

import { format } from "date-fns";
import { Suspense } from "react";
import { siteConfig } from "@/config/site";
import { useAuth } from "@/hooks";

import { CollectionDonutChart } from "./collection-donut-chart";
import { DashboardKpiCards } from "./dashboard-kpi-cards";
import {
  CollectionDonutSkeleton,
  KpiCardsSkeleton,
  PendingActionsSkeleton,
  RecentTransactionsSkeleton,
  RevenueTrendChartSkeleton,
} from "./dashboard-skeletons";
import { PendingActionsCard } from "./pending-actions-card";
import { QuickActionsBar } from "./quick-actions-bar";
import { RecentTransactionsCard } from "./recent-transactions-card";
import { RevenueTrendChart } from "./revenue-trend-chart";

export function AdminDashboardView() {
  const { user } = useAuth();
  const today = format(new Date(), "EEEE, MMMM d, yyyy");

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Welcome back, {user?.name?.split(" ")[0] ?? "Administrator"} 👋
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {siteConfig.name} · {today}
          </p>
        </div>
        <QuickActionsBar />
      </div>

      {/* KPI Cards */}
      <Suspense fallback={<KpiCardsSkeleton />}>
        <DashboardKpiCards />
      </Suspense>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Suspense fallback={<RevenueTrendChartSkeleton />}>
            <RevenueTrendChart />
          </Suspense>
        </div>
        <div>
          <Suspense fallback={<CollectionDonutSkeleton />}>
            <CollectionDonutChart />
          </Suspense>
        </div>
      </div>

      {/* Activity Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Suspense fallback={<RecentTransactionsSkeleton />}>
          <RecentTransactionsCard />
        </Suspense>
        <Suspense fallback={<PendingActionsSkeleton />}>
          <PendingActionsCard />
        </Suspense>
      </div>
    </div>
  );
}
