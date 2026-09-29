"use client";

import { Suspense } from "react";
import { StudentDashboardPageSkeleton } from "./student-dashboard-skeletons";
import { StudentEnrolledBatchesCard } from "./student-enrolled-batches-card";
import { StudentHeroBanner } from "./student-hero-banner";
import { StudentKpiCards } from "./student-kpi-cards";
import { StudentQuickActionsBar } from "./student-quick-actions-bar";
import { StudentRecentExamsCard } from "./student-recent-exams-card";
import { StudentTodayClassesCard } from "./student-today-classes-card";
import { StudentTuitionAlertCard } from "./student-tuition-alert-card";

function StudentDashboardContent() {
  return (
    <div className="space-y-6">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <StudentHeroBanner />
        </div>
      </div>

      {/* Quick Actions Strip */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="text-xs font-semibold text-muted-foreground">
          Quick Access:
        </span>
        <StudentQuickActionsBar />
      </div>

      {/* 2. Urgent Billing Alert */}
      <StudentTuitionAlertCard />

      {/* 3. 4-KPI Metric Ribbon */}
      <StudentKpiCards />

      {/* 4. Schedule & Evaluation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <StudentTodayClassesCard />
        </div>
        <div>
          <StudentRecentExamsCard />
        </div>
      </div>

      {/* 5. Active Enrolled Batches */}
      <StudentEnrolledBatchesCard />
    </div>
  );
}

export function StudentDashboardView() {
  return (
    <Suspense fallback={<StudentDashboardPageSkeleton />}>
      <StudentDashboardContent />
    </Suspense>
  );
}
