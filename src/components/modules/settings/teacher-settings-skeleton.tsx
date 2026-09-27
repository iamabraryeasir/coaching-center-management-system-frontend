import { Skeleton } from "@/components/ui/skeleton";

export function TeacherSettingsSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 1. Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-44 rounded-full" />
        <Skeleton className="h-8 w-60" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>

      {/* 2. Ribbon Skeleton */}
      <div className="grid grid-cols-3 gap-3.5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton array
            key={i}
            className="rounded-xl border border-border/80 bg-card p-3.5 space-y-2"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="size-4 rounded" />
            </div>
            <Skeleton className="h-7 w-16" />
          </div>
        ))}
      </div>

      {/* 3. Tabs List Skeleton */}
      <Skeleton className="h-9 w-full max-w-lg rounded-lg" />

      {/* 4. Content Cards Skeleton */}
      <div className="space-y-6">
        <div className="rounded-xl border border-border/80 bg-card p-6 space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton className="size-20 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-3.5 w-64" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border/80 bg-card p-6 space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-3.5 w-72" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full sm:col-span-2" />
          </div>
        </div>
      </div>
    </div>
  );
}
