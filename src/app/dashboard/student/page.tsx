import type { Metadata } from "next";
import { Suspense } from "react";
import {
  StudentDashboardPageSkeleton,
  StudentDashboardView,
} from "@/components/modules/dashboard/student";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Student Dashboard | ${siteConfig.name}`,
  description:
    "Student command center: today's class schedule, academic performance, verified attendance, and tuition dues.",
};

export default function StudentDashboardPage() {
  return (
    <Suspense fallback={<StudentDashboardPageSkeleton />}>
      <StudentDashboardView />
    </Suspense>
  );
}
