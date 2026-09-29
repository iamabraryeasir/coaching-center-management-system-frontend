"use client";

import { format, parseISO } from "date-fns";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileCheck,
  FileText,
  HelpCircle,
  User,
  XCircle,
} from "lucide-react";
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
import type { AttendanceStatus, StudentAttendanceHistoryItem } from "@/types";

interface StudentAttendanceHistoryTableProps {
  records: StudentAttendanceHistoryItem[];
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const STATUS_CONFIG: Record<
  AttendanceStatus,
  {
    label: string;
    icon: typeof CheckCircle2;
    className: string;
  }
> = {
  PRESENT: {
    label: "Present",
    icon: CheckCircle2,
    className:
      "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  },
  LATE: {
    label: "Late Arrival",
    icon: Clock,
    className:
      "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  },
  ABSENT: {
    label: "Absent",
    icon: XCircle,
    className:
      "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400",
  },
  EXCUSED: {
    label: "Excused",
    icon: FileCheck,
    className:
      "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-400",
  },
  LEAVE: {
    label: "Authorized Leave",
    icon: FileText,
    className:
      "border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-400",
  },
};

export function StudentAttendanceHistoryTable({
  records,
  currentPage,
  totalPages,
  totalRecords,
  pageSize,
  onPageChange,
}: StudentAttendanceHistoryTableProps) {
  const formatDateSafe = (dateStr: string) => {
    try {
      const date = dateStr.includes("T")
        ? parseISO(dateStr)
        : new Date(dateStr);
      return format(date, "EEE, MMM d, yyyy");
    } catch {
      return dateStr;
    }
  };

  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalRecords);

  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-10 sm:py-12 text-center px-4">
        <div className="size-11 sm:size-12 rounded-full bg-muted/60 flex items-center justify-center mb-3">
          <HelpCircle className="size-5 sm:size-6 text-muted-foreground" />
        </div>
        <h4 className="font-heading text-sm sm:text-base font-semibold text-foreground">
          No Attendance Records Found
        </h4>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mt-1">
          No lecture check-in records match the current filter criteria or
          attendance has not been logged yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mobile Card List (shown on < sm screens) */}
      <div className="space-y-2.5 sm:hidden">
        {records.map((record) => {
          const config = STATUS_CONFIG[record.status] || STATUS_CONFIG.PRESENT;
          const StatusIcon = config.icon;
          const batchName =
            record.batchName || record.batch?.name || "Academic Lecture";
          const markedByName = record.markedBy?.name || "Faculty In-Charge";

          return (
            <div
              key={record.id}
              className="rounded-lg border border-border/80 bg-card p-3.5 space-y-2 text-sm shadow-2xs"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-foreground text-xs">
                  {formatDateSafe(record.date)}
                </span>
                <Badge
                  variant="outline"
                  className={`gap-1 font-medium text-[11px] px-2 py-0.5 ${config.className}`}
                >
                  <StatusIcon className="size-3" />
                  {config.label}
                </Badge>
              </div>

              <div className="font-semibold text-foreground">{batchName}</div>

              <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/50">
                <span className="flex items-center gap-1 truncate">
                  <User className="size-3 shrink-0" />
                  {markedByName}
                </span>
                {record.remarks && (
                  <span className="italic truncate max-w-[140px]">
                    "{record.remarks}"
                  </span>
                )}
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
                <TableHead className="w-[180px] font-semibold text-foreground">
                  Date
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  Enrolled Course / Batch
                </TableHead>
                <TableHead className="w-[150px] font-semibold text-foreground">
                  Status
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  Instructor / Recorded By
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  Remarks / Notes
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record) => {
                const config =
                  STATUS_CONFIG[record.status] || STATUS_CONFIG.PRESENT;
                const StatusIcon = config.icon;
                const batchName =
                  record.batchName || record.batch?.name || "Academic Lecture";
                const markedByName =
                  record.markedBy?.name || "Faculty In-Charge";

                return (
                  <TableRow
                    key={record.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    {/* Date Column */}
                    <TableCell className="font-medium text-foreground whitespace-nowrap">
                      {formatDateSafe(record.date)}
                    </TableCell>

                    {/* Batch Name */}
                    <TableCell>
                      <span className="font-medium text-foreground">
                        {batchName}
                      </span>
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`gap-1.5 font-medium ${config.className}`}
                      >
                        <StatusIcon className="size-3.5" />
                        {config.label}
                      </Badge>
                    </TableCell>

                    {/* Recorded By */}
                    <TableCell className="text-sm text-muted-foreground">
                      {markedByName}
                    </TableCell>

                    {/* Remarks */}
                    <TableCell className="text-sm text-muted-foreground">
                      {record.remarks ? (
                        <span className="italic">{record.remarks}</span>
                      ) : (
                        <span className="text-muted-foreground/60">—</span>
                      )}
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
            records
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
