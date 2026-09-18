import type { Metadata } from "next";
import { Suspense } from "react";
import { BatchesManagementView } from "@/components/modules/batches";
import { Skeleton } from "@/components/ui/skeleton";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Academic Batches | ${siteConfig.name}`,
  description:
    "Configure academic batches, enrollment pricing, and supervise student admissions.",
};

function BatchesPageFallback() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>
      <div className="h-10 w-64 bg-muted/50 rounded-lg animate-pulse" />
      <div className="h-96 w-full bg-card border border-border/70 rounded-xl animate-pulse" />
    </div>
  );
}

export default function BatchesPage() {
  return (
    <Suspense fallback={<BatchesPageFallback />}>
      <BatchesManagementView />
    </Suspense>
  );
}
