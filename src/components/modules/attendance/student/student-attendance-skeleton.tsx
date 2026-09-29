import { Skeleton } from "@/components/ui/skeleton";

export function StudentAttendanceSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-7 w-60 sm:h-8 sm:w-72" />
          <Skeleton className="h-4 w-80 sm:w-96" />
        </div>
        <Skeleton className="h-9 w-28 self-start sm:self-auto" />
      </div>

      {/* Minimal Attendance Overview Skeleton */}
      <div className="rounded-xl border border-border/80 bg-card p-4 sm:p-5 shadow-2xs space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="space-y-1.5">
            <Skeleton className="h-5 w-40 sm:w-48" />
            <Skeleton className="h-3.5 w-60 sm:w-80" />
          </div>
          <Skeleton className="h-7 w-28" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
      </div>

      {/* 5 KPI Metric Cards Skeleton */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: Static array for skeleton placeholders
            key={i}
            className={`rounded-xl border border-border/70 bg-card p-3.5 sm:p-4 shadow-2xs space-y-2.5 ${
              i === 4 ? "col-span-2 sm:col-span-1 md:col-span-1" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-3.5 w-18" />
              <Skeleton className="size-7 rounded-lg" />
            </div>
            <Skeleton className="h-6 w-14" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>

      {/* History Table & Filter Skeleton */}
      <div className="rounded-xl border border-border/70 bg-card p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-9 w-48 sm:w-64" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-28 sm:w-32" />
          </div>
        </div>
        <div className="space-y-2.5">
          {Array.from({ length: 5 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: Static array for skeleton placeholders
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
