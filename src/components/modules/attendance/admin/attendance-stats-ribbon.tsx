"use client";

import {
  CalendarOff,
  CheckCircle2,
  Clock,
  HelpCircle,
  Users,
  XCircle,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface AttendanceStatsRibbonProps {
  totalEnrolled: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  excusedCount?: number;
  leaveCount?: number;
  showExcused?: boolean;
  showLeave?: boolean;
  attendanceRate: number;
  isLoading?: boolean;
  label?: string;
}

export function AttendanceStatsRibbon({
  totalEnrolled,
  presentCount,
  absentCount,
  lateCount,
  excusedCount = 0,
  leaveCount = 0,
  showExcused = false,
  showLeave = false,
  attendanceRate,
  isLoading = false,
  label = "Students",
}: AttendanceStatsRibbonProps) {
  const activeCardsCount = 4 + (showExcused ? 1 : 0) + (showLeave ? 1 : 0);

  if (isLoading) {
    const skeletonKeys = Array.from(
      { length: activeCardsCount },
      (_, i) => `sk-${i + 1}`,
    );

    return (
      <div
        className={cn(
          "grid grid-cols-2 gap-3",
          activeCardsCount >= 6
            ? "sm:grid-cols-3 lg:grid-cols-6"
            : activeCardsCount === 5
              ? "sm:grid-cols-3 lg:grid-cols-5"
              : "sm:grid-cols-2 lg:grid-cols-4",
        )}
      >
        {skeletonKeys.map((skId) => (
          <div
            key={skId}
            className="rounded-xl border border-border/70 bg-card/60 p-3.5 shadow-2xs space-y-2"
          >
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-6 w-14" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-3",
        activeCardsCount >= 6
          ? "sm:grid-cols-3 lg:grid-cols-6"
          : activeCardsCount === 5
            ? "sm:grid-cols-3 lg:grid-cols-5"
            : "sm:grid-cols-2 lg:grid-cols-4",
      )}
    >
      {/* 1. Total Enrolled / Staff */}
      <div className="rounded-xl border border-border/70 bg-card/70 p-3.5 shadow-2xs flex items-center justify-between gap-2.5">
        <div>
          <p className="text-xs font-medium text-muted-foreground">
            Total {label}
          </p>
          <p className="text-xl font-bold text-foreground mt-0.5">
            {totalEnrolled}
          </p>
        </div>
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
          <Users className="size-4.5" />
        </div>
      </div>

      {/* 2. Present */}
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10 p-3.5 shadow-2xs flex items-center justify-between gap-2.5">
        <div>
          <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
            Present
          </p>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xl font-bold text-emerald-800 dark:text-emerald-200">
              {presentCount}
            </span>
            <span className="text-[11px] font-semibold text-emerald-600/90 dark:text-emerald-400">
              ({totalEnrolled > 0 ? Math.round(attendanceRate) : 0}%)
            </span>
          </div>
        </div>
        <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shrink-0">
          <CheckCircle2 className="size-4.5" />
        </div>
      </div>

      {/* 3. Absent */}
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 dark:bg-destructive/10 p-3.5 shadow-2xs flex items-center justify-between gap-2.5">
        <div>
          <p className="text-xs font-medium text-destructive dark:text-rose-400">
            Absent
          </p>
          <p className="text-xl font-bold text-destructive dark:text-rose-300 mt-0.5">
            {absentCount}
          </p>
        </div>
        <div className="flex size-9 items-center justify-center rounded-lg bg-destructive/15 text-destructive dark:text-rose-400 shrink-0">
          <XCircle className="size-4.5" />
        </div>
      </div>

      {/* 4. Late */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/10 p-3.5 shadow-2xs flex items-center justify-between gap-2.5">
        <div>
          <p className="text-xs font-medium text-amber-700 dark:text-amber-300">
            Late
          </p>
          <p className="text-xl font-bold text-amber-800 dark:text-amber-200 mt-0.5">
            {lateCount}
          </p>
        </div>
        <div className="flex size-9 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 shrink-0">
          <Clock className="size-4.5" />
        </div>
      </div>

      {/* 5. Excused */}
      {showExcused && (
        <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 dark:bg-sky-500/10 p-3.5 shadow-2xs flex items-center justify-between gap-2.5">
          <div>
            <p className="text-xs font-medium text-sky-700 dark:text-sky-300">
              Excused
            </p>
            <p className="text-xl font-bold text-sky-800 dark:text-sky-200 mt-0.5">
              {excusedCount}
            </p>
          </div>
          <div className="flex size-9 items-center justify-center rounded-lg bg-sky-500/15 text-sky-600 dark:text-sky-400 shrink-0">
            <HelpCircle className="size-4.5" />
          </div>
        </div>
      )}

      {/* 6. Leave */}
      {showLeave && (
        <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 dark:bg-purple-500/10 p-3.5 shadow-2xs flex items-center justify-between gap-2.5">
          <div>
            <p className="text-xs font-medium text-purple-700 dark:text-purple-300">
              Leave
            </p>
            <p className="text-xl font-bold text-purple-800 dark:text-purple-200 mt-0.5">
              {leaveCount}
            </p>
          </div>
          <div className="flex size-9 items-center justify-center rounded-lg bg-purple-500/15 text-purple-600 dark:text-purple-400 shrink-0">
            <CalendarOff className="size-4.5" />
          </div>
        </div>
      )}
    </div>
  );
}
