"use client";

import {
  Award,
  CheckCircle2,
  GraduationCap,
  Loader2,
  Save,
  Send,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useBatchExamResults,
  useBatchStudents,
  useBulkSubmitMarksMutation,
  usePublishExamResultsMutation,
} from "@/hooks";
import { cn } from "@/lib/utils";
import type { BatchEnrollment, Exam, StudentMarkEntryItem } from "@/types";

interface MarksEntryModalProps {
  exam: Exam | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface StudentRowState {
  studentId: string;
  studentName: string;
  rollNumber?: string;
  guardianPhone?: string;
  marksObtained: number | string;
  remarks: string;
}

/**
 * Calculate dynamic letter grade, GPA, and pass status based on marks
 */
function calculateGrade(
  marks: number | string,
  totalMarks: number,
  passMarks: number,
): {
  grade: string;
  gpa: string;
  isPassed: boolean;
  badgeClass: string;
} {
  const numericMarks = typeof marks === "number" ? marks : Number(marks);

  if (marks === "" || Number.isNaN(numericMarks) || numericMarks < 0) {
    return {
      grade: "—",
      gpa: "—",
      isPassed: false,
      badgeClass: "bg-muted text-muted-foreground border-border",
    };
  }

  if (numericMarks < passMarks) {
    return {
      grade: "F",
      gpa: "0.00",
      isPassed: false,
      badgeClass:
        "bg-destructive/10 text-destructive dark:text-rose-400 border-destructive/30",
    };
  }

  const percentage = totalMarks > 0 ? (numericMarks / totalMarks) * 100 : 0;

  if (percentage >= 80) {
    return {
      grade: "A+",
      gpa: "5.00",
      isPassed: true,
      badgeClass:
        "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    };
  }
  if (percentage >= 70) {
    return {
      grade: "A",
      gpa: "4.00",
      isPassed: true,
      badgeClass:
        "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    };
  }
  if (percentage >= 60) {
    return {
      grade: "A-",
      gpa: "3.50",
      isPassed: true,
      badgeClass:
        "bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/30",
    };
  }
  if (percentage >= 50) {
    return {
      grade: "B",
      gpa: "3.00",
      isPassed: true,
      badgeClass:
        "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/30",
    };
  }
  if (percentage >= 40) {
    return {
      grade: "C",
      gpa: "2.00",
      isPassed: true,
      badgeClass:
        "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30",
    };
  }
  if (percentage >= 33) {
    return {
      grade: "D",
      gpa: "1.00",
      isPassed: true,
      badgeClass:
        "bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/30",
    };
  }

  return {
    grade: "F",
    gpa: "0.00",
    isPassed: false,
    badgeClass:
      "bg-destructive/10 text-destructive dark:text-rose-400 border-destructive/30",
  };
}

export function MarksEntryModal({
  exam,
  open,
  onOpenChange,
}: MarksEntryModalProps) {
  const [rows, setRows] = useState<StudentRowState[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);

  // Fetch batch roster students
  const { data: rosterData, isLoading: isLoadingRoster } = useBatchStudents(
    exam?.batchId || "",
    { limit: 200 },
  );

  // Fetch existing results/marks for this exam
  const { data: resultsData, isLoading: isLoadingResults } =
    useBatchExamResults(exam?.id || "", open && Boolean(exam?.id));

  const bulkSubmitMutation = useBulkSubmitMarksMutation();
  const publishMutation = usePublishExamResultsMutation();

  const isSubmitting = bulkSubmitMutation.isPending || isPublishing;
  const isLoading = isLoadingRoster || isLoadingResults;

  // Initialize and sync rows from roster and existing results
  useEffect(() => {
    if (!open || !exam) return;

    const enrollments: BatchEnrollment[] = rosterData?.data || [];
    const rawResults = resultsData?.data;
    const existingRecords = Array.isArray(rawResults)
      ? rawResults
      : rawResults?.results || [];

    const existingMap = new Map<
      string,
      { marksObtained: number; remarks?: string | null }
    >();

    for (const rec of existingRecords) {
      existingMap.set(rec.studentId, {
        marksObtained: rec.marksObtained,
        remarks: rec.remarks,
      });
    }

    const mappedRows: StudentRowState[] = enrollments.map((enr) => {
      const sId =
        enr.studentId ||
        enr.userId ||
        enr.student?.id ||
        enr.user?.id ||
        enr.id;
      const sName = enr.student?.name || enr.user?.name || "Student";
      const roll =
        enr.student?.studentProfile?.rollNumber ||
        enr.user?.studentProfile?.rollNumber;
      const phone =
        enr.student?.studentProfile?.guardianPhone ||
        enr.user?.studentProfile?.guardianPhone;
      const existing = existingMap.get(sId);

      return {
        studentId: sId,
        studentName: sName,
        rollNumber: roll,
        guardianPhone: phone,
        marksObtained:
          existing !== undefined ? String(existing.marksObtained) : "",
        remarks: existing?.remarks || "",
      };
    });

    setRows(mappedRows);
  }, [open, exam, rosterData, resultsData]);

  const handleMarkChange = (studentId: string, value: string) => {
    setRows((prev) =>
      prev.map((row) =>
        row.studentId === studentId ? { ...row, marksObtained: value } : row,
      ),
    );
  };

  const handleRemarksChange = (studentId: string, value: string) => {
    setRows((prev) =>
      prev.map((row) =>
        row.studentId === studentId ? { ...row, remarks: value } : row,
      ),
    );
  };

  const validateAndBuildPayload = (): StudentMarkEntryItem[] | null => {
    if (!exam) return null;

    const invalidRow = rows.find((r) => {
      if (r.marksObtained === "") return false;
      const num = Number(r.marksObtained);
      return Number.isNaN(num) || num < 0 || num > exam.totalMarks;
    });

    if (invalidRow) {
      toast.error(
        `Marks for "${invalidRow.studentName}" must be between 0 and ${exam.totalMarks}.`,
      );
      return null;
    }

    const validRecords: StudentMarkEntryItem[] = rows
      .filter(
        (r) => r.marksObtained !== "" && !Number.isNaN(Number(r.marksObtained)),
      )
      .map((r) => ({
        studentId: r.studentId,
        marksObtained: Number(r.marksObtained),
        remarks: r.remarks.trim() || undefined,
      }));

    if (validRecords.length === 0) {
      toast.error("Please enter marks for at least one student.");
      return null;
    }

    return validRecords;
  };

  const handleSaveDraft = async () => {
    if (!exam) return;
    const records = validateAndBuildPayload();
    if (!records) return;

    await bulkSubmitMutation.mutateAsync({
      examId: exam.id,
      payload: { records },
    });
  };

  const handleSaveAndPublish = async () => {
    if (!exam) return;
    const records = validateAndBuildPayload();
    if (!records) return;

    try {
      setIsPublishing(true);
      await bulkSubmitMutation.mutateAsync({
        examId: exam.id,
        payload: { records },
      });
      await publishMutation.mutateAsync(exam.id);
      onOpenChange(false);
    } catch {
      // Error handled by mutations
    } finally {
      setIsPublishing(false);
    }
  };

  // Quick summary statistics
  const enteredCount = rows.filter((r) => r.marksObtained !== "").length;
  const passedCount = rows.filter((r) => {
    if (r.marksObtained === "" || !exam) return false;
    return Number(r.marksObtained) >= exam.passMarks;
  }).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="p-5 border-b border-border/70 bg-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 font-bold text-primary shadow-2xs">
                <GraduationCap className="size-6" />
              </div>
              <div>
                <DialogTitle className="font-heading text-lg font-bold text-foreground">
                  Marks Entry: {exam?.title || "Exam"}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Enter student scores. Letter grades and GPAs will compute
                  automatically.
                </DialogDescription>
              </div>
            </div>

            {/* Quick Context Badges */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-muted border border-border/80 font-medium text-foreground">
                Batch:{" "}
                <span className="font-bold text-primary">
                  {exam?.batch?.name || "Selected Batch"}
                </span>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-muted border border-border/80 font-medium text-foreground">
                Total: <span className="font-bold">{exam?.totalMarks}</span> |
                Pass:{" "}
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {exam?.passMarks}
                </span>
              </span>
            </div>
          </div>
        </DialogHeader>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Progress / Status Bar */}
          <div className="rounded-xl border border-border/70 bg-muted/30 p-3.5 flex items-center justify-between flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Users className="size-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">Enrolled:</span>
                <span className="font-bold text-foreground">{rows.length}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-primary" />
                <span className="text-muted-foreground">Marks Entered:</span>
                <span className="font-bold text-primary">
                  {enteredCount} / {rows.length}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-muted-foreground">Passing:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {passedCount}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-muted-foreground">
              Press{" "}
              <kbd className="px-1.5 py-0.5 rounded bg-muted border font-mono">
                Tab
              </kbd>{" "}
              to quickly jump between student scores
            </div>
          </div>

          {/* Students Grading Table */}
          <div className="rounded-xl border border-border/70 bg-card overflow-hidden shadow-2xs">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="w-12 text-center">#</TableHead>
                  <TableHead className="min-w-44">Student Name</TableHead>
                  <TableHead className="w-32">Roll Number</TableHead>
                  <TableHead className="w-36">
                    Marks (/{exam?.totalMarks || 100})
                  </TableHead>
                  <TableHead className="w-28 text-center">
                    Grade & GPA
                  </TableHead>
                  <TableHead className="min-w-48">Remarks / Notes</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5"].map((skKey, idx) => (
                    <TableRow key={skKey}>
                      <TableCell className="text-center">{idx + 1}</TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-8 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-16 mx-auto rounded-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-8 w-full" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-36 text-center">
                      <div className="flex flex-col items-center justify-center gap-1.5 text-muted-foreground">
                        <Users className="size-6 opacity-40 mb-0.5" />
                        <p className="font-semibold text-xs text-foreground">
                          No Students Found in this Batch
                        </p>
                        <p className="text-[11px]">
                          Please enroll students into this batch before entering
                          exam marks.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((row, idx) => {
                    const gradeInfo = calculateGrade(
                      row.marksObtained,
                      exam?.totalMarks || 100,
                      exam?.passMarks || 40,
                    );

                    const isExceeding =
                      row.marksObtained !== "" &&
                      Number(row.marksObtained) > (exam?.totalMarks || 100);

                    return (
                      <TableRow
                        key={row.studentId}
                        className={cn(
                          "transition-colors",
                          isExceeding && "bg-destructive/5",
                        )}
                      >
                        <TableCell className="text-center text-xs font-mono text-muted-foreground">
                          {idx + 1}
                        </TableCell>
                        <TableCell className="text-xs font-medium text-foreground">
                          <div>
                            <span>{row.studentName}</span>
                            {row.guardianPhone && (
                              <span className="block text-[10px] text-muted-foreground/80 font-mono">
                                Ph: {row.guardianPhone}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {row.rollNumber || "—"}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            max={exam?.totalMarks || 100}
                            step="0.5"
                            value={row.marksObtained}
                            onChange={(e) =>
                              handleMarkChange(row.studentId, e.target.value)
                            }
                            placeholder="0.0"
                            className={cn(
                              "h-8 w-28 text-xs font-mono font-semibold text-right",
                              isExceeding &&
                                "border-destructive focus-visible:ring-destructive",
                            )}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          {row.marksObtained !== "" ? (
                            <span
                              className={cn(
                                "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border shadow-2xs",
                                gradeInfo.badgeClass,
                              )}
                            >
                              <span>{gradeInfo.grade}</span>
                              <span className="opacity-70">
                                ({gradeInfo.gpa})
                              </span>
                            </span>
                          ) : (
                            <span className="text-[11px] text-muted-foreground/60 italic">
                              Pending
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="text"
                            value={row.remarks}
                            onChange={(e) =>
                              handleRemarksChange(row.studentId, e.target.value)
                            }
                            placeholder="Optional remarks (e.g. Excellent math accuracy)"
                            className="h-8 text-xs"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="m-0 p-4 border-t border-border/70 bg-card flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="text-xs text-muted-foreground">
            {enteredCount} of {rows.length} students graded
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSaveDraft}
              disabled={isSubmitting || rows.length === 0}
            >
              {bulkSubmitMutation.isPending && !isPublishing ? (
                <>
                  <Loader2 className="size-3.5 animate-spin mr-1.5" />
                  Saving Draft...
                </>
              ) : (
                <>
                  <Save className="size-3.5 mr-1.5" />
                  Save Draft
                </>
              )}
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSaveAndPublish}
              disabled={isSubmitting || rows.length === 0}
            >
              {isPublishing ? (
                <>
                  <Loader2 className="size-3.5 animate-spin mr-1.5" />
                  Publishing...
                </>
              ) : (
                <>
                  <Send className="size-3.5 mr-1.5" />
                  Save & Publish Results
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
