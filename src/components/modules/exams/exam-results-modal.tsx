"use client";

import {
  Award,
  BarChart3,
  CheckCircle2,
  Download,
  Eye,
  Mail,
  Send,
  Trophy,
  Undo2,
  Users,
} from "lucide-react";
import { useState } from "react";
import { getReportCardPdfUrl } from "@/api";
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
import {
  useAuth,
  useBatchExamResults,
  usePublishExamResultsMutation,
  useSendReportCardEmailMutation,
  useUnpublishExamResultsMutation,
} from "@/hooks";
import type { Exam, ExamMarkRecord } from "@/types";
import { StudentReportCardModal } from "./student-report-card-modal";

interface ExamResultsModalProps {
  exam: Exam | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenMarksEntry?: (exam: Exam) => void;
}

export function ExamResultsModal({
  exam,
  open,
  onOpenChange,
  onOpenMarksEntry,
}: ExamResultsModalProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const [selectedRecord, setSelectedRecord] = useState<ExamMarkRecord | null>(
    null,
  );
  const [reportModalOpen, setReportModalOpen] = useState(false);

  const {
    data: resultsResponse,
    isLoading,
    refetch,
  } = useBatchExamResults(exam?.id || "", open && Boolean(exam?.id));

  const publishMutation = usePublishExamResultsMutation();
  const unpublishMutation = useUnpublishExamResultsMutation();
  const sendEmailMutation = useSendReportCardEmailMutation();

  const isTogglingPublish =
    publishMutation.isPending || unpublishMutation.isPending;

  const resultData = resultsResponse?.data;
  const records: ExamMarkRecord[] = Array.isArray(resultData)
    ? resultData
    : resultData?.results || [];

  // Sort by marksObtained descending to guarantee accurate merit ranking
  const sortedRecords = [...records].sort(
    (a, b) => Number(b.marksObtained) - Number(a.marksObtained),
  );

  // Compute stats if not explicitly returned in summary
  const totalStudents = sortedRecords.length;
  const total = exam?.totalMarks || 100;
  const passMarks = exam?.passMarks || 40;

  const marksList = sortedRecords.map((r) => Number(r.marksObtained));
  const highestMark =
    resultData?.stats?.highestMark ??
    (marksList.length > 0 ? Math.max(...marksList) : 0);
  const lowestMark =
    resultData?.stats?.lowestMark ??
    (marksList.length > 0 ? Math.min(...marksList) : 0);
  const averageMark =
    resultData?.stats?.averageMark ??
    (marksList.length > 0
      ? Math.round(marksList.reduce((a, b) => a + b, 0) / marksList.length)
      : 0);

  const passCount =
    resultData?.stats?.passCount ??
    sortedRecords.filter((r) => Number(r.marksObtained) >= passMarks).length;
  const passRate =
    resultData?.stats?.passRate ??
    (totalStudents > 0 ? Math.round((passCount / totalStudents) * 100) : 0);

  const isPublished =
    exam?.resultStatus === "PUBLISHED" ||
    resultData?.exam?.resultStatus === "PUBLISHED";

  const handleTogglePublish = async () => {
    if (!exam) return;
    if (isPublished) {
      await unpublishMutation.mutateAsync(exam.id);
    } else {
      await publishMutation.mutateAsync(exam.id);
    }
    refetch();
  };

  const handleViewReportCard = (record: ExamMarkRecord) => {
    setSelectedRecord(record);
    setReportModalOpen(true);
  };

  const handleDownloadPdf = (studentId: string) => {
    if (!exam) return;
    const url = getReportCardPdfUrl(exam.id, studentId, true);
    window.open(url, "_blank");
  };

  const handleSendEmail = (studentId: string) => {
    if (!exam) return;
    sendEmailMutation.mutate({
      examId: exam.id,
      studentId,
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-5xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
          {/* Header */}
          <DialogHeader className="p-5 border-b border-border/70 bg-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 font-bold text-primary shadow-2xs">
                  <Trophy className="size-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <DialogTitle className="font-heading text-lg font-bold text-foreground">
                      Merit List & Results: {exam?.title}
                    </DialogTitle>
                    {isPublished ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                        Published
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                        Draft Results
                      </span>
                    )}
                  </div>
                  <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                    Batch performance leaderboard, individual marks, GPAs, and
                    official report card generation.
                  </DialogDescription>
                </div>
              </div>

              {/* Action Ribbon */}
              <div className="flex items-center gap-2">
                {onOpenMarksEntry && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onOpenChange(false);
                      if (exam) onOpenMarksEntry(exam);
                    }}
                  >
                    Edit Marks
                  </Button>
                )}

                {(isAdmin || !isPublished) && (
                  <Button
                    type="button"
                    variant={isPublished ? "outline" : "default"}
                    size="sm"
                    onClick={handleTogglePublish}
                    disabled={isTogglingPublish || sortedRecords.length === 0}
                  >
                    {isTogglingPublish ? (
                      "Updating..."
                    ) : isPublished ? (
                      <>
                        <Undo2 className="size-3.5 mr-1.5" />
                        Revert to Draft
                      </>
                    ) : (
                      <>
                        <Send className="size-3.5 mr-1.5" />
                        Publish Results
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </DialogHeader>

          {/* Modal Body */}
          <div className="p-5 space-y-4 overflow-y-auto flex-1">
            {/* KPI Performance Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
              {/* Highest Mark */}
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/10 p-3 shadow-2xs">
                <div className="flex items-center justify-between text-amber-700 dark:text-amber-300 mb-1">
                  <span className="text-[11px] font-medium">Highest Score</span>
                  <Trophy className="size-3.5 text-amber-500" />
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold text-amber-900 dark:text-amber-100">
                    {isLoading ? "—" : highestMark}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    /{total}
                  </span>
                </div>
              </div>

              {/* Average Mark */}
              <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 dark:bg-sky-500/10 p-3 shadow-2xs">
                <div className="flex items-center justify-between text-sky-700 dark:text-sky-300 mb-1">
                  <span className="text-[11px] font-medium">Class Average</span>
                  <BarChart3 className="size-3.5 text-sky-500" />
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold text-sky-900 dark:text-sky-100">
                    {isLoading ? "—" : averageMark}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    /{total}
                  </span>
                </div>
              </div>

              {/* Lowest Mark */}
              <div className="rounded-xl border border-border/70 bg-card p-3 shadow-2xs">
                <div className="flex items-center justify-between text-muted-foreground mb-1">
                  <span className="text-[11px] font-medium">Lowest Score</span>
                  <Award className="size-3.5" />
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold text-foreground">
                    {isLoading ? "—" : lowestMark}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    /{total}
                  </span>
                </div>
              </div>

              {/* Pass Rate */}
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10 p-3 shadow-2xs">
                <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-300 mb-1">
                  <span className="text-[11px] font-medium">Pass Rate</span>
                  <CheckCircle2 className="size-3.5 text-emerald-500" />
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold text-emerald-900 dark:text-emerald-100">
                    {isLoading ? "—" : `${passRate}%`}
                  </span>
                  <span className="text-[10px] text-emerald-700/80">
                    ({passCount}/{totalStudents})
                  </span>
                </div>
              </div>

              {/* Total Examinees */}
              <div className="rounded-xl border border-border/70 bg-card p-3 shadow-2xs">
                <div className="flex items-center justify-between text-muted-foreground mb-1">
                  <span className="text-[11px] font-medium">
                    Total Examinees
                  </span>
                  <Users className="size-3.5 text-primary" />
                </div>
                <span className="text-lg font-bold text-foreground">
                  {isLoading ? "—" : totalStudents}
                </span>
              </div>
            </div>

            {/* Merit List Table */}
            <div className="rounded-xl border border-border/70 bg-card overflow-hidden shadow-2xs">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="w-16 text-center">Rank</TableHead>
                    <TableHead className="min-w-44">Student Name</TableHead>
                    <TableHead className="w-28">Roll No</TableHead>
                    <TableHead className="w-32 text-center">
                      Score (/{total})
                    </TableHead>
                    <TableHead className="w-24 text-center">Grade</TableHead>
                    <TableHead className="w-20 text-center">GPA</TableHead>
                    <TableHead className="w-24 text-center">Status</TableHead>
                    <TableHead className="w-36 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {isLoading ? (
                    ["sk-1", "sk-2", "sk-3", "sk-4"].map((skKey) => (
                      <TableRow key={skKey}>
                        <TableCell>
                          <Skeleton className="h-6 w-8 mx-auto rounded-full" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-32" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-16" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-16 mx-auto" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-10 mx-auto" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-10 mx-auto" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-16 mx-auto rounded-full" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-8 w-24 ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : sortedRecords.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-36 text-center">
                        <div className="flex flex-col items-center justify-center gap-1.5 text-muted-foreground">
                          <Trophy className="size-6 opacity-40 mb-0.5" />
                          <p className="font-semibold text-xs text-foreground">
                            No Marks Recorded Yet
                          </p>
                          <p className="text-[11px]">
                            Enter student marks for this exam to generate the
                            merit leaderboard.
                          </p>
                          {onOpenMarksEntry && exam && (
                            <Button
                              type="button"
                              size="sm"
                              className="mt-2 text-xs"
                              onClick={() => {
                                onOpenChange(false);
                                onOpenMarksEntry(exam);
                              }}
                            >
                              Enter Exam Marks
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedRecords.map((rec, idx) => {
                      const rank = idx + 1;
                      const obtainedMarks = Number(rec.marksObtained);
                      const pct = total > 0 ? (obtainedMarks / total) * 100 : 0;

                      // Dynamic letter grade and GPA computation fallback
                      let computedGrade = "F";
                      let computedGpa = "0.00";
                      if (obtainedMarks >= passMarks) {
                        if (pct >= 80) {
                          computedGrade = "A+";
                          computedGpa = "5.00";
                        } else if (pct >= 70) {
                          computedGrade = "A";
                          computedGpa = "4.00";
                        } else if (pct >= 60) {
                          computedGrade = "A-";
                          computedGpa = "3.50";
                        } else if (pct >= 50) {
                          computedGrade = "B";
                          computedGpa = "3.00";
                        } else if (pct >= 40) {
                          computedGrade = "C";
                          computedGpa = "2.00";
                        } else if (pct >= 33) {
                          computedGrade = "D";
                          computedGpa = "1.00";
                        }
                      }

                      const letterGrade = rec.letterGrade || computedGrade;
                      const gpa =
                        rec.gpa !== undefined && rec.gpa !== null
                          ? Number(rec.gpa).toFixed(2)
                          : computedGpa;

                      const isPassedStudent =
                        rec.isPassed !== undefined
                          ? rec.isPassed
                          : obtainedMarks >= passMarks;

                      const studentName =
                        rec.student?.name ||
                        (rec as unknown as { studentName?: string })
                          ?.studentName ||
                        "Student";
                      const roll =
                        rec.student?.studentProfile?.rollNumber ||
                        (rec as unknown as { rollNumber?: string })
                          ?.rollNumber ||
                        (rec.student as unknown as { rollNumber?: string })
                          ?.rollNumber ||
                        (rec.student as unknown as { roll?: string })?.roll ||
                        "—";

                      return (
                        <TableRow key={rec.id || rec.studentId}>
                          {/* Rank Icon / Badge */}
                          <TableCell className="text-center font-bold font-mono">
                            {rank === 1 ? (
                              <span className="inline-flex size-6 items-center justify-center rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold ring-1 ring-amber-500/40">
                                🥇
                              </span>
                            ) : rank === 2 ? (
                              <span className="inline-flex size-6 items-center justify-center rounded-full bg-slate-300/40 text-slate-700 dark:text-slate-300 text-xs font-bold ring-1 ring-slate-400/40">
                                🥈
                              </span>
                            ) : rank === 3 ? (
                              <span className="inline-flex size-6 items-center justify-center rounded-full bg-amber-700/20 text-amber-800 dark:text-amber-500 text-xs font-bold ring-1 ring-amber-700/40">
                                🥉
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                #{rank}
                              </span>
                            )}
                          </TableCell>

                          {/* Student Info */}
                          <TableCell className="text-xs font-medium text-foreground">
                            <div>
                              <span>{studentName}</span>
                            </div>
                          </TableCell>

                          {/* Roll Number */}
                          <TableCell className="font-mono text-xs text-muted-foreground">
                            {roll}
                          </TableCell>

                          {/* Marks Obtained */}
                          <TableCell className="text-center font-mono font-bold text-xs text-foreground">
                            {rec.marksObtained}
                          </TableCell>

                          {/* Letter Grade */}
                          <TableCell className="text-center font-semibold text-xs">
                            {letterGrade}
                          </TableCell>

                          {/* GPA */}
                          <TableCell className="text-center font-mono text-xs text-muted-foreground">
                            {gpa}
                          </TableCell>

                          {/* Pass/Fail Status */}
                          <TableCell className="text-center">
                            {isPassedStudent ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                                Pass
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-destructive/10 text-destructive dark:text-rose-400 border border-destructive/30">
                                Fail
                              </span>
                            )}
                          </TableCell>

                          {/* Action Buttons */}
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                title="View Transcript / Report Card"
                                onClick={() => handleViewReportCard(rec)}
                              >
                                <Eye className="size-3.5 text-primary" />
                              </Button>

                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                title="Download PDF"
                                onClick={() => handleDownloadPdf(rec.studentId)}
                              >
                                <Download className="size-3.5 text-muted-foreground" />
                              </Button>

                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                title="Email Report Card"
                                onClick={() => handleSendEmail(rec.studentId)}
                                disabled={sendEmailMutation.isPending}
                              >
                                <Mail className="size-3.5 text-muted-foreground" />
                              </Button>
                            </div>
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
              Showing {sortedRecords.length} student scores
            </div>

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

      {/* Individual Student Report Card Transcript Modal */}
      <StudentReportCardModal
        exam={exam}
        record={selectedRecord}
        open={reportModalOpen}
        onOpenChange={setReportModalOpen}
      />
    </>
  );
}
