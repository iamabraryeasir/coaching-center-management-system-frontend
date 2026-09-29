import { Skeleton } from "@/components/ui/skeleton";

export function TeacherSettingsSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-5 w-44 rounded-full" />
        <Skeleton className="h-8 w-60" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>

      <Skeleton className="h-9 w-64 rounded-lg" />

      <div className="space-y-6">
        <div className="rounded-xl border border-border/80 bg-card p-6 space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton className="size-16 rounded-full" />
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
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
