import type { Metadata } from "next";
import { Suspense } from "react";
import { BatchesManagementView } from "@/components/modules/batches";
import { Skeleton } from "@/components/ui/skeleton";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `My Batches & Classes | ${siteConfig.name}`,
  description:
    "View assigned coaching batches, enrolled student rosters, and routine class schedules.",
};

function TeacherBatchesFallback() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="h-10 w-full bg-muted/50 rounded-lg animate-pulse" />
      <div className="h-96 w-full bg-card border border-border/70 rounded-xl animate-pulse" />
    </div>
  );
}

export default function TeacherBatchesPage() {
  return (
    <Suspense fallback={<TeacherBatchesFallback />}>
      <BatchesManagementView portalRole="TEACHER" />
    </Suspense>
  );
}
