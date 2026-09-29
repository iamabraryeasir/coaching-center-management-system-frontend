import { Skeleton } from "@/components/ui/skeleton";

export function StudentBatchesSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-10 w-64 rounded-lg" />
        <Skeleton className="h-10 w-48 rounded-lg" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton array
            key={i}
            className="flex flex-col justify-between rounded-xl border border-border/80 bg-card p-5 space-y-4 shadow-2xs"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-6 w-3/4 rounded" />
              <Skeleton className="h-4 w-1/2 rounded" />
            </div>

            <div className="space-y-3 pt-3 border-t border-border/60">
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-20" />
              </div>
              <Skeleton className="h-9 w-full rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
