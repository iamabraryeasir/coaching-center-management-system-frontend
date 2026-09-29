"use client";
import { Skeleton } from "@/components/ui/skeleton";

const KPI_SKELETON_KEYS = ["a", "b", "c", "d", "e", "f", "g", "h"];
const THREE_KEYS = ["x", "y", "z"];
const FIVE_KEYS = ["p", "q", "r", "s", "t"];

export function KpiCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {KPI_SKELETON_KEYS.map((k) => (
        <div
          key={k}
          className="space-y-3 rounded-xl border border-border/80 bg-card p-5"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="size-8 rounded-lg" />
          </div>
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      ))}
    </div>
  );
}

export function RevenueTrendChartSkeleton() {
  return (
    <div className="space-y-4 rounded-xl border border-border/80 bg-card p-6">
      <div className="space-y-1">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-3.5 w-64" />
      </div>
      <Skeleton className="h-64 w-full rounded-lg" />
    </div>
  );
}

export function CollectionDonutSkeleton() {
  return (
    <div className="space-y-4 rounded-xl border border-border/80 bg-card p-6">
      <div className="space-y-1">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-3.5 w-40" />
      </div>
      <div className="flex items-center justify-center">
        <Skeleton className="size-48 rounded-full" />
      </div>
      <div className="space-y-2">
        {THREE_KEYS.map((k) => (
          <div key={k} className="flex items-center gap-2">
            <Skeleton className="size-3 rounded-full" />
            <Skeleton className="h-3 flex-1" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function RecentTransactionsSkeleton() {
  return (
    <div className="space-y-4 rounded-xl border border-border/80 bg-card p-6">
      <Skeleton className="h-5 w-48" />
      {FIVE_KEYS.map((k) => (
        <div key={k} className="flex items-center gap-3 py-2">
          <Skeleton className="size-9 shrink-0 rounded-full" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-36" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
}

export function PendingActionsSkeleton() {
  return (
    <div className="space-y-4 rounded-xl border border-border/80 bg-card p-6">
      <Skeleton className="h-5 w-36" />
      {THREE_KEYS.map((k) => (
        <div
          key={k}
          className="flex items-center justify-between border-b border-border/50 py-2.5 last:border-0"
        >
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-40" />
            <Skeleton className="h-3 w-28" />
          </div>
          <Skeleton className="h-7 w-20 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function DashboardPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-72" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-9 w-48 rounded-lg" />
      </div>
      <KpiCardsSkeleton />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueTrendChartSkeleton />
        </div>
        <CollectionDonutSkeleton />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentTransactionsSkeleton />
        <PendingActionsSkeleton />
      </div>
    </div>
  );
}
