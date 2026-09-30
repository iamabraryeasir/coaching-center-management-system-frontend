"use client";

import {
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  MapPin,
  UserCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth, useTeacherDashboard } from "@/hooks";
import { cn } from "@/lib/utils";
import type { TeacherTodayClass } from "@/types";

function formatDisplayTime(timeStr: string) {
  if (!timeStr) return "";
  const [hStr, mStr] = timeStr.split(":");
  const h = Number(hStr);
  const m = Number(mStr);
  if (Number.isNaN(h) || Number.isNaN(m)) return timeStr;
  const period = h >= 12 ? "PM" : "AM";
  const displayHour = h % 12 || 12;
  return `${displayHour}:${String(m).padStart(2, "0")} ${period}`;
}

const DAYS_NAMES = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

export function TeacherTodayScheduleCard() {
  const { data } = useTeacherDashboard();
  const { hasPermission } = useAuth();
  const canManageAttendance = hasPermission("MANAGE_ATTENDANCE");

  const todayDayOfWeek = DAYS_NAMES[new Date().getDay()] || "TODAY";
  const todayClasses: TeacherTodayClass[] = data?.todayClasses || [];

  // Sort chronologically by startTime
  const sortedClasses = [...todayClasses].sort((a, b) =>
    a.startTime.localeCompare(b.startTime),
  );

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  let foundNext = false;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Today's Class Schedule</CardTitle>
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
            {todayDayOfWeek}
          </span>
        </div>
        <CardDescription>
          Your assigned lecture timetable and attendance tracking for today
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 space-y-3">
        {sortedClasses.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 p-8 text-center">
            <div className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground mb-3">
              <Calendar className="size-5" />
            </div>
            <p className="font-semibold text-sm text-foreground">
              No classes scheduled today
            </p>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs">
              You have no active lecture slots assigned for {todayDayOfWeek}.
              Use this time to prepare materials or review exams!
            </p>
          </div>
        ) : (
          sortedClasses.map((cls) => {
            const [startH, startM] = cls.startTime.split(":").map(Number);
            const [endH, endM] = cls.endTime.split(":").map(Number);
            const slotStartMin = (startH || 0) * 60 + (startM || 0);
            const slotEndMin = (endH || 0) * 60 + (endM || 0);

            const isCompleted = currentMinutes > slotEndMin;
            const isActiveNow =
              currentMinutes >= slotStartMin && currentMinutes <= slotEndMin;
            const isNext = !isCompleted && !isActiveNow && !foundNext;

            if (isNext) {
              foundNext = true;
            }

            return (
              <div
                key={cls.id}
                className={cn(
                  "flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border p-3.5 transition-colors",
                  isActiveNow
                    ? "border-emerald-500/50 bg-emerald-500/5 dark:bg-emerald-950/20"
                    : isNext
                      ? "border-blue-500/50 bg-blue-500/5 dark:bg-blue-950/20"
                      : isCompleted
                        ? "border-border/50 bg-muted/20 opacity-75"
                        : "border-border/80 bg-card",
                )}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-foreground">
                      {cls.subject || "General Lecture"}
                    </span>
                    {cls.batchName && (
                      <span className="rounded bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                        {cls.batchName}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                    <div className="flex items-center gap-1">
                      <Clock className="size-3.5" />
                      <span>
                        {formatDisplayTime(cls.startTime)} -{" "}
                        {formatDisplayTime(cls.endTime)}
                      </span>
                    </div>

                    {cls.room && (
                      <div className="flex items-center gap-1">
                        <MapPin className="size-3.5" />
                        <span>Room {cls.room}</span>
                      </div>
                    )}

                    {cls.totalStudents !== undefined && (
                      <div className="flex items-center gap-1">
                        <Users className="size-3.5" />
                        <span>{cls.totalStudents} Enrolled</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                  {/* Attendance State Badge / Action */}
                  {cls.isAttendanceTaken ? (
                    <Badge
                      variant="outline"
                      className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[11px] gap-1 py-0.5"
                    >
                      <CheckCircle2 className="size-3" />
                      <span>Attendance Taken</span>
                    </Badge>
                  ) : canManageAttendance ? (
                    <Link
                      href={`/dashboard/teacher/attendance?batchId=${cls.batchId}`}
                      className={buttonVariants({
                        variant: "outline",
                        size: "sm",
                        className:
                          "h-7 text-xs gap-1 border-primary/30 text-primary hover:bg-primary/10",
                      })}
                    >
                      <UserCheck className="size-3" />
                      <span>Take Attendance</span>
                    </Link>
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-muted-foreground text-[11px]"
                    >
                      Pending Attendance
                    </Badge>
                  )}

                  {/* Timing Status Pill */}
                  {isActiveNow ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live Now
                    </span>
                  ) : isNext ? (
                    <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                      Next
                    </span>
                  ) : null}
                </div>
              </div>
            );
          })
        )}
      </CardContent>

      <CardFooter className="border-t border-border/60 pt-3">
        <Link
          href="/dashboard/teacher/routines"
          className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          <span>View complete weekly timetable</span>
          <ChevronRight className="size-3.5" />
        </Link>
      </CardFooter>
    </Card>
  );
}
