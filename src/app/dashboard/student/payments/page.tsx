import type { Metadata } from "next";
import { Suspense } from "react";
import { StudentPaymentView } from "@/components/modules/payments";
import { Skeleton } from "@/components/ui/skeleton";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `My Fees & Payments | ${siteConfig.name}`,
  description:
    "Review monthly coaching fees, view payment receipts, and settle dues securely with Stripe.",
};

function StudentPaymentsFallback() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-9 w-40 rounded-lg" />
      </div>

      <Skeleton className="h-48 w-full rounded-2xl" />
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  );
}

export default function StudentPaymentsPage() {
  return (
    <Suspense fallback={<StudentPaymentsFallback />}>
      <StudentPaymentView />
    </Suspense>
  );
}
