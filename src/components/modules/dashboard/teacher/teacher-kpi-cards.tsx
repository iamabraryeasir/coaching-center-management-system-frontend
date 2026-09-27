"use client";

import { CalendarDays, GraduationCap, Layers, UserCheck } from "lucide-react";
import Link from "next/link";
import {
  useTeacherDashboardAttendanceSummary,
  useTeacherDashboardBatches,
  useTeacherDashboardExams,
  useTeacherDashboardSchedule,
} from "@/hooks";
import type { DayOfWeek } from "@/types";

const DAYS_MAP: Record<number, DayOfWeek> = {
  0: "SUNDAY",
  1: "MONDAY",
  2: "TUESDAY",
  3: "WEDNESDAY",
  4: "THURSDAY",
  5: "FRIDAY",
  6: "SATURDAY",
};

export function TeacherKpiCards() {
  const { data: batches } = useTeacherDashboardBatches();
  const { data: scheduleData } = useTeacherDashboardSchedule();
  const { data: exams } = useTeacherDashboardExams();
  const { data: attendanceSummary } = useTeacherDashboardAttendanceSummary();

  // 1. Assigned Batches
  const activeBatchesCount = batches.filter(
    (b) => b.status === "ONGOING" || b.status === "UPCOMING",
  ).length;
  const totalBatchesCount = batches.length;

  // 2. Classes Today
  const todayDayOfWeek = DAYS_MAP[new Date().getDay()];
  const todayScheduleGroup = scheduleData?.schedule?.find(
    (g) => g.dayOfWeek === todayDayOfWeek,
  );
  const todaySlots = todayScheduleGroup?.slots || [];

  // Determine next class
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const nextSlot = todaySlots
    .map((slot) => {
      const [h, m] = slot.startTime.split(":").map(Number);
      return { slot, startMinutes: h * 60 + m };
    })
    .filter((s) => s.startMinutes > currentMinutes)
    .sort((a, b) => a.startMinutes - b.startMinutes)[0]?.slot;

  let classesTodaySubtext = "No classes scheduled today";
  if (todaySlots.length > 0) {
    if (nextSlot) {
      classesTodaySubtext = `Next: ${nextSlot.subject || "Lecture"} at ${nextSlot.startTime}`;
    } else {
      classesTodaySubtext = `All ${todaySlots.length} lectures completed`;
    }
  }

  // 3. Upcoming Exams
  const upcomingExams = exams.filter((e) => e.status === "UPCOMING");
  const draftExamsNeedingMarks = exams.filter(
    (e) => e.status === "COMPLETED" && e.resultStatus === "DRAFT",
  );

  let examsSubtext = `${draftExamsNeedingMarks.length} pending grading`;
  if (draftExamsNeedingMarks.length === 0) {
    examsSubtext = `${exams.length} total scheduled`;
  }

  // 4. Personal Attendance
  const stats = attendanceSummary?.stats;
  const attendanceRate =
    stats && stats.attendanceRate !== undefined
      ? `${stats.attendanceRate.toFixed(0)}%`
      : "100%";
  const attendanceSubtext = stats
    ? `${stats.presentDays} Present · ${stats.lateDays} Late`
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
          {totalBatchesCount}
        </p>
        <p className="text-xs text-muted-foreground">
          {activeBatchesCount} active classroom groups
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
          {todaySlots.length}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {classesTodaySubtext}
        </p>
      </Link>

      {/* 3. Upcoming Exams */}
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
          {upcomingExams.length}
        </p>
        <p className="truncate text-xs text-muted-foreground">{examsSubtext}</p>
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
