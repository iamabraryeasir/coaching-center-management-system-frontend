"use client";

import { Suspense } from "react";
import { TeacherSelfCheckInCard } from "@/components/modules/attendance";
import { useAuth } from "@/hooks";
import { TeacherKpiCards } from "./teacher-kpi-cards";
import { TeacherPermissionsCard } from "./teacher-permissions-card";
import { TeacherQuickActionsBar } from "./teacher-quick-actions-bar";
import {
  TeacherKpiCardsSkeleton,
  TeacherPermissionsSkeleton,
  TeacherTodayScheduleSkeleton,
} from "./teacher-skeletons";
import { TeacherTodayScheduleCard } from "./teacher-today-schedule-card";

export function TeacherDashboardView() {
  const { user } = useAuth();
  const teacherName = user?.name || "Teacher";

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Welcome back, {teacherName} 👋
          </h2>
        </div>

        <TeacherQuickActionsBar />
      </div>

      {/* Daily Campus Check-in */}
      <TeacherSelfCheckInCard />

      {/* Real-time KPI Metric Summary */}
      <Suspense fallback={<TeacherKpiCardsSkeleton />}>
        <TeacherKpiCards />
      </Suspense>

      {/* Academic Schedule & Authorizations Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Suspense fallback={<TeacherTodayScheduleSkeleton />}>
          <TeacherTodayScheduleCard />
        </Suspense>

        <Suspense fallback={<TeacherPermissionsSkeleton />}>
          <TeacherPermissionsCard />
        </Suspense>
      </div>
    </div>
  );
}
