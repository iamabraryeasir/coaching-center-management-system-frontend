import type { Metadata } from "next";
import { Suspense } from "react";
import { AttendanceManagementView } from "@/components/modules/attendance";
import { Skeleton } from "@/components/ui/skeleton";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Daily Attendance Tracking | ${siteConfig.name}`,
  description:
    "Record daily batch attendance for enrolled students, inspect historical attendance records, and manage teacher staff check-ins.",
};

function AttendancePageFallback() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-9 w-60 rounded-lg" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Skeleton className="h-20 rounded-xl" />
        <Skeleton className="h-20 rounded-xl" />
        <Skeleton className="h-20 rounded-xl" />
        <Skeleton className="h-20 rounded-xl" />
      </div>

      <Skeleton className="h-16 w-full rounded-xl" />
      <Skeleton className="h-96 w-full rounded-xl" />
    </div>
  );
}

export default function AdminAttendancePage() {
  return (
    <Suspense fallback={<AttendancePageFallback />}>
      <AttendanceManagementView defaultView="student" allowTeacherView={true} />
    </Suspense>
  );
}
