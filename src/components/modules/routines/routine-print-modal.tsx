"use client";

import { Printer, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  type RoutinePrintProps,
  RoutinePrintSheet,
} from "./routine-print-layout";

interface RoutinePrintModalProps extends RoutinePrintProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RoutinePrintModal({
  open,
  onOpenChange,
  viewMode,
  schedule,
  batchName,
  teacherName,
}: RoutinePrintModalProps) {
  const handlePrint = () => {
    window.print();
  };

  const modeBadge =
    viewMode === "batch"
      ? `Batch: ${batchName || "Academic Batch"}`
      : viewMode === "teacher"
        ? `Faculty: ${teacherName || "Faculty Member"}`
        : "Master Timetable (All Classes)";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl md:max-w-6xl max-h-[92vh] flex flex-col p-0 gap-0 overflow-hidden">
        {/* Global Print Media Rules: Only prints #routine-printable-area on A4 Landscape */}
        <style jsx global>{`
          @media print {
            @page {
              size: A4 landscape;
              margin: 6mm;
            }
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body * {
              visibility: hidden !important;
            }
            #routine-printable-area,
            #routine-printable-area * {
              visibility: visible !important;
            }
            #routine-printable-area {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              margin: 0 !important;
              padding: 0 !important;
              background: white !important;
              color: black !important;
            }
          }
        `}</style>

        {/* Modal Top Control Header (Hidden when printing) */}
        <DialogHeader className="px-5 py-3.5 border-b border-border/70 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-card shrink-0 print:hidden">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <DialogTitle className="font-heading text-base font-bold text-foreground">
                Routine Print Preview
              </DialogTitle>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-md border border-primary/20">
                <Sparkles className="size-3" />
                <span>{modeBadge}</span>
              </span>
            </div>
            <DialogDescription className="text-xs text-muted-foreground">
              Official A4 landscape printable sheet formatted specifically for{" "}
              {viewMode === "batch"
                ? "enrolled students"
                : viewMode === "teacher"
                  ? "faculty scheduling"
                  : "central administration"}
              .
            </DialogDescription>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 justify-end">
            <DialogClose
              render={
                <Button type="button" variant="outline" size="sm">
                  Close
                </Button>
              }
            />
            <Button
              type="button"
              size="sm"
              onClick={handlePrint}
              className="gap-1.5 font-medium shadow-xs"
            >
              <Printer className="size-4" />
              <span>Print A4 / PDF</span>
            </Button>
          </div>
        </DialogHeader>

        {/* Document Preview Viewport (Scrollable Canvas) */}
        <div className="flex-1 overflow-y-auto bg-neutral-100 dark:bg-neutral-900 p-3 sm:p-6 flex justify-center">
          <div className="w-full max-w-[1050px] shadow-lg rounded-sm overflow-hidden bg-white">
            <RoutinePrintSheet
              viewMode={viewMode}
              schedule={schedule}
              batchName={batchName}
              teacherName={teacherName}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
