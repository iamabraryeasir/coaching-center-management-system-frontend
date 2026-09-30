"use client";

import {
  ArrowUpRight,
  BookOpen,
  Calendar,
  ChevronRight,
  Layers,
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
import { useTeacherDashboard } from "@/hooks";
import type { TeacherAssignedBatchSummary } from "@/types";

export function TeacherAssignedBatchesCard() {
  const { data } = useTeacherDashboard();

  const batches: TeacherAssignedBatchSummary[] = data?.assignedBatches || [];

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Layers className="size-5 text-indigo-600 dark:text-indigo-400" />
            <span>Assigned Batches</span>
          </CardTitle>
          <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            {batches.length} Classes
          </span>
        </div>
        <CardDescription>
          Active classroom groups and student enrollments under your instruction
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 space-y-3">
        {batches.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 p-8 text-center">
            <div className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground mb-3">
              <BookOpen className="size-5" />
            </div>
            <p className="font-semibold text-sm text-foreground">
              No assigned batches yet
            </p>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs">
              Contact administration if you are expecting new batch assignments
              for this semester.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {batches.map((b) => (
              <div
                key={b.batchId}
                className="flex flex-col justify-between rounded-xl border border-border/80 bg-card p-4 transition-all hover:border-primary/40 hover:bg-muted/20 space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-semibold text-sm text-foreground truncate">
                      {b.batchName}
                    </h4>
                    <Badge
                      variant="outline"
                      className={`text-[10px] px-1.5 py-0 ${
                        b.status === "ONGOING"
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                          : "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300"
                      }`}
                    >
                      {b.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {b.subject || "All Subjects"}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
                  <div className="flex items-center gap-1.5">
                    <Users className="size-3.5 text-primary" />
                    <span>{b.studentCount} Students</span>
                  </div>
                  {b.weeklyClassesCount > 0 && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="size-3.5 text-muted-foreground" />
                      <span>{b.weeklyClassesCount} classes/wk</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Link
                    href={`/dashboard/teacher/batches/${b.batchId}`}
                    className={buttonVariants({
                      variant: "outline",
                      size: "sm",
                      className: "flex-1 h-7 text-xs font-normal",
                    })}
                  >
                    <span>View Roster</span>
                    <ArrowUpRight className="size-3 ml-1" />
                  </Link>
                  <Link
                    href={`/dashboard/teacher/attendance?batchId=${b.batchId}`}
                    className={buttonVariants({
                      size: "sm",
                      className: "flex-1 h-7 text-xs font-normal",
                    })}
                  >
                    <span>Attendance</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t border-border/60 pt-3">
        <Link
          href="/dashboard/teacher/batches"
          className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          <span>View all assigned batches</span>
          <ChevronRight className="size-3.5" />
        </Link>
      </CardFooter>
    </Card>
  );
}
