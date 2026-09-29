"use client";

import {
  ArrowRight,
  CalendarDays,
  Clock,
  MapPin,
  Sparkles,
  User,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useStudentDashboard } from "@/hooks";
import { cn } from "@/lib/utils";

function getClassStatus(startTime: string, endTime: string) {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const parseToMinutes = (timeStr: string) => {
    const [h, m] = timeStr.split(":").map(Number);
    return (h || 0) * 60 + (m || 0);
  };

  const startMin = parseToMinutes(startTime);
  const endMin = parseToMinutes(endTime);

  if (currentMinutes >= startMin && currentMinutes <= endMin) {
    return {
      label: "In Progress",
      color:
        "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
      pulse: true,
    };
  }
  if (currentMinutes < startMin) {
    const diff = startMin - currentMinutes;
    const diffText =
      diff > 60 ? `in ${Math.floor(diff / 60)}h ${diff % 60}m` : `in ${diff}m`;
    return {
      label: `Starts ${diffText}`,
      color:
        "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
      pulse: false,
    };
  }
  return {
    label: "Completed",
    color: "bg-muted text-muted-foreground border-border/60",
    pulse: false,
  };
}

export function StudentTodayClassesCard() {
  const { data: dashboard } = useStudentDashboard();
  const todayClasses = dashboard.todayClasses || [];

  const todayDateFormatted = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(new Date());

  return (
    <Card className="bg-card border-border/80 shadow-2xs overflow-hidden">
      <CardHeader className="border-b border-border/60 pb-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <CalendarDays className="size-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold font-heading">
                Today's Class Schedule
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                {todayDateFormatted}
              </CardDescription>
            </div>
          </div>

          <Badge
            variant="outline"
            className="text-[10px] font-semibold tracking-wider uppercase"
          >
            {todayClasses.length} Class{todayClasses.length === 1 ? "" : "es"}{" "}
            Today
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 space-y-3">
        {todayClasses.length === 0 ? (
          <div className="text-center py-8 px-4 border border-dashed rounded-xl space-y-2">
            <div className="size-10 rounded-full bg-muted/60 flex items-center justify-center mx-auto text-muted-foreground">
              <Sparkles className="size-5" />
            </div>
            <p className="text-sm font-medium text-foreground">
              No classes scheduled for today
            </p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Take this time to review previous lecture notes, complete
              homework, or inspect your full weekly routine timetable.
            </p>
            <div className="pt-2">
              <Link
                href="/dashboard/student/routines"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "text-xs gap-1.5 h-8",
                )}
              >
                <span>View Full Weekly Timetable</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {todayClasses.map((slot) => {
              const status = getClassStatus(slot.startTime, slot.endTime);

              return (
                <div
                  key={slot.id || `${slot.subject}-${slot.startTime}`}
                  className="rounded-xl border border-border/70 bg-card hover:border-primary/40 transition-colors p-3.5 sm:p-4 space-y-2 shadow-2xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-heading text-sm font-bold text-foreground">
                          {slot.subject}
                        </span>
                        <span className="text-xs text-muted-foreground font-medium">
                          ({slot.batchName})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border",
                          status.color,
                        )}
                      >
                        {status.pulse && (
                          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        )}
                        <span>{status.label}</span>
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-border/50 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Clock className="size-3.5 text-primary shrink-0" />
                      <span className="font-medium text-foreground">
                        {slot.startTime} – {slot.endTime}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <MapPin className="size-3.5 text-primary shrink-0" />
                      <span>
                        {slot.room ? `Room ${slot.room}` : "Room Assigned"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <User className="size-3.5 text-primary shrink-0" />
                      <span className="truncate">
                        {slot.teacherName || "Faculty Instructor"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
