"use client";

import { Lock } from "lucide-react";
import { Suspense } from "react";
import { AttendanceManagementView } from "@/components/modules/attendance";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks";

function AttendancePageFallback() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
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

export default function TeacherAttendancePage() {
  const { hasPermission, isLoading } = useAuth();

  if (isLoading) {
    return <AttendancePageFallback />;
  }

  // Verify delegated attendance permission
  if (!hasPermission("MANAGE_ATTENDANCE")) {
    return (
      <div className="rounded-xl border border-dashed border-border/80 bg-card/60 p-12 text-center shadow-xs flex flex-col items-center justify-center max-w-md mx-auto my-12">
        <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-3">
          <Lock className="size-7" />
        </div>
        <h3 className="font-heading font-semibold text-lg text-foreground">
          Attendance Access Restricted
        </h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm leading-relaxed">
          Your account does not have the delegated{" "}
          <strong>MANAGE_ATTENDANCE</strong> permission authorized by
          institution administrators.
        </p>
      </div>
    );
  }

  return (
    <Suspense fallback={<AttendancePageFallback />}>
      {/* Teachers can record student attendance for their batches */}
      <AttendanceManagementView
        defaultView="student"
        allowTeacherView={false}
      />
    </Suspense>
  );
}
