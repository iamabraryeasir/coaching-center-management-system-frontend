"use client";

import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  FileSpreadsheet,
  GraduationCap,
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
import { formatDateSafe } from "@/lib/utils";
import type { TeacherPendingExamTask } from "@/types";

export function TeacherPendingExamsCard() {
  const { data } = useTeacherDashboard();
  const { hasPermission } = useAuth();
  const canManageExams = hasPermission("MANAGE_EXAMS");

  const pendingExams: TeacherPendingExamTask[] = data?.pendingExamTasks || [];

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <GraduationCap className="size-5 text-primary" />
            <span>Exams & Gradebooks</span>
          </CardTitle>
          {pendingExams.length > 0 && (
            <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
              {pendingExams.length} Active
            </span>
          )}
        </div>
        <CardDescription>
          Upcoming assessments and exams requiring student marks entry
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 space-y-3">
        {pendingExams.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 p-8 text-center">
            <div className="flex size-11 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 mb-3">
              <CheckCircle2 className="size-5" />
            </div>
            <p className="font-semibold text-sm text-foreground">
              All Gradebooks Up to Date
            </p>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs">
              No exams currently require marks entry or result publication.
              Great job keeping student records updated!
            </p>
          </div>
        ) : (
          pendingExams.map((exam) => {
            const isDraft = exam.resultStatus === "DRAFT";
            const percentEvaluated =
              exam.totalStudents > 0
                ? Math.round((exam.evaluatedCount / exam.totalStudents) * 100)
                : 0;

            return (
              <div
                key={exam.examId}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-border/80 bg-card p-3.5 transition-colors hover:border-primary/40 hover:bg-muted/20"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-foreground truncate">
                      {exam.title}
                    </span>
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1.5 py-0 font-medium"
                    >
                      {exam.batchName}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                    <span>Date: {formatDateSafe(exam.examDate)}</span>
                    <span>Total: {exam.totalMarks} pts</span>
                    <span>Pass: {exam.passMarks} pts</span>
                    {exam.totalStudents > 0 && (
                      <span className="text-[11px] font-medium text-foreground/80">
                        Evaluated: {exam.evaluatedCount}/{exam.totalStudents} (
                        {percentEvaluated}%)
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                  {isDraft ? (
                    canManageExams ? (
                      <Link
                        href="/dashboard/teacher/exams"
                        className={buttonVariants({
                          size: "sm",
                          className: "h-7 text-xs gap-1.5 shadow-xs",
                        })}
                      >
                        <FileSpreadsheet className="size-3.5" />
                        <span>Enter Marks</span>
                      </Link>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="text-[11px] gap-1 bg-amber-500/10 text-amber-700 dark:text-amber-300"
                      >
                        <AlertCircle className="size-3" />
                        <span>Grading in Progress</span>
                      </Badge>
                    )
                  ) : (
                    <Badge
                      variant="outline"
                      className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[11px] gap-1"
                    >
                      <CheckCircle2 className="size-3" />
                      <span>Published</span>
                    </Badge>
                  )}
                </div>
              </div>
            );
          })
        )}
      </CardContent>

      <CardFooter className="border-t border-border/60 pt-3">
        <Link
          href="/dashboard/teacher/exams"
          className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          <span>View all exams and merit lists</span>
          <ChevronRight className="size-3.5" />
        </Link>
      </CardFooter>
    </Card>
  );
}
