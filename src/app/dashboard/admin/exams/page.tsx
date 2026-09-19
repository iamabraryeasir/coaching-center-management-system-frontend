import type { Metadata } from "next";
import { Suspense } from "react";
import { ExamsManagementView } from "@/components/modules/exams";
import { Skeleton } from "@/components/ui/skeleton";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Exams & Results Pipeline | ${siteConfig.name}`,
  description:
    "Schedule examinations, record marks with automated grading, and publish batch merit leaderboards.",
};

function ExamsPageFallback() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-9 w-36 rounded-lg" />
      </div>

      <Skeleton className="h-10 w-full rounded-xl" />
      <Skeleton className="h-96 w-full rounded-xl" />
    </div>
  );
}

export default function AdminExamsPage() {
  return (
    <Suspense fallback={<ExamsPageFallback />}>
      <ExamsManagementView portalRole="ADMIN" />
    </Suspense>
  );
}
