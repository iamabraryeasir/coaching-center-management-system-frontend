"use client";

import { Suspense } from "react";
import { useAuth } from "@/hooks";
import { TeacherAssignedBatchesCard } from "./teacher-assigned-batches-card";
import { TeacherKpiCards } from "./teacher-kpi-cards";
import { TeacherPendingExamsCard } from "./teacher-pending-exams-card";
import { TeacherPermissionsCard } from "./teacher-permissions-card";
import { TeacherQuickActionsBar } from "./teacher-quick-actions-bar";
import {
  TeacherAssignedBatchesSkeleton,
  TeacherKpiCardsSkeleton,
  TeacherPendingExamsSkeleton,
  TeacherPermissionsSkeleton,
  TeacherTodayScheduleSkeleton,
} from "./teacher-skeletons";
import { TeacherTodayScheduleCard } from "./teacher-today-schedule-card";

export function TeacherDashboardView() {
  const { user } = useAuth();
  const teacherName = user?.name || "Teacher";

  return (
    <div className="space-y-6">
      {/* Welcome Header & Quick Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Welcome back, {teacherName} 👋
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Faculty workspace: overview of today's schedule, gradebooks, and
            assigned batches.
          </p>
        </div>

        <TeacherQuickActionsBar />
      </div>

      {/* Real-time KPI Metric Summary */}
      <Suspense fallback={<TeacherKpiCardsSkeleton />}>
        <TeacherKpiCards />
      </Suspense>

      {/* Academic Schedule & Administrative Authorizations Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Suspense fallback={<TeacherTodayScheduleSkeleton />}>
          <TeacherTodayScheduleCard />
        </Suspense>

        <Suspense fallback={<TeacherPermissionsSkeleton />}>
          <TeacherPermissionsCard />
        </Suspense>
      </div>

      {/* Pending Exams & Assigned Batches Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Suspense fallback={<TeacherPendingExamsSkeleton />}>
          <TeacherPendingExamsCard />
        </Suspense>

        <Suspense fallback={<TeacherAssignedBatchesSkeleton />}>
          <TeacherAssignedBatchesCard />
        </Suspense>
      </div>
    </div>
  );
}
