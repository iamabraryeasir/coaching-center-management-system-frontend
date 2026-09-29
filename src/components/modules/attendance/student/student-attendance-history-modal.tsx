"use client";

import {
  Calendar,
  CalendarOff,
  CalendarX2,
  CheckCircle2,
  Clock,
  GraduationCap,
  Hash,
  HelpCircle,
  Layers,
  Phone,
  XCircle,
} from "lucide-react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
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
import { useStudentAttendanceHistory } from "@/hooks";
import { cn } from "@/lib/utils";
import type {
  AttendanceStatus,
  StudentAttendanceHistoryItem,
  User,
} from "@/types";

interface StudentAttendanceHistoryModalProps {
  student: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STATUS_BADGE_CONFIG: Record<
  AttendanceStatus,
  {
    label: string;
    badgeClass: string;
    icon: typeof CheckCircle2;
  }
> = {
  PRESENT: {
    label: "Present",
    badgeClass:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    icon: CheckCircle2,
  },
  ABSENT: {
    label: "Absent",
    badgeClass:
      "bg-destructive/10 text-destructive dark:text-rose-400 border-destructive/30",
    icon: XCircle,
  },
  LATE: {
    label: "Late",
    badgeClass:
      "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30",
    icon: Clock,
  },
  EXCUSED: {
    label: "Excused",
    badgeClass:
      "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/30",
    icon: HelpCircle,
  },
  LEAVE: {
    label: "Leave",
    badgeClass:
      "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30",
    icon: CalendarOff,
  },
};

export function StudentAttendanceHistoryModal({
  student,
  open,
  onOpenChange,
}: StudentAttendanceHistoryModalProps) {
  const studentUserId =
    student?.id ||
    (student as unknown as { userId?: string })?.userId ||
    (student as unknown as { studentId?: string })?.studentId ||
    "";

  const { data: historyResponse, isLoading } = useStudentAttendanceHistory(
    studentUserId,
    { limit: 50 },
    open && Boolean(studentUserId),
  );

  const summaryData = historyResponse?.data;

  // Extract history list supporting various backend API response formats (recentRecords, history, records)
  const historyList: StudentAttendanceHistoryItem[] = useMemo(() => {
    if (!summaryData) return [];
    if (Array.isArray(summaryData)) {
      return summaryData as unknown as StudentAttendanceHistoryItem[];
    }
    if (Array.isArray(summaryData.recentRecords)) {
      return summaryData.recentRecords;
    }
    if (Array.isArray(summaryData.history)) {
      return summaryData.history;
    }
    if (Array.isArray(summaryData.records)) {
      return summaryData.records;
    }
    const rawObj = summaryData as unknown as {
      recentRecords?: StudentAttendanceHistoryItem[];
      records?: StudentAttendanceHistoryItem[];
      attendances?: StudentAttendanceHistoryItem[];
      data?: StudentAttendanceHistoryItem[];
    };
    return (
      rawObj.recentRecords ||
      rawObj.records ||
      rawObj.attendances ||
      rawObj.data ||
      []
    );
  }, [summaryData]);

  // Compute robust statistics with fallback calculation from history list
  const stats = useMemo(() => {
    const rawStats = summaryData?.stats;

    const total =
      rawStats?.totalSessions ??
      rawStats?.totalClasses ??
      (rawStats as unknown as { total?: number })?.total ??
      (rawStats as unknown as { totalCount?: number })?.totalCount ??
      (rawStats as unknown as { totalWorkingDays?: number })
        ?.totalWorkingDays ??
      historyList.length;

    const present =
      rawStats?.presentCount ??
      (rawStats as unknown as { present?: number })?.present ??
      (rawStats as unknown as { presentDays?: number })?.presentDays ??
      historyList.filter((h) => h.status === "PRESENT").length;

    const absent =
      rawStats?.absentCount ??
      (rawStats as unknown as { absent?: number })?.absent ??
      (rawStats as unknown as { absentDays?: number })?.absentDays ??
      historyList.filter((h) => h.status === "ABSENT").length;

    const late =
      rawStats?.lateCount ??
      (rawStats as unknown as { late?: number })?.late ??
      (rawStats as unknown as { lateDays?: number })?.lateDays ??
      historyList.filter((h) => h.status === "LATE").length;

    const excused =
      rawStats?.excusedCount ??
      (rawStats as unknown as { excused?: number })?.excused ??
      (rawStats as unknown as { excusedDays?: number })?.excusedDays ??
      historyList.filter((h) => h.status === "EXCUSED").length;

    const leave =
      rawStats?.leaveCount ??
      (rawStats as unknown as { leave?: number })?.leave ??
      (rawStats as unknown as { leaveDays?: number })?.leaveDays ??
      historyList.filter((h) => h.status === "LEAVE").length;

    const rate =
      rawStats?.attendanceRate !== undefined
        ? Number(rawStats.attendanceRate)
        : total > 0
          ? (present / total) * 100
          : 0;

    return {
      totalClasses: total,
      presentCount: present,
      absentCount: absent,
      lateCount: late,
      excusedCount: excused,
      leaveCount: leave,
      attendanceRate: rate,
    };
  }, [summaryData, historyList]);

  const studentDisplayName =
    summaryData?.studentName || student?.name || "Student";

  const initials =
    studentDisplayName
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "ST";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="p-5 border-b border-border/70 bg-card">
          <div className="flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary text-sm shadow-2xs">
              {initials}
            </div>
            <div>
              <DialogTitle className="font-heading text-lg font-bold text-foreground">
                {studentDisplayName} — Attendance History
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Track historical classroom presence, punctuality rate, and
                attendance notes.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Student Profile Meta Bar */}
          <div className="rounded-xl border border-border/70 bg-muted/30 p-3.5 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Hash className="size-3.5" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] text-muted-foreground block truncate">
                  Roll Number
                </span>
                <span className="font-mono font-semibold text-foreground truncate block">
                  {student?.studentProfile?.rollNumber ||
                    student?.id.slice(0, 8) ||
                    "—"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Phone className="size-3.5" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] text-muted-foreground block truncate">
                  Guardian Phone
                </span>
                <span className="font-mono text-foreground truncate block">
                  {student?.studentProfile?.guardianPhone || "N/A"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <GraduationCap className="size-3.5" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] text-muted-foreground block truncate">
                  Class Level
                </span>
                <span className="font-semibold text-foreground truncate block">
                  {student?.studentProfile?.classLevel || "Enrolled Student"}
                </span>
              </div>
            </div>
          </div>

