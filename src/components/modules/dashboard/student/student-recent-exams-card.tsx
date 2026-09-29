"use client";

import { ArrowRight, ChevronRight, GraduationCap, Trophy } from "lucide-react";
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

function getGradeBadgeColor(grade: string) {
  if (grade.startsWith("A")) {
    return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20";
  }
  if (grade.startsWith("B")) {
    return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20";
  }
  if (grade.startsWith("C") || grade.startsWith("D")) {
    return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20";
  }
  return "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20";
}

export function StudentRecentExamsCard() {
  const { data: dashboard } = useStudentDashboard();
  const recentExams = dashboard.recentExams || [];

  return (
    <Card className="bg-card border-border/80 shadow-2xs overflow-hidden h-full flex flex-col justify-between">
      <div>
        <CardHeader className="border-b border-border/60 pb-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <GraduationCap className="size-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold font-heading">
                  Recent Evaluations
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Latest published exam results
                </CardDescription>
              </div>
            </div>

            <Link
              href="/dashboard/student/exams"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "text-xs gap-1 h-7 text-primary hover:text-primary px-2",
              )}
            >
              <span>View All</span>
              <ChevronRight className="size-3" />
            </Link>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-5 space-y-3">
          {recentExams.length === 0 ? (
            <div className="text-center py-8 px-3 border border-dashed rounded-xl space-y-2">
              <GraduationCap className="size-8 text-muted-foreground mx-auto" />
              <p className="text-sm font-medium text-foreground">
                No exam results published yet
              </p>
              <p className="text-xs text-muted-foreground">
                Marks and performance rankings will appear here once teachers
                publish evaluated test scorecards.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {recentExams.slice(0, 4).map((exam) => {
                const gradeColor = getGradeBadgeColor(exam.letterGrade);

                return (
                  <div
                    key={exam.examId || exam.examTitle}
                    className="rounded-xl border border-border/70 bg-card p-3 space-y-2 shadow-2xs hover:border-primary/40 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5 min-w-0">
                        <h4 className="font-heading text-xs font-bold text-foreground truncate">
                          {exam.examTitle}
                        </h4>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {exam.batchName}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] font-bold px-1.5 py-0.5",
                            gradeColor,
                          )}
                        >
                          {exam.letterGrade} ({exam.gpa.toFixed(2)})
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1.5 border-t border-border/50 text-[11px]">
                      <span className="font-mono font-medium text-foreground">
                        Score: {exam.marksObtained} / {exam.totalMarks}
                      </span>

                      {exam.rank !== null && exam.rank !== undefined ? (
                        <span className="inline-flex items-center gap-1 text-primary font-semibold">
                          <Trophy className="size-3 text-amber-500" />
                          <span>Rank #{exam.rank}</span>
                        </span>
                      ) : (
                        <span className="text-muted-foreground">Evaluated</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </div>

      {recentExams.length > 0 && (
        <div className="p-4 border-t border-border/60 bg-muted/10">
          <Link
            href="/dashboard/student/exams"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "w-full text-xs gap-1.5 h-8 font-semibold",
            )}
          >
            <span>Check Detailed Scorecards & PDF Report</span>
            <ArrowRight className="size-3" />
          </Link>
        </div>
      )}
    </Card>
  );
}
