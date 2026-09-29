import { Skeleton } from "@/components/ui/skeleton";

export function StudentHeroBannerSkeleton() {
  return (
    <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-36 rounded-full" />
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-9 w-44 rounded-lg" />
      </div>
    </div>
  );
}

export function StudentKpiCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton array
          key={i}
          className="rounded-xl border border-border/80 bg-card p-4 sm:p-5 space-y-2.5 shadow-2xs"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="size-8 rounded-lg" />
          </div>
          <Skeleton className="h-7 w-20" />
          <Skeleton className="h-3 w-32" />
        </div>
      ))}
    </div>
  );
}

export function StudentScheduleCardSkeleton() {
  return (
    <div className="rounded-xl border border-border/80 bg-card p-5 sm:p-6 space-y-4 shadow-2xs">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="space-y-1">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3.5 w-56" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton array
            key={i}
            className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-2"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-5 w-24 rounded-full" />
            </div>
            <Skeleton className="h-3.5 w-48" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function StudentRecentExamsCardSkeleton() {
  return (
    <div className="rounded-xl border border-border/80 bg-card p-5 sm:p-6 space-y-4 shadow-2xs">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="space-y-1">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-3.5 w-52" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton array
            key={i}
            className="p-3.5 rounded-xl border border-border/60 bg-muted/20 flex items-center justify-between gap-3"
          >
            <div className="space-y-1 flex-1">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-28" />
            </div>
            <Skeleton className="h-7 w-16 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function StudentDashboardPageSkeleton() {
  return (
    <div className="space-y-6">
      <StudentHeroBannerSkeleton />
      <Skeleton className="h-16 w-full rounded-xl" />
      <StudentKpiCardsSkeleton />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <StudentScheduleCardSkeleton />
        </div>
        <div>
          <StudentRecentExamsCardSkeleton />
        </div>
      </div>
      <div className="rounded-xl border border-border/80 bg-card p-5 sm:p-6 space-y-4 shadow-2xs">
        <Skeleton className="h-5 w-40" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton array
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
