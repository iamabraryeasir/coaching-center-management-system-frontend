import type { Metadata } from "next";
import { Suspense } from "react";
import { TeachersManagementView } from "@/components/modules/teachers";
import { Skeleton } from "@/components/ui/skeleton";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Teachers | ${siteConfig.name}`,
  description:
    "Supervise teachers, manage academic credentials, configure account statuses, and delegate administrative privileges.",
};

function TeachersPageFallback() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-9 w-40 rounded-lg" />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Skeleton className="h-20 rounded-xl" />
        <Skeleton className="h-20 rounded-xl" />
        <Skeleton className="h-20 rounded-xl" />
      </div>

      <div className="flex gap-2">
        <Skeleton className="h-9 w-64 rounded-lg" />
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>

      <div className="h-96 w-full bg-card border border-border/70 rounded-xl animate-pulse" />
    </div>
  );
}

export default function TeachersPage() {
  return (
    <Suspense fallback={<TeachersPageFallback />}>
      <TeachersManagementView />
    </Suspense>
  );
}
