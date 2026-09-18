import type { Metadata } from "next";
import { Suspense } from "react";
import { BatchDetailView } from "@/components/modules/batches";
import { Skeleton } from "@/components/ui/skeleton";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Batch Details & Roster | ${siteConfig.name}`,
  description:
    "Supervise enrolled student roster, direct admissions, and batch parameters.",
};

function BatchDetailFallback() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-36" />
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: it is just a placeholder
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-96 rounded-xl" />
    </div>
  );
}

export default async function BatchDetailPage({
  params,
}: {
  params: Promise<{ batchId: string }>;
}) {
  const { batchId } = await params;

  return (
    <Suspense fallback={<BatchDetailFallback />}>
      <BatchDetailView batchId={batchId} />
    </Suspense>
  );
}
