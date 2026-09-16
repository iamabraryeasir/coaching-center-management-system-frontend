import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-muted/30 p-4 sm:p-6 lg:p-10">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Top Header Bar Skeleton */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-40 sm:h-9 sm:w-48" />
            <Skeleton className="h-4 w-64 sm:w-80" />
          </div>

          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-28 rounded-lg" />
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
        </div>

        {/* Dashboard Content Grid Skeleton */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Main User Profile Card Skeleton (2 cols) */}
          <Card className="md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div className="space-y-1.5">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-3.5 w-52" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </CardHeader>

            <CardContent className="space-y-5">
              {/* User Avatar & Name */}
              <div className="flex items-center gap-4">
                <Skeleton className="size-14 rounded-2xl" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-3.5 w-28" />
                </div>
              </div>

              {/* Contact Information Row */}
              <div className="grid gap-3 pt-2 sm:grid-cols-2">
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>

              {/* Academic/Faculty Details Box */}
              <div className="rounded-xl border border-border/60 p-4 space-y-2.5">
                <div className="flex items-center gap-2">
                  <Skeleton className="size-4 rounded" />
                  <Skeleton className="h-4 w-36" />
                </div>
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-64" />
              </div>
            </CardContent>
          </Card>

          {/* Session Controls Card Skeleton (1 col) */}
          <Card>
            <CardHeader className="space-y-1.5">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-3.5 w-44" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-4/5" />
              </div>

              <Skeleton className="h-9 w-full rounded-lg" />

              <div className="pt-2 flex justify-center">
                <Skeleton className="h-3 w-40" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
