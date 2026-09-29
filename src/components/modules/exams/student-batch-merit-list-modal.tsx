"use client";

import { Medal, Trophy } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useBatchExamResults } from "@/hooks";
import { cn } from "@/lib/utils";
import { computeGradeAndGpa, formatGpa, letterGradeToGpa } from "./exam-utils";

interface StudentBatchMeritListModalProps {
  examId: string | null;
  currentStudentId?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StudentBatchMeritListModal({
  examId,
  currentStudentId,
  open,
  onOpenChange,
}: StudentBatchMeritListModalProps) {
  const { data: meritResponse, isLoading } = useBatchExamResults(
    examId || "",
    Boolean(examId) && open,
  );

  const meritData = meritResponse?.data;
  const exam = meritData?.exam;
  const stats = meritData?.stats;
  const results = meritData?.results || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-5 sm:p-6 max-h-[90vh] flex flex-col">
        <DialogHeader className="space-y-1 text-left">
          <div className="flex items-center gap-2">
            <Trophy className="size-4 text-amber-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Official Batch Merit List
            </span>
          </div>

          <DialogTitle className="font-heading text-lg sm:text-xl font-bold text-foreground">
            {exam?.title || "Exam Merit Rankings"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Published class rankings and evaluation distribution.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-3 py-4">
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: Static array for skeleton placeholders
                <Skeleton key={i} className="h-16 rounded-lg" />
              ))}
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: Static array for skeleton placeholders
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="space-y-4 overflow-y-auto flex-1 pr-1">
            {/* Quick Stats Ribbon */}
            {stats && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="rounded-lg border border-border/70 bg-card p-2.5 text-center">
                  <span className="text-[11px] font-medium text-muted-foreground">
                    Total Examinees
                  </span>
                  <p className="font-heading text-lg font-bold text-foreground">
                    {stats.totalStudents || results.length}
                  </p>
                </div>

                <div className="rounded-lg border border-border/70 bg-card p-2.5 text-center">
                  <span className="text-[11px] font-medium text-muted-foreground">
                    Class Highest
                  </span>
                  <p className="font-heading text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {stats.highestMark ?? "—"}
                  </p>
                </div>

                <div className="rounded-lg border border-border/70 bg-card p-2.5 text-center">
                  <span className="text-[11px] font-medium text-muted-foreground">
                    Class Average
                  </span>
                  <p className="font-heading text-lg font-bold text-foreground">
                    {stats.averageMark
                      ? Math.round(stats.averageMark * 10) / 10
                      : "—"}
                  </p>
                </div>

                <div className="rounded-lg border border-border/70 bg-card p-2.5 text-center">
                  <span className="text-[11px] font-medium text-muted-foreground">
                    Pass Percentage
                  </span>
                  <p className="font-heading text-lg font-bold text-primary">
                    {stats.passRate ? `${Math.round(stats.passRate)}%` : "—"}
                  </p>
                </div>
              </div>
            )}

            {/* Mobile Card List (shown on < sm screens) */}
            <div className="space-y-2 sm:hidden">
              {results.map((record) => {
                const isCurrent =
                  Boolean(currentStudentId) &&
                  (record.studentId === currentStudentId ||
                    record.student?.id === currentStudentId);
                const rankNum = record.rank;

                const totalMarks = Number(exam?.totalMarks || 100);
                const passMarks = Number(exam?.passMarks || 40);
                const marksObtained = Number(record.marksObtained || 0);
                const computed = computeGradeAndGpa(
                  marksObtained,
                  totalMarks,
                  passMarks,
                );

                const letterGrade =
                  (typeof (record as unknown as { grade?: string })?.grade ===
                    "string" &&
                    (record as unknown as { grade?: string }).grade) ||
                  (typeof record.letterGrade === "string" &&
                    record.letterGrade) ||
                  computed.letterGrade ||
                  "—";

                const gpa =
                  record.gpa !== undefined && record.gpa !== null
                    ? record.gpa
                    : letterGradeToGpa(letterGrade) || computed.gpaNumber;

                return (
                  <div
                    key={record.id}
                    className={cn(
                      "rounded-lg border p-3 text-xs space-y-1.5 transition-colors",
                      isCurrent
                        ? "border-primary/50 bg-primary/5 ring-1 ring-primary/30"
                        : "border-border/80 bg-card",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold">
                        {rankNum === 1 && (
                          <Medal className="size-4 text-amber-500 fill-amber-500/20" />
                        )}
                        {rankNum === 2 && (
                          <Medal className="size-4 text-slate-400 fill-slate-400/20" />
                        )}
                        {rankNum === 3 && (
                          <Medal className="size-4 text-amber-700 fill-amber-700/20" />
                        )}
                        <span className="text-foreground">
                          {rankNum ? `#${rankNum}` : "—"}
                        </span>
                        {isCurrent && (
                          <Badge
                            variant="secondary"
                            className="text-[10px] px-1.5 py-0 bg-primary/10 text-primary border-primary/20"
                          >
                            You
                          </Badge>
                        )}
                      </div>

                      <span className="font-semibold text-foreground">
                        {record.marksObtained}
                        {exam?.totalMarks ? ` / ${exam.totalMarks}` : ""}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>{record.student?.name || "Student"}</span>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-foreground">
                          {letterGrade}
                        </span>
                        <span>({formatGpa(gpa)})</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table View (hidden on < sm screens) */}
            <div className="hidden sm:block rounded-xl border border-border/80 overflow-hidden bg-card">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead className="w-14 text-center font-semibold">
                      Rank
                    </TableHead>
                    <TableHead className="font-semibold">
                      Student Name / Roll
                    </TableHead>
                    <TableHead className="w-24 text-right font-semibold">
                      Score
                    </TableHead>
                    <TableHead className="w-20 text-center font-semibold">
                      Grade
                    </TableHead>
                    <TableHead className="w-20 text-center font-semibold">
                      GPA
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((record) => {
                    const isCurrent =
                      Boolean(currentStudentId) &&
                      (record.studentId === currentStudentId ||
                        record.student?.id === currentStudentId);
                    const rankNum = record.rank;

                    const totalMarks = Number(exam?.totalMarks || 100);
                    const passMarks = Number(exam?.passMarks || 40);
                    const marksObtained = Number(record.marksObtained || 0);
                    const computed = computeGradeAndGpa(
                      marksObtained,
                      totalMarks,
                      passMarks,
                    );

                    const letterGrade =
                      (typeof (record as unknown as { grade?: string })
                        ?.grade === "string" &&
                        (record as unknown as { grade?: string }).grade) ||
                      (typeof record.letterGrade === "string" &&
                        record.letterGrade) ||
                      computed.letterGrade ||
                      "—";

                    const gpa =
                      record.gpa !== undefined && record.gpa !== null
                        ? record.gpa
                        : letterGradeToGpa(letterGrade) || computed.gpaNumber;

                    return (
                      <TableRow
                        key={record.id}
                        className={cn(
                          "transition-colors",
                          isCurrent
                            ? "bg-primary/5 font-medium hover:bg-primary/10"
                            : "hover:bg-muted/30",
                        )}
                      >
                        <TableCell className="text-center font-bold">
                          <div className="flex items-center justify-center gap-1">
                            {rankNum === 1 && (
                              <Medal className="size-4 text-amber-500 fill-amber-500/20" />
                            )}
                            {rankNum === 2 && (
                              <Medal className="size-4 text-slate-400 fill-slate-400/20" />
                            )}
                            {rankNum === 3 && (
                              <Medal className="size-4 text-amber-700 fill-amber-700/20" />
                            )}
                            <span>{rankNum ? `#${rankNum}` : "—"}</span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-foreground">
                              {record.student?.name || "Student"}
                            </span>
                            {isCurrent && (
                              <Badge
                                variant="secondary"
                                className="text-[10px] px-1.5 py-0 bg-primary/10 text-primary border-primary/20"
                              >
                                You
                              </Badge>
                            )}
                          </div>
                        </TableCell>

                        <TableCell className="text-right font-semibold text-foreground">
                          {record.marksObtained}
                          {exam?.totalMarks ? (
                            <span className="text-xs text-muted-foreground font-normal">
                              {" "}
                              / {exam.totalMarks}
                            </span>
                          ) : (
                            ""
                          )}
                        </TableCell>

                        <TableCell className="text-center">
                          <span className="font-semibold text-foreground">
                            {letterGrade}
                          </span>
                        </TableCell>

                        <TableCell className="text-center font-medium text-foreground">
                          {formatGpa(gpa)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        <DialogFooter className="pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
