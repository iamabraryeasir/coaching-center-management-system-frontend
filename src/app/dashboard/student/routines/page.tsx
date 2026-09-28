import type { Metadata } from "next";
import { Suspense } from "react";
import {
  RoutinesSkeleton,
  StudentRoutinesView,
} from "@/components/modules/routines";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Class Routine & Timetable | ${siteConfig.name}`,
  description:
    "View your combined weekly class timetable, room assignments, and today's upcoming lectures.",
};

export default function StudentRoutinesPage() {
  return (
    <Suspense fallback={<RoutinesSkeleton />}>
      <StudentRoutinesView />
    </Suspense>
  );
}
