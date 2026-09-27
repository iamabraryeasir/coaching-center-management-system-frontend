"use client";

import { Calendar, ChevronRight, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTeacherDashboardSchedule } from "@/hooks";
import { cn } from "@/lib/utils";
import type { DayOfWeek, RoutineSlot } from "@/types";

const DAYS_MAP: Record<number, DayOfWeek> = {
  0: "SUNDAY",
  1: "MONDAY",
  2: "TUESDAY",
  3: "WEDNESDAY",
  4: "THURSDAY",
  5: "FRIDAY",
  6: "SATURDAY",
};

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

export function TeacherTodayScheduleCard() {
  const { data: scheduleData } = useTeacherDashboardSchedule();

  const todayIndex = new Date().getDay();
  const todayDayOfWeek = DAYS_MAP[todayIndex];
  const todayScheduleGroup = scheduleData?.schedule?.find(
    (g) => g.dayOfWeek === todayDayOfWeek,
  );
  const todaySlots: RoutineSlot[] = todayScheduleGroup?.slots || [];

  // Sort chronologically by startTime
  const sortedSlots = [...todaySlots].sort((a, b) =>
    a.startTime.localeCompare(b.startTime),
  );

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Find next slot index
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
          Your assigned lecture timetable for today
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 space-y-3">
        {sortedSlots.length === 0 ? (
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
          sortedSlots.map((slot) => {
            const [startH, startM] = slot.startTime.split(":").map(Number);
            const [endH, endM] = slot.endTime.split(":").map(Number);
            const slotStartMin = startH * 60 + startM;
            const slotEndMin = endH * 60 + endM;

            const isCompleted = currentMinutes > slotEndMin;
            const isActiveNow =
              currentMinutes >= slotStartMin && currentMinutes <= slotEndMin;
            const isNext = !isCompleted && !isActiveNow && !foundNext;

            if (isNext) {
              foundNext = true;
            }

            return (
              <div
                key={slot.id}
                className={cn(
                  "flex items-center justify-between rounded-lg border p-3.5 transition-colors",
                  isActiveNow
                    ? "border-emerald-500/50 bg-emerald-500/5 dark:bg-emerald-950/20"
                    : isNext
                      ? "border-blue-500/50 bg-blue-500/5 dark:bg-blue-950/20"
                      : isCompleted
                        ? "border-border/50 bg-muted/20 opacity-70"
                        : "border-border/80 bg-card",
                )}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-foreground">
                      {slot.subject || "General Lecture"}
                    </span>
                    {slot.batch?.name && (
                      <span className="rounded bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                        {slot.batch.name}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="size-3.5" />
                      <span>
                        {formatDisplayTime(slot.startTime)} -{" "}
                        {formatDisplayTime(slot.endTime)}
                      </span>
                    </div>

                    {slot.room && (
                      <div className="flex items-center gap-1">
                        <MapPin className="size-3.5" />
                        <span>Room {slot.room}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  {isActiveNow ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active Now
                    </span>
                  ) : isNext ? (
                    <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
                      Next
                    </span>
                  ) : isCompleted ? (
                    <span className="text-xs text-muted-foreground">Done</span>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      Upcoming
                    </span>
                  )}
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
