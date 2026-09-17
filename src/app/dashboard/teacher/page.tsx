"use client";

import {
  CalendarDays,
  CheckCircle2,
  GraduationCap,
  Layers,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks";
import { cn } from "@/lib/utils";

export default function TeacherDashboardPage() {
  const { user, hasPermission } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Welcome, {user?.name || "Faculty Member"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {user?.teacherProfile?.designation || "Instructor"} &bull;{" "}
            {user?.teacherProfile?.specialization || "General Faculty"}
          </p>
        </div>

        {hasPermission("MANAGE_ATTENDANCE") && (
          <Link
            href="/dashboard/teacher/attendance"
            className={cn(
              buttonVariants({ variant: "default", size: "sm" }),
              "gap-1.5 shadow-sm font-medium",
            )}
          >
            <UserCheck className="size-4" />
            <span>Mark Attendance</span>
          </Link>
        )}
      </div>

      {/* Teacher Metric Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Assigned Batches
            </CardTitle>
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Layers className="size-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">4</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active classroom groups
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Classes Today
            </CardTitle>
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <CalendarDays className="size-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">3</div>
            <p className="text-xs text-muted-foreground mt-1">
              Next: Physics at 10:00 AM
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Upcoming Exams
            </CardTitle>
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <GraduationCap className="size-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">2</div>
            <p className="text-xs text-muted-foreground mt-1">
              Pending marks entry: 1
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule and Academic Permissions */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Today's Class Schedule</CardTitle>
            <CardDescription>
              Your assigned lecture timetable for today
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-border/80 bg-muted/20 p-3">
              <div className="space-y-0.5">
                <span className="font-semibold text-sm text-foreground">
                  Physics (Batch Alpha)
                </span>
                <p className="text-xs text-muted-foreground">
                  Room 102 &bull; 10:00 AM - 11:30 AM
                </p>
              </div>
              <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                Next
              </span>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border/60 p-3">
              <div className="space-y-0.5">
                <span className="font-medium text-sm text-foreground">
                  Higher Math (Batch Beta)
                </span>
                <p className="text-xs text-muted-foreground">
                  Room 105 &bull; 12:00 PM - 01:30 PM
                </p>
              </div>
              <span className="text-xs text-muted-foreground">Upcoming</span>
            </div>
          </CardContent>
        </Card>

        {/* Permissions & Profile Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Faculty Permissions</CardTitle>
            <CardDescription>
              Administrative actions authorized by institution
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2.5 text-sm">
              <CheckCircle2
                className={cn(
                  "size-4",
                  hasPermission("MANAGE_ATTENDANCE")
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-muted-foreground opacity-40",
                )}
              />
              <span className="text-foreground">Attendance Management</span>
            </div>

            <div className="flex items-center gap-2.5 text-sm">
              <CheckCircle2
                className={cn(
                  "size-4",
                  hasPermission("MANAGE_EXAMS")
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-muted-foreground opacity-40",
                )}
              />
              <span className="text-foreground">Exams & Mark Entry</span>
            </div>

            <div className="flex items-center gap-2.5 text-sm">
              <CheckCircle2
                className={cn(
                  "size-4",
                  hasPermission("MANAGE_ROUTINES")
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-muted-foreground opacity-40",
                )}
              />
              <span className="text-foreground">Routine Modification</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
