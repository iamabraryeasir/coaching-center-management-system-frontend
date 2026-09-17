import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboardLoading() {
  return (
    <div className="space-y-6">
      {/* Welcome Banner Skeleton */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-60 sm:h-9 sm:w-72" />
          <Skeleton className="h-4 w-72 sm:w-96" />
        </div>

        <div className="flex items-center gap-2.5">
          <Skeleton className="h-8 w-28 rounded-lg" />
          <Skeleton className="h-8 w-32 rounded-lg" />
        </div>
      </div>

      {/* 4 Metric Cards Grid Skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: Static metric cards skeleton placeholder
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="size-9 rounded-lg" />
            </CardHeader>
            <CardContent className="space-y-2 pt-1">
              <Skeleton className="h-7 w-20" />
              <Skeleton className="h-3.5 w-36" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
