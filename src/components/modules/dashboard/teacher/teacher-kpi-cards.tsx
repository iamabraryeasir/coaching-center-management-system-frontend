"use client";

import {
  CalendarDays,
  CheckCircle2,
  Clock,
  GraduationCap,
  Layers,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { useTeacherDashboard } from "@/hooks";

export function TeacherKpiCards() {
  const { data } = useTeacherDashboard();

  const kpis = data?.kpis;
  const todayClasses = data?.todayClasses || [];
  const personalAttendance = data?.personalAttendance;

  // 1. Assigned Batches
  const totalBatches = kpis?.assignedBatchesCount ?? 0;
  const activeBatches = kpis?.activeBatchesCount ?? totalBatches;
  const totalStudents = kpis?.totalStudentsTaught;

  // 2. Classes Today & Attendance Progress
  const totalClassesToday = kpis?.classesTodayCount ?? todayClasses.length;
  const attendanceCompleted =
    kpis?.attendanceCompletedClassesCount ??
    todayClasses.filter((c) => c.isAttendanceTaken).length;

  let classesTodaySubtext = "No classes scheduled today";
  if (totalClassesToday > 0) {
    if (attendanceCompleted === totalClassesToday) {
      classesTodaySubtext = `All ${totalClassesToday} attendance marked`;
    } else {
      classesTodaySubtext = `${attendanceCompleted} of ${totalClassesToday} attendance marked`;
    }
  }

  // 3. Upcoming Exams & Pending Marks
  const upcomingExams = kpis?.upcomingExamsCount ?? 0;
  const pendingMarksExams = kpis?.pendingMarksExamsCount ?? 0;

  let examsSubtext = `${upcomingExams} upcoming tests`;
  if (pendingMarksExams > 0) {
    examsSubtext = `${pendingMarksExams} pending marks entry`;
  }

  // 4. Personal Attendance Rate
  const attendanceRate =
    kpis?.personalAttendanceRate !== undefined
      ? `${kpis.personalAttendanceRate.toFixed(0)}%`
      : personalAttendance?.attendanceRate !== undefined
        ? `${personalAttendance.attendanceRate.toFixed(0)}%`
        : "100%";

  const attendanceSubtext = personalAttendance
    ? `${personalAttendance.presentDays} Present · ${personalAttendance.lateDays} Late`
    : kpis?.isCheckedInToday
      ? "Checked in today"
      : "On-time check-in record";

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {/* 1. Assigned Batches */}
      <Link
        href="/dashboard/teacher/batches"
        className="group space-y-3 rounded-xl border border-border/80 bg-card p-5 shadow-2xs transition-all hover:border-primary/40 hover:bg-muted/30"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            Assigned Batches
          </span>
          <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Layers className="size-4" />
          </div>
        </div>
        <p className="font-heading text-2xl font-bold text-foreground">
          {totalBatches}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {totalStudents !== undefined
            ? `${totalStudents} students · ${activeBatches} active`
            : `${activeBatches} active classroom groups`}
        </p>
      </Link>

      {/* 2. Classes Today */}
      <Link
        href="/dashboard/teacher/routines"
        className="group space-y-3 rounded-xl border border-border/80 bg-card p-5 shadow-2xs transition-all hover:border-primary/40 hover:bg-muted/30"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            Classes Today
          </span>
          <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <CalendarDays className="size-4" />
          </div>
        </div>
        <p className="font-heading text-2xl font-bold text-foreground">
          {totalClassesToday}
        </p>
        <div className="flex items-center gap-1.5 truncate text-xs text-muted-foreground">
          {totalClassesToday > 0 &&
          attendanceCompleted === totalClassesToday ? (
            <CheckCircle2 className="size-3 text-emerald-600 shrink-0" />
          ) : totalClassesToday > 0 ? (
            <Clock className="size-3 text-blue-600 shrink-0" />
          ) : null}
          <span className="truncate">{classesTodaySubtext}</span>
        </div>
      </Link>

      {/* 3. Upcoming Exams & Marks Pending */}
      <Link
        href="/dashboard/teacher/exams"
        className="group space-y-3 rounded-xl border border-border/80 bg-card p-5 shadow-2xs transition-all hover:border-primary/40 hover:bg-muted/30"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            Upcoming Exams
          </span>
          <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <GraduationCap className="size-4" />
          </div>
        </div>
        <p className="font-heading text-2xl font-bold text-foreground">
          {upcomingExams}
        </p>
        <p
          className={`truncate text-xs ${
            pendingMarksExams > 0
              ? "text-amber-600 dark:text-amber-400 font-medium"
              : "text-muted-foreground"
          }`}
        >
          {examsSubtext}
        </p>
      </Link>

      {/* 4. Personal Attendance Rate */}
      <Link
        href="/dashboard/teacher/settings"
        className="group space-y-3 rounded-xl border border-border/80 bg-card p-5 shadow-2xs transition-all hover:border-primary/40 hover:bg-muted/30"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            My Attendance
          </span>
          <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <UserCheck className="size-4" />
          </div>
        </div>
        <p className="font-heading text-2xl font-bold text-foreground">
          {attendanceRate}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {attendanceSubtext}
        </p>
      </Link>
    </div>
  );
}
