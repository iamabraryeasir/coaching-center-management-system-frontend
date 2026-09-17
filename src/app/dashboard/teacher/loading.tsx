import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function TeacherDashboardLoading() {
  return (
    <div className="space-y-6">
      {/* Welcome Header Skeleton */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-56 sm:h-9 sm:w-64" />
          <Skeleton className="h-4 w-60 sm:w-72" />
        </div>

        <Skeleton className="h-8 w-36 rounded-lg" />
      </div>

      {/* 3 Metric Cards Grid Skeleton */}
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: Static metric cards skeleton placeholder
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="size-9 rounded-lg" />
            </CardHeader>
            <CardContent className="space-y-2 pt-1">
              <Skeleton className="h-7 w-12" />
              <Skeleton className="h-3.5 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Schedule & Permissions Grid Skeleton */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="space-y-2">
          <CardHeader className="space-y-1.5">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-3.5 w-60" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-14 w-full rounded-lg" />
            <Skeleton className="h-14 w-full rounded-lg" />
          </CardContent>
        </Card>

        <Card className="space-y-2">
          <CardHeader className="space-y-1.5">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3.5 w-52" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-6 w-4/5" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