          {/* KPI Stats Ribbon (5 statuses + Total) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {/* 1. Total Sessions */}
            <div className="rounded-xl border border-border/70 bg-card p-3 shadow-2xs">
              <div className="flex items-center justify-between text-muted-foreground mb-1">
                <span className="text-[11px] font-medium">Total Classes</span>
                <Calendar className="size-3.5 text-primary" />
              </div>
              <p className="text-lg font-bold text-foreground">
                {stats.totalClasses}
              </p>
            </div>

            {/* 2. Present Rate */}
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10 p-3 shadow-2xs">
              <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-300 mb-1">
                <span className="text-[11px] font-medium">Present Rate</span>
                <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-emerald-800 dark:text-emerald-200">
                  {Math.round(stats.attendanceRate)}%
                </span>
                <span className="text-[10px] text-emerald-600/80 font-medium">
                  ({stats.presentCount})
                </span>
              </div>
            </div>

            {/* 3. Absent */}
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 dark:bg-destructive/10 p-3 shadow-2xs">
              <div className="flex items-center justify-between text-destructive dark:text-rose-400 mb-1">
                <span className="text-[11px] font-medium">Absent</span>
                <XCircle className="size-3.5 text-destructive dark:text-rose-400" />
              </div>
              <p className="text-lg font-bold text-destructive dark:text-rose-300">
                {stats.absentCount}
              </p>
            </div>

