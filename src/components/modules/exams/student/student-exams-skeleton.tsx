import { Skeleton } from "@/components/ui/skeleton";

export function StudentExamsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Page Header Skeleton */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-7 w-56 sm:h-8 sm:w-72" />
          <Skeleton className="h-4 w-72 sm:w-96" />
        </div>
        <Skeleton className="h-9 w-28 self-start sm:self-auto" />
      </div>

      {/* 4 KPI Stats Cards Skeleton */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: Static array for skeleton placeholders
            key={i}
            className="rounded-xl border border-border/70 bg-card p-3.5 sm:p-4 shadow-2xs space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="size-7 sm:size-8 rounded-lg" />
            </div>
            <Skeleton className="h-6 sm:h-7 w-20" />
            <Skeleton className="h-3 w-28" />
          </div>
        ))}
      </div>

      {/* Filter & Results List Skeleton */}
      <div className="rounded-xl border border-border/70 bg-card p-4 sm:p-5 shadow-2xs space-y-4 sm:space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-9 w-48 sm:w-64" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-28 sm:w-32" />
          </div>
        </div>
        <div className="space-y-2.5">
          {Array.from({ length: 5 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: Static array for skeleton placeholders
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
