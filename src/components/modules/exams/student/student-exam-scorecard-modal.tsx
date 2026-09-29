"use client";

import { format, parseISO } from "date-fns";
import {
  Award,
  BarChart3,
  CheckCircle2,
  Download,
  FileText,
  Trophy,
  XCircle,
} from "lucide-react";
import { getReportCardPdfUrl } from "@/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { StudentExamResultItem } from "@/types";
import { formatGpa } from "../shared/exam-utils";

interface StudentExamScorecardModalProps {
  result: StudentExamResultItem | null;
  studentId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onViewMeritList?: (examId: string) => void;
}

export function StudentExamScorecardModal({
  result,
  studentId,
  open,
  onOpenChange,
  onViewMeritList,
}: StudentExamScorecardModalProps) {
  if (!result) return null;

  const formatDateSafe = (dateStr?: string | null) => {
    if (!dateStr) return "—";
    try {
      const date = dateStr.includes("T")
        ? parseISO(dateStr)
        : new Date(dateStr);
      return format(date, "EEEE, MMMM d, yyyy");
    } catch {
      return dateStr || "—";
    }
  };

  const scorePct =
    result.totalMarks > 0
      ? Math.round((result.marksObtained / result.totalMarks) * 100)
      : 0;

  const pdfUrl = getReportCardPdfUrl(result.examId, studentId, true);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-5 sm:p-6">
        <DialogHeader className="space-y-1 text-left">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {result.batchName}
            </span>
            <Badge
              variant="outline"
              className={cn(
                "gap-1 font-semibold",
                result.isPassed
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                  : "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400",
              )}
            >
              {result.isPassed ? (
                <>
                  <CheckCircle2 className="size-3.5" />
                  PASSED
                </>
              ) : (
                <>
                  <XCircle className="size-3.5" />
                  FAILED
                </>
              )}
            </Badge>
          </div>

          <DialogTitle className="font-heading text-lg sm:text-xl font-bold text-foreground">
            {result.examTitle}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Conducted on {formatDateSafe(result.examDate)}
          </DialogDescription>
        </DialogHeader>

        {/* Scorecard Hero Block */}
        <div className="rounded-xl border border-border/80 bg-muted/30 p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="text-xs font-medium text-muted-foreground">
                Marks Obtained
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground">
                  {result.marksObtained}
                </span>
                <span className="text-sm font-medium text-muted-foreground">
                  / {result.totalMarks}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              <span className="text-xs font-medium text-muted-foreground">
                Grade & GPA
              </span>
              <div className="flex items-center gap-1.5">
                <span className="rounded-lg bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 text-base font-bold">
                  {result.letterGrade}
                </span>
                <span className="font-heading text-base font-bold text-foreground">
                  {formatGpa(result.gpa)}
                </span>
              </div>
            </div>
          </div>

          {/* Minimal score bar */}
          <div className="space-y-1">
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  result.isPassed ? "bg-primary" : "bg-rose-500",
                )}
                style={{ width: `${Math.min(100, Math.max(0, scorePct))}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>Pass mark: {result.passMarks}</span>
              <span className="font-semibold text-foreground">{scorePct}%</span>
            </div>
          </div>
        </div>

        {/* Comparative Academic Benchmarks */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <BarChart3 className="size-3.5 text-muted-foreground" />
            Class Performance Comparison
          </span>

          <div className="grid grid-cols-3 gap-2 text-center">
            {/* Batch Rank */}
            <div className="rounded-lg border border-border/70 bg-card p-2.5 space-y-0.5">
              <span className="text-[11px] font-medium text-muted-foreground">
                Batch Rank
              </span>
              <p className="font-heading text-base sm:text-lg font-bold text-foreground flex items-center justify-center gap-1">
                {result.rank ? (
                  <>
                    <Trophy className="size-3.5 text-amber-500" />#{result.rank}
                  </>
                ) : (
                  "—"
                )}
              </p>
            </div>

            {/* Highest Mark */}
            <div className="rounded-lg border border-border/70 bg-card p-2.5 space-y-0.5">
              <span className="text-[11px] font-medium text-muted-foreground">
                Class Highest
              </span>
              <p className="font-heading text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {result.highestMark !== undefined ? result.highestMark : "—"}
              </p>
            </div>

            {/* Class Average */}
            <div className="rounded-lg border border-border/70 bg-card p-2.5 space-y-0.5">
              <span className="text-[11px] font-medium text-muted-foreground">
                Class Average
              </span>
              <p className="font-heading text-base sm:text-lg font-bold text-foreground">
                {result.averageMark !== undefined
                  ? Math.round(result.averageMark * 10) / 10
                  : "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Remarks Section */}
        {result.remarks && (
          <div className="rounded-lg border border-border/60 bg-muted/20 p-3 text-xs space-y-1">
            <span className="font-semibold text-foreground flex items-center gap-1">
              <FileText className="size-3 text-muted-foreground" />
              Teacher Remarks
            </span>
            <p className="text-muted-foreground italic">"{result.remarks}"</p>
          </div>
        )}

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between items-stretch sm:items-center gap-2 pt-2">
          {onViewMeritList ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                onOpenChange(false);
                onViewMeritList(result.examId);
              }}
              className="gap-1.5"
            >
              <Award className="size-4 text-amber-500" />
              <span>View Batch Merit List</span>
            </Button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>

            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex"
            >
              <Button size="sm" className="gap-1.5 w-full sm:w-auto">
                <Download className="size-4" />
                <span>Download PDF</span>
              </Button>
            </a>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
