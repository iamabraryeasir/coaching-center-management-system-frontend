"use client";

import {
  Award,
  CheckCircle2,
  Download,
  FileText,
  Mail,
  XCircle,
} from "lucide-react";
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
import { siteConfig } from "@/config/site";
import { useSendReportCardEmailMutation } from "@/hooks";
import type { Exam, ExamMarkRecord } from "@/types";

interface StudentReportCardModalProps {
  exam: Exam | null;
  record: ExamMarkRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Robust grading calculator fallback
 */
function computeGradeAndGpa(
  marks: number,
  totalMarks: number,
  passMarks: number,
): { letterGrade: string; gpa: string; isPassed: boolean } {
  if (marks < passMarks) {
    return { letterGrade: "F", gpa: "0.00", isPassed: false };
  }

  const percentage = totalMarks > 0 ? (marks / totalMarks) * 100 : 0;

  if (percentage >= 80)
    return { letterGrade: "A+", gpa: "5.00", isPassed: true };
  if (percentage >= 70)
    return { letterGrade: "A", gpa: "4.00", isPassed: true };
  if (percentage >= 60)
    return { letterGrade: "A-", gpa: "3.50", isPassed: true };
  if (percentage >= 50)
    return { letterGrade: "B", gpa: "3.00", isPassed: true };
  if (percentage >= 40)
    return { letterGrade: "C", gpa: "2.00", isPassed: true };
  if (percentage >= 33)
    return { letterGrade: "D", gpa: "1.00", isPassed: true };

  return { letterGrade: "F", gpa: "0.00", isPassed: false };
}

export function StudentReportCardModal({
  exam,
  record,
  open,
  onOpenChange,
}: StudentReportCardModalProps) {
  const sendEmailMutation = useSendReportCardEmailMutation();

  if (!exam || !record) return null;

  const total = exam.totalMarks || 100;
  const passMarks = exam.passMarks || 40;
  const obtained = Number(record.marksObtained);
  const percentage = total > 0 ? Math.round((obtained / total) * 100) : 0;

  // Grade & GPA computation with robust fallback
  const computed = computeGradeAndGpa(obtained, total, passMarks);
  const letterGrade = record.letterGrade || computed.letterGrade;
  const gpa =
    record.gpa !== undefined && record.gpa !== null
      ? Number(record.gpa).toFixed(2)
      : computed.gpa;
  const isPassed =
    record.isPassed !== undefined ? record.isPassed : computed.isPassed;

  const studentName =
    record.student?.name ||
    (record as unknown as { studentName?: string })?.studentName ||
    "Student";

  const rollNumber =
    record.student?.studentProfile?.rollNumber ||
    (record as unknown as { rollNumber?: string })?.rollNumber ||
    (record.student as unknown as { rollNumber?: string })?.rollNumber ||
    (record.student as unknown as { roll?: string })?.roll ||
    "—";

  const handleDownloadPdf = () => {
    const url = getReportCardPdfUrl(exam.id, record.studentId, true);
    window.open(url, "_blank");
  };

  const handleSendEmail = () => {
    sendEmailMutation.mutate({
      examId: exam.id,
      studentId: record.studentId,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="p-5 border-b border-border/70 bg-card">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 font-bold text-primary shadow-2xs">
                <FileText className="size-6" />
              </div>
              <div>
                <DialogTitle className="font-heading text-lg font-bold text-foreground">
                  Official Academic Report Card
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Individual student assessment transcript and grading metrics.
                </DialogDescription>
              </div>
            </div>

            {/* Pass / Fail Stamp */}
            <div>
              {isPassed ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                  <CheckCircle2 className="size-3.5" />
                  PASSED
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-destructive/10 text-destructive dark:text-rose-400 border border-destructive/30">
                  <XCircle className="size-3.5" />
                  FAILED
                </span>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Modal Body: Printable Transcript Container */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 bg-card">
          {/* Institutional Letterhead */}
          <div className="text-center border-b border-border/70 pb-4">
            <h3 className="font-heading text-xl font-bold tracking-tight text-foreground">
              {siteConfig.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Academic Assessment & Performance Evaluation Sheet
            </p>
          </div>

          {/* Student & Exam Metadata Grid */}
          <div className="rounded-xl border border-border/70 bg-muted/30 p-4 grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[11px] text-muted-foreground block">
                Student Name
              </span>
              <span className="font-semibold text-foreground text-sm">
                {studentName}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-muted-foreground block">
                Roll Number
              </span>
              <span className="font-mono font-semibold text-foreground">
                {rollNumber}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-muted-foreground block">
                Academic Batch
              </span>
              <span className="font-semibold text-foreground">
                {exam.batch?.name || "Academic Batch"}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-muted-foreground block">
                Assessment Date
              </span>
              <span className="font-mono text-foreground">
                {new Date(exam.examDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* Score Overview Card */}
          <div className="rounded-xl border border-border/80 bg-linear-to-br from-primary/5 via-card to-card p-5 shadow-2xs">
            <div className="text-center mb-4">
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                {exam.title}
              </span>
              <div className="flex items-baseline justify-center gap-2 mt-1">
                <span className="text-4xl font-extrabold text-foreground font-heading">
                  {obtained}
                </span>
                <span className="text-lg text-muted-foreground font-medium">
                  / {total}
                </span>
              </div>
              <span className="text-xs font-semibold text-primary">
                Score Percentage: {percentage}%
              </span>
            </div>

            {/* Performance KPIs (Grade, GPA, Rank) */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border/70 text-center">
              <div className="rounded-lg bg-card p-2.5 border border-border/60 shadow-2xs">
                <span className="text-[11px] text-muted-foreground block mb-0.5">
                  Letter Grade
                </span>
                <span className="text-lg font-bold text-foreground">
                  {letterGrade}
                </span>
              </div>

              <div className="rounded-lg bg-card p-2.5 border border-border/60 shadow-2xs">
                <span className="text-[11px] text-muted-foreground block mb-0.5">
                  GPA Points
                </span>
                <span className="text-lg font-bold text-foreground">{gpa}</span>
              </div>

              <div className="rounded-lg bg-card p-2.5 border border-border/60 shadow-2xs">
                <span className="text-[11px] text-muted-foreground block mb-0.5">
                  Batch Rank
                </span>
                <div className="flex items-center justify-center gap-1">
                  <Award className="size-4 text-amber-500" />
                  <span className="text-lg font-bold text-foreground">
                    {record.rank ? `#${record.rank}` : "—"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="m-0 p-4 border-t border-border/70 bg-card flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSendEmail}
              disabled={sendEmailMutation.isPending}
            >
              <Mail className="size-3.5 mr-1.5" />
              {sendEmailMutation.isPending ? "Sending..." : "Email to Student"}
            </Button>
            <Button type="button" size="sm" onClick={handleDownloadPdf}>
              <Download className="size-3.5 mr-1.5" />
              Download Official PDF
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
