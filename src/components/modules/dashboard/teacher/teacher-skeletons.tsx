"use client";

import { Skeleton } from "@/components/ui/skeleton";

const FOUR_KEYS = ["kpi-1", "kpi-2", "kpi-3", "kpi-4"];
const THREE_KEYS = ["row-1", "row-2", "row-3"];
const TWO_KEYS = ["batch-1", "batch-2"];

export function TeacherKpiCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {FOUR_KEYS.map((k) => (
        <div
          key={k}
          className="space-y-3 rounded-xl border border-border/80 bg-card p-5"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="size-8 rounded-lg" />
          </div>
          <Skeleton className="h-7 w-16" />
          <Skeleton className="h-3 w-28" />
        </div>
      ))}
    </div>
  );
}

export function TeacherTodayScheduleSkeleton() {
  return (
    <div className="space-y-4 rounded-xl border border-border/80 bg-card p-6">
      <div className="space-y-1">
        <Skeleton className="h-5 w-44" />
        <Skeleton className="h-3.5 w-60" />
      </div>
      <div className="space-y-3">
        {THREE_KEYS.map((k) => (
          <div
            key={k}
            className="flex items-center justify-between rounded-lg border border-border/60 p-3.5"
          >
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function TeacherPermissionsSkeleton() {
  return (
    <div className="space-y-4 rounded-xl border border-border/80 bg-card p-6">
      <div className="space-y-1">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-3.5 w-56" />
      </div>
      <div className="space-y-3">
        {THREE_KEYS.map((k) => (
          <div key={k} className="flex items-center gap-3 py-2">
            <Skeleton className="size-5 rounded-full" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-3.5 w-44" />
              <Skeleton className="h-3 w-64" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TeacherPendingExamsSkeleton() {
  return (
    <div className="space-y-4 rounded-xl border border-border/80 bg-card p-6">
      <div className="space-y-1">
        <Skeleton className="h-5 w-44" />
        <Skeleton className="h-3.5 w-60" />
      </div>
      <div className="space-y-3">
        {THREE_KEYS.map((k) => (
          <div
            key={k}
            className="flex items-center justify-between rounded-lg border border-border/60 p-3.5"
          >
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="h-7 w-24 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function TeacherAssignedBatchesSkeleton() {
  return (
    <div className="space-y-4 rounded-xl border border-border/80 bg-card p-6">
      <div className="space-y-1">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-3.5 w-56" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {TWO_KEYS.map((k) => (
          <div
            key={k}
            className="space-y-3 rounded-xl border border-border/60 p-4"
          >
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
            <div className="flex gap-2">
              <Skeleton className="h-7 flex-1 rounded-md" />
              <Skeleton className="h-7 flex-1 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TeacherDashboardPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 sm:h-9 sm:w-80" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-9 w-40 rounded-lg" />
      </div>

      {/* Check-in Banner Skeleton */}
      <Skeleton className="h-12 w-full rounded-xl" />

      {/* KPI Cards Skeleton */}
      <TeacherKpiCardsSkeleton />

      {/* Schedule & Permissions Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TeacherTodayScheduleSkeleton />
        <TeacherPermissionsSkeleton />
      </div>

      {/* Exams & Assigned Batches Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TeacherPendingExamsSkeleton />
        <TeacherAssignedBatchesSkeleton />
      </div>
    </div>
  );
}
