import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminPaymentsView } from "@/components/modules/payments";
import { Skeleton } from "@/components/ui/skeleton";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Fee & Payments Management | ${siteConfig.name}`,
  description:
    "Track monthly tuition fees, monitor arrears, record manual cash/MFS collections, and view receipt transactions.",
};

function PaymentsPageFallback() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-9 w-36 rounded-lg" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items
          <Skeleton key={i} className="h-28 w-full rounded-xl" />
        ))}
      </div>

      <Skeleton className="h-96 w-full rounded-xl" />
    </div>
  );
}

export default function AdminPaymentsPage() {
  return (
    <Suspense fallback={<PaymentsPageFallback />}>
      <AdminPaymentsView />
    </Suspense>
  );
}
