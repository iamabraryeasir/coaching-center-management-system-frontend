import type { Metadata } from "next";
import { Suspense } from "react";
import { RoutinesManagementView } from "@/components/modules/routines";
import { Skeleton } from "@/components/ui/skeleton";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Class Routines & Timetable | ${siteConfig.name}`,
  description:
    "Organize 7-day weekly class schedules, manage room allocations, and prevent faculty conflicts.",
};

function RoutinesPageFallback() {
  return (
    <div className="space-y-4">
      {/* Toolbar Skeleton */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-border/70 bg-card/60 p-3 shadow-2xs">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-72 rounded-lg" />
          <Skeleton className="h-9 w-48 rounded-md" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-32 rounded-md" />
        </div>
      </div>

      {/* 7-Day Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
        {Array.from({ length: 7 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: Skeleton placeholder
          <Skeleton key={i} className="h-80 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export default function RoutinesPage() {
  return (
    <Suspense fallback={<RoutinesPageFallback />}>
      <RoutinesManagementView />
    </Suspense>
  );
}