            {/* 4. Late */}
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/10 p-3 shadow-2xs">
              <div className="flex items-center justify-between text-amber-700 dark:text-amber-300 mb-1">
                <span className="text-[11px] font-medium">Late</span>
                <Clock className="size-3.5 text-amber-600 dark:text-amber-400" />
              </div>
              <p className="text-lg font-bold text-amber-800 dark:text-amber-200">
                {stats.lateCount}
              </p>
            </div>

            {/* 5. Excused */}
            <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 dark:bg-sky-500/10 p-3 shadow-2xs">
              <div className="flex items-center justify-between text-sky-700 dark:text-sky-300 mb-1">
                <span className="text-[11px] font-medium">Excused</span>
                <HelpCircle className="size-3.5 text-sky-600 dark:text-sky-400" />
              </div>
              <p className="text-lg font-bold text-sky-800 dark:text-sky-200">
                {stats.excusedCount}
              </p>
            </div>

            {/* 6. Leave */}
            <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 dark:bg-purple-500/10 p-3 shadow-2xs">
              <div className="flex items-center justify-between text-purple-700 dark:text-purple-300 mb-1">
                <span className="text-[11px] font-medium">Leave</span>
                <CalendarOff className="size-3.5 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-lg font-bold text-purple-800 dark:text-purple-200">
                {stats.leaveCount}
              </p>
            </div>
          </div>

          {/* Historical Log Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-foreground">
                Attendance Session Logs
              </h4>
              <span className="text-[11px] text-muted-foreground">
                Showing {historyList.length} records
              </span>
            </div>

            <div className="rounded-xl border border-border/70 bg-card overflow-hidden shadow-2xs">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="w-36">Date</TableHead>
                    <TableHead className="w-28 text-center">Status</TableHead>
                    <TableHead className="min-w-40">Batch</TableHead>
                    <TableHead className="min-w-44">Remarks / Note</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {isLoading ? (
                    ["sk-1", "sk-2", "sk-3", "sk-4"].map((skKey) => (
                      <TableRow key={skKey}>
                        <TableCell>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-16 mx-auto rounded-full" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-28" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-36" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : historyList.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-36 text-center">
                        <div className="flex flex-col items-center justify-center gap-1.5 text-muted-foreground">
                          <CalendarX2 className="size-6 opacity-40 mb-0.5" />
                          <p className="font-semibold text-xs text-foreground">
                            No Attendance Records Logged
                          </p>
                          <p className="text-[11px]">
                            No historical attendance sessions recorded for this
                            student yet.
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    historyList.map((record) => {
                      const badgeCfg =
                        STATUS_BADGE_CONFIG[record.status] ||
                        STATUS_BADGE_CONFIG.PRESENT;
                      const StatusIcon = badgeCfg.icon;

                      return (
                        <TableRow key={record.id}>
                          <TableCell className="font-mono text-xs text-foreground font-medium">
                            {new Date(record.date).toLocaleDateString("en-US", {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </TableCell>
                          <TableCell className="text-center">
                            <span
                              className={cn(
                                "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-2xs",
                                badgeCfg.badgeClass,
                              )}
                            >
                              <StatusIcon className="size-3" />
                              <span>{badgeCfg.label}</span>
                            </span>
                          </TableCell>
                          <TableCell className="text-xs text-foreground font-medium">
                            <div className="flex items-center gap-1.5">
                              <Layers className="size-3 text-muted-foreground shrink-0" />
                              <span className="truncate">
                                {record.batch?.name ||
                                  record.batchName ||
                                  "Academic Batch"}
                              </span>
                            </div>
                            {record.markedBy?.name && (
                              <span className="text-[10px] text-muted-foreground/80 block mt-0.5">
                                By: {record.markedBy.name}
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground italic">
                            {record.remarks || "—"}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="m-0 p-4 border-t border-border/70 bg-card sm:justify-end">
          <DialogClose
            render={
              <Button type="button" variant="outline" size="sm">
                Close
              </Button>
            }
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
