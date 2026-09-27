import type { Metadata } from "next";
import { Suspense } from "react";
import {
  RoutinesManagementView,
  RoutinesSkeleton,
} from "@/components/modules/routines";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `My Class Routine & Timetable | ${siteConfig.name}`,
  description:
    "View your personal weekly teaching timetable, classroom assignments, and batch routines.",
};

export default function TeacherRoutinesPage() {
  return (
    <Suspense fallback={<RoutinesSkeleton />}>
      <RoutinesManagementView portalRole="TEACHER" />
    </Suspense>
  );
}
