"use client";

import { format, parseISO } from "date-fns";
import {
  Award,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  HelpCircle,
  Trophy,
  XCircle,
} from "lucide-react";
import { getReportCardPdfUrl } from "@/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { StudentExamResultItem } from "@/types";
import { formatGpa } from "./exam-utils";

interface StudentExamsResultsListProps {
  results: StudentExamResultItem[];
  studentId: string;
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onSelectScorecard: (result: StudentExamResultItem) => void;
  onSelectMeritList: (examId: string) => void;
}

export function StudentExamsResultsList({
  results,
  studentId,
  currentPage,
  totalPages,
  totalRecords,
  pageSize,
  onPageChange,
  onSelectScorecard,
  onSelectMeritList,
}: StudentExamsResultsListProps) {
  const formatDateSafe = (dateStr?: string | null) => {
    if (!dateStr) return "—";
    try {
      const date = dateStr.includes("T")
        ? parseISO(dateStr)
        : new Date(dateStr);
      return format(date, "EEE, MMM d, yyyy");
    } catch {
      return dateStr || "—";
    }
  };

  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalRecords);

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-10 sm:py-12 text-center px-4">
        <div className="size-11 sm:size-12 rounded-full bg-muted/60 flex items-center justify-center mb-3">
          <HelpCircle className="size-5 sm:size-6 text-muted-foreground" />
        </div>
        <h4 className="font-heading text-sm sm:text-base font-semibold text-foreground">
          No Exam Results Found
        </h4>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mt-1">
          No evaluations match your search criteria or exam marks have not been
          published yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mobile Card List (shown on < sm screens) */}
      <div className="space-y-3 sm:hidden">
        {results.map((item) => {
          const pdfUrl = getReportCardPdfUrl(item.examId, studentId, true);

          return (
            <div
              key={item.id}
              className="rounded-xl border border-border/80 bg-card p-3.5 space-y-3 shadow-2xs"
            >
              {/* Top metadata row */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground truncate">
                  {item.batchName}
                </span>
                <Badge
                  variant="outline"
                  className={cn(
                    "gap-1 font-semibold text-[11px] px-2 py-0.5",
                    item.isPassed
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                      : "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400",
                  )}
                >
                  {item.isPassed ? (
                    <>
                      <CheckCircle2 className="size-3" />
                      PASSED
                    </>
                  ) : (
                    <>
                      <XCircle className="size-3" />
                      FAILED
                    </>
                  )}
                </Badge>
              </div>

              {/* Title & Date */}
              <div>
                <h4 className="font-heading text-sm font-bold text-foreground">
                  {item.examTitle}
                </h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {formatDateSafe(item.examDate)}
                </p>
              </div>

              {/* Score & Grade Display */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40 text-xs">
                <div>
                  <span className="text-muted-foreground block text-[10px]">
                    Score
                  </span>
                  <span className="font-heading text-base font-bold text-foreground">
                    {item.marksObtained}
                    <span className="text-xs text-muted-foreground font-normal">
                      {" "}
                      / {item.totalMarks}
                    </span>
                  </span>
                </div>

                <div className="text-center">
                  <span className="text-muted-foreground block text-[10px]">
                    Grade (GPA)
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-foreground">
                      {item.letterGrade}
                    </span>
                    <span className="text-muted-foreground">
                      ({formatGpa(item.gpa)})
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-muted-foreground block text-[10px]">
                    Rank
                  </span>
                  <span className="font-heading text-base font-bold text-foreground flex items-center justify-end gap-0.5">
                    {item.rank ? (
                      <>
                        <Trophy className="size-3 text-amber-500" />#{item.rank}
                      </>
                    ) : (
                      "—"
                    )}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/50">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSelectScorecard(item)}
                  className="h-8 gap-1.5 text-xs flex-1"
                >
                  <Eye className="size-3.5" />
                  Scorecard
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSelectMeritList(item.examId)}
                  className="h-8 gap-1.5 text-xs flex-1"
                >
                  <Award className="size-3.5 text-amber-500" />
                  Merit List
                </Button>

                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0"
                >
                  <Button variant="ghost" size="sm" className="h-8 px-2.5">
                    <Download className="size-3.5" />
                  </Button>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Table View (hidden on < sm screens) */}
      <div className="hidden sm:block rounded-xl border border-border/80 overflow-hidden bg-card shadow-2xs">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="font-semibold text-foreground">
                  Exam Title & Course
                </TableHead>
                <TableHead className="w-[140px] font-semibold text-foreground">
                  Date
                </TableHead>
                <TableHead className="text-right font-semibold text-foreground">
                  Score
                </TableHead>
                <TableHead className="text-center font-semibold text-foreground">
                  Grade & GPA
                </TableHead>
                <TableHead className="text-center font-semibold text-foreground">
                  Rank
                </TableHead>
                <TableHead className="w-[120px] text-center font-semibold text-foreground">
                  Status
                </TableHead>
                <TableHead className="text-right font-semibold text-foreground">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((item) => {
                const pdfUrl = getReportCardPdfUrl(
                  item.examId,
                  studentId,
                  true,
                );

                return (
                  <TableRow
                    key={item.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    {/* Exam & Course */}
                    <TableCell>
                      <div>
                        <span className="font-semibold text-foreground block">
                          {item.examTitle}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {item.batchName}
                        </span>
                      </div>
                    </TableCell>

                    {/* Date */}
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {formatDateSafe(item.examDate)}
                    </TableCell>

                    {/* Marks Obtained */}
                    <TableCell className="text-right font-semibold text-foreground">
                      {item.marksObtained}
                      <span className="text-xs text-muted-foreground font-normal">
                        {" "}
                        / {item.totalMarks}
                      </span>
                    </TableCell>

                    {/* Grade & GPA */}
                    <TableCell className="text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs font-bold text-foreground">
                          {item.letterGrade}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatGpa(item.gpa)}
                        </span>
                      </div>
                    </TableCell>

                    {/* Rank */}
                    <TableCell className="text-center">
                      {item.rank ? (
                        <span className="inline-flex items-center gap-1 font-bold text-foreground text-sm">
                          <Trophy className="size-3.5 text-amber-500" />#
                          {item.rank}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={cn(
                          "gap-1 font-semibold text-xs",
                          item.isPassed
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                            : "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400",
                        )}
                      >
                        {item.isPassed ? "PASSED" : "FAILED"}
                      </Badge>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onSelectScorecard(item)}
                          className="h-8 gap-1 px-2.5 text-xs"
                          title="View Scorecard"
                        >
                          <Eye className="size-3.5" />
                          <span>Scorecard</span>
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onSelectMeritList(item.examId)}
                          className="h-8 gap-1 px-2 text-xs"
                          title="View Batch Merit List"
                        >
                          <Award className="size-3.5 text-amber-500" />
                          <span className="hidden lg:inline">Merit List</span>
                        </Button>

                        <a
                          href={pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Download PDF Report Card"
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2"
                          >
                            <Download className="size-3.5" />
                          </Button>
                        </a>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1 text-xs text-muted-foreground">
          <div>
            Showing{" "}
            <span className="font-semibold text-foreground">{startIndex}</span>{" "}
            to <span className="font-semibold text-foreground">{endIndex}</span>{" "}
            of{" "}
            <span className="font-semibold text-foreground">
              {totalRecords}
            </span>{" "}
            evaluated exams
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="h-8 gap-1 px-2.5"
            >
              <ChevronLeft className="size-4" />
              <span>Previous</span>
            </Button>

            <span className="px-2 font-medium text-foreground">
              {currentPage} / {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="h-8 gap-1 px-2.5"
            >
              <span>Next</span>
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
