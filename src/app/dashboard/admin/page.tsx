import type { Metadata } from "next";
import { Suspense } from "react";

import { AdminDashboardView } from "@/components/modules/dashboard";
import { DashboardPageSkeleton } from "@/components/modules/dashboard/dashboard-skeletons";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Admin Dashboard | ${siteConfig.name}`,
  description:
    "Real-time operational overview: today's collection, attendance, pending actions, revenue trends, and monthly financial health.",
};

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<DashboardPageSkeleton />}>
      <AdminDashboardView />
    </Suspense>
  );
}
