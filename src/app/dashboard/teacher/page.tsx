import type { Metadata } from "next";
import { Suspense } from "react";
import {
  TeacherDashboardPageSkeleton,
  TeacherDashboardView,
} from "@/components/modules/dashboard/teacher";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Teacher Workspace | ${siteConfig.name}`,
  description:
    "Real-time faculty workspace: class schedule, assigned batches, attendance check-in, and exam grading.",
};

export default function TeacherDashboardPage() {
  return (
    <Suspense fallback={<TeacherDashboardPageSkeleton />}>
      <TeacherDashboardView />
    </Suspense>
  );
}
