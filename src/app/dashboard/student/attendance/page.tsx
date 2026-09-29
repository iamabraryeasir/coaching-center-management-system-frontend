import type { Metadata } from "next";
import { Suspense } from "react";
import {
  StudentAttendanceSkeleton,
  StudentAttendanceView,
} from "@/components/modules/attendance";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `My Attendance & Compliance | ${siteConfig.name}`,
  description:
    "Monitor your lecture attendance compliance rate, check-in records, and absence history.",
};

export default function StudentAttendancePage() {
  return (
    <Suspense fallback={<StudentAttendanceSkeleton />}>
      <StudentAttendanceView />
    </Suspense>
  );
}
