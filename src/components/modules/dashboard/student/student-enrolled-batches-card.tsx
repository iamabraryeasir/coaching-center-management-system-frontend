"use client";

import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ChevronRight,
  Layers,
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

export function StudentEnrolledBatchesCard() {
  const { data: dashboard } = useStudentDashboard();
  const enrolledBatches = dashboard.enrolledBatches || [];

  return (
    <Card className="bg-card border-border/80 shadow-2xs overflow-hidden">
      <CardHeader className="border-b border-border/60 pb-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Layers className="size-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold font-heading">
                My Active Batches
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Enrolled academic cohorts and curriculum groups
              </CardDescription>
            </div>
          </div>

          <Link
            href="/dashboard/student/batches"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "text-xs gap-1 h-7 text-primary hover:text-primary px-2",
            )}
          >
            <span>Course Catalog</span>
            <ChevronRight className="size-3" />
          </Link>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5">
        {enrolledBatches.length === 0 ? (
          <div className="text-center py-8 px-3 border border-dashed rounded-xl space-y-2">
            <BookOpen className="size-8 text-muted-foreground mx-auto" />
            <p className="text-sm font-medium text-foreground">
              No active batch enrollments
            </p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              You are not currently enrolled in any academic batches. Explore
              the course catalog to submit enrollment requests.
            </p>
            <div className="pt-2">
              <Link
                href="/dashboard/student/batches"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "text-xs gap-1.5 h-8",
                )}
              >
                <span>Browse Batches</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {enrolledBatches.map((batch) => (
              <div
                key={batch.batchId || batch.batchName}
                className="rounded-xl border border-border/70 bg-card p-4 space-y-3 shadow-2xs hover:border-primary/40 transition-colors flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-heading text-sm font-bold text-foreground line-clamp-1">
                      {batch.batchName}
                    </h4>
                    <Badge
                      variant="outline"
                      className="text-[10px] font-semibold uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shrink-0"
                    >
                      {batch.status || "ACTIVE"}
                    </Badge>
                  </div>

                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p className="flex items-center gap-1.5">
                      <BookOpen className="size-3.5 text-primary shrink-0" />
                      <span>{batch.subject}</span>
                    </p>
                    {batch.teacherName && (
                      <p className="flex items-center gap-1.5 truncate">
                        <User className="size-3.5 text-primary shrink-0" />
                        <span className="truncate">{batch.teacherName}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs">
                  <span className="font-mono font-bold text-foreground">
                    ৳ {Number(batch.fee).toLocaleString()} / mo
                  </span>

                  <Link
                    href="/dashboard/student/routines"
                    className="text-primary hover:underline flex items-center gap-0.5 font-semibold text-[11px]"
                  >
                    <CalendarDays className="size-3" />
                    <span>Routine</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
