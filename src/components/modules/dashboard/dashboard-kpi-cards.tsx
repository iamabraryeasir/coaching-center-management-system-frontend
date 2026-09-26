"use client";

import {
  AlertCircle,
  AlertTriangle,
  Banknote,
  BookOpen,
  CircleDollarSign,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";

import { useDashboardMonthlySummary, useDashboardToday } from "@/hooks";

function formatTaka(amount: number): string {
  return `৳ ${amount.toLocaleString("en-BD")}`;
}

export function DashboardKpiCards() {
  const { data: today } = useDashboardToday();
  const { data: monthly } = useDashboardMonthlySummary();

  const { todayCollection, attendance, pendingActions } = today;
  const { financial, academic } = monthly;

  const studentAttendanceDisplay =
    attendance.student.attendanceRate !== null
      ? `${attendance.student.attendanceRate.toFixed(1)}%`
      : "Not recorded";

  const studentAttendanceSubtext =
    attendance.student.attendanceRate !== null
      ? `${attendance.student.presentCount + attendance.student.lateCount} / ${attendance.student.totalMarked} students`
      : "No attendance recorded today";

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {/* Card 1 — Today's Collection */}
      <div className="space-y-3 rounded-xl border border-border/80 bg-card p-5 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            Today&apos;s Collection
          </span>
          <div className="flex size-8 items-center justify-center rounded-lg bg-green-500/10 text-green-600">
            <Banknote className="size-4" />
          </div>
        </div>
        <p className="font-heading text-2xl font-bold text-foreground">
          {formatTaka(todayCollection.totalAmount)}
        </p>
        <p className="text-xs text-muted-foreground">
          {todayCollection.transactionCount} transactions
        </p>
      </div>

      {/* Card 2 — Student Attendance */}
      <div className="space-y-3 rounded-xl border border-border/80 bg-card p-5 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            Student Attendance
          </span>
          <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
            <Users className="size-4" />
          </div>
        </div>
        <p className="font-heading text-2xl font-bold text-foreground">
          {studentAttendanceDisplay}
        </p>
        <p className="text-xs text-muted-foreground">
          {studentAttendanceSubtext}
        </p>
      </div>

      {/* Card 3 — Teacher Check-ins */}
      <div className="space-y-3 rounded-xl border border-border/80 bg-card p-5 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            Teacher Check-ins
          </span>
          <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600">
            <UserCheck className="size-4" />
          </div>
        </div>
        <p className="font-heading text-2xl font-bold text-foreground">
          {attendance.teacher.checkedInCount} /{" "}
          {attendance.teacher.totalTeachers}
        </p>
        <p className="text-xs text-muted-foreground">
          {attendance.teacher.absentCount} absent today
        </p>
      </div>

      {/* Card 4 — Pending Actions */}
      <div className="space-y-3 rounded-xl border border-border/80 bg-card p-5 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            Pending Actions
          </span>
          <div
            className={`flex size-8 items-center justify-center rounded-lg ${
              pendingActions.total > 0
                ? "bg-amber-500/10 text-amber-600"
                : "bg-green-500/10 text-green-600"
            }`}
          >
            <AlertCircle className="size-4" />
          </div>
        </div>
        <p className="font-heading text-2xl font-bold text-foreground">
          {pendingActions.total}
        </p>
        <p className="text-xs text-muted-foreground">
          {pendingActions.studentApplications} applications ·{" "}
          {pendingActions.enrollmentRequests} enrollments
        </p>
      </div>

      {/* Card 5 — Expected Revenue */}
      <div className="space-y-3 rounded-xl border border-border/80 bg-card p-5 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            Expected Revenue
          </span>
          <div className="flex size-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600">
            <TrendingUp className="size-4" />
          </div>
        </div>
        <p className="font-heading text-2xl font-bold text-foreground">
          {formatTaka(financial.expectedRevenue)}
        </p>
        <p className="text-xs text-muted-foreground">
          {monthly.billingPeriodText}
        </p>
      </div>

      {/* Card 6 — Collected */}
      <div className="space-y-3 rounded-xl border border-border/80 bg-card p-5 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            Collected
          </span>
          <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
            <CircleDollarSign className="size-4" />
          </div>
        </div>
        <p className="font-heading text-2xl font-bold text-foreground">
          {formatTaka(financial.collectedAmount)}
        </p>
        <p className="text-xs text-muted-foreground">
          {financial.collectionRate.toFixed(1)}% collection rate
        </p>
      </div>

      {/* Card 7 — Outstanding Dues */}
      <div className="space-y-3 rounded-xl border border-border/80 bg-card p-5 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            Outstanding Dues
          </span>
          <div
            className={`flex size-8 items-center justify-center rounded-lg ${
              financial.totalDue > 0
                ? "bg-red-500/10 text-red-600"
                : "bg-muted text-muted-foreground"
            }`}
          >
            <AlertTriangle className="size-4" />
          </div>
        </div>
        <p className="font-heading text-2xl font-bold text-foreground">
          {formatTaka(financial.totalDue)}
        </p>
        <p className="text-xs text-muted-foreground">
          {financial.unpaidCount} defaulters
        </p>
      </div>

      {/* Card 8 — Exams This Month */}
      <div className="space-y-3 rounded-xl border border-border/80 bg-card p-5 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            Exams This Month
          </span>
          <div className="flex size-8 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600">
            <BookOpen className="size-4" />
          </div>
        </div>
        <p className="font-heading text-2xl font-bold text-foreground">
          {academic.totalExams}
        </p>
        <p className="text-xs text-muted-foreground">
          {academic.publishedResults} results published
        </p>
      </div>
    </div>
  );
}
