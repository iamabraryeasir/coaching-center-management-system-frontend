import { Skeleton } from "@/components/ui/skeleton";

export default function AdminAuditLogsLoading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {["load-skel-1", "load-skel-2", "load-skel-3", "load-skel-4"].map(
          (key) => (
            <Skeleton key={key} className="h-28 w-full rounded-xl" />
          ),
        )}
      </div>

      {/* Search & Filters Toolbar Skeleton */}
      <Skeleton className="h-16 w-full rounded-xl" />

      {/* Table Skeleton */}
      <Skeleton className="h-96 w-full rounded-xl" />
    </div>
  );
}
