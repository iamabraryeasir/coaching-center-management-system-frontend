"use client";

import { format } from "date-fns";
import {
  AlertCircle,
  CalendarCheck,
  CheckCircle2,
  Clock,
  HelpCircle,
  XCircle,
} from "lucide-react";
import { useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMyTeacherAttendanceSummary } from "@/hooks";
import type { TeacherAttendanceStatus } from "@/types";

function getStatusBadge(status?: string | null) {
  const normalized = (status || "PRESENT").toUpperCase();
  switch (normalized) {
    case "PRESENT":
      return (
        <Badge
          variant="outline"
          className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] gap-1 px-2 py-0.5"
        >
          <CheckCircle2 className="size-3" />
          <span>Present</span>
        </Badge>
      );
    case "LATE":
      return (
        <Badge
          variant="outline"
          className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px] gap-1 px-2 py-0.5"
        >
          <Clock className="size-3" />
          <span>Late</span>
        </Badge>
      );
    case "ABSENT":
      return (
        <Badge
          variant="outline"
          className="bg-rose-500/10 text-rose-600 border-rose-500/20 text-[10px] gap-1 px-2 py-0.5"
        >
          <XCircle className="size-3" />
          <span>Absent</span>
        </Badge>
      );
    case "LEAVE":
    case "EXCUSED":
      return (
        <Badge
          variant="outline"
          className="bg-sky-500/10 text-sky-600 border-sky-500/20 text-[10px] gap-1 px-2 py-0.5"
        >
          <HelpCircle className="size-3" />
          <span>{normalized === "EXCUSED" ? "Excused" : "Leave"}</span>
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="text-[10px]">
          {status || "Recorded"}
        </Badge>
      );
  }
}

interface RawRecordItem {
  id?: string;
  _id?: string;
  teacherId?: string;
  date?: string;
  attendanceDate?: string;
  checkInTime?: string | null;
  checkIn?: string | null;
  arrivalTime?: string | null;
  time?: string | null;
  status?: TeacherAttendanceStatus | string;
  remarks?: string | null;
  remark?: string | null;
  note?: string | null;
  createdAt?: string;
}

export function TeacherAttendanceHistoryCard() {
  const { data: summaryResponse, isLoading } = useMyTeacherAttendanceSummary({
    page: 1,
    limit: 50,
  });

  const rawData = summaryResponse?.data;
  // Safely unwrap if backend nested data twice
  const summary = (rawData as { data?: unknown })?.data || rawData;

  // Extract history list across varied backend field names
  const historyList = useMemo<RawRecordItem[]>(() => {
    if (!summary) return [];
    if (Array.isArray(summary)) return summary as RawRecordItem[];

    const obj = summary as Record<string, unknown>;
    if (Array.isArray(obj.history)) return obj.history as RawRecordItem[];
    if (Array.isArray(obj.records)) return obj.records as RawRecordItem[];
    if (Array.isArray(obj.attendances))
      return obj.attendances as RawRecordItem[];
    if (Array.isArray(obj.recentRecords))
      return obj.recentRecords as RawRecordItem[];
    if (Array.isArray(obj.data)) return obj.data as RawRecordItem[];
    if (Array.isArray(obj.items)) return obj.items as RawRecordItem[];

    return [];
  }, [summary]);

  // Robust extraction of stats with fallback calculation from historyList
  const stats = useMemo(() => {
    const rawStats =
      ((summary as Record<string, unknown>)?.stats as Record<
        string,
        unknown
      >) ||
      (summary as Record<string, unknown>) ||
      {};

    const present = Number(
      rawStats.presentDays ??
        rawStats.presentCount ??
        rawStats.present ??
        historyList.filter(
          (h) => (h.status || "").toString().toUpperCase() === "PRESENT",
        ).length,
    );

    const late = Number(
      rawStats.lateDays ??
        rawStats.lateCount ??
        rawStats.late ??
        historyList.filter(
          (h) => (h.status || "").toString().toUpperCase() === "LATE",
        ).length,
    );

    const absent = Number(
      rawStats.absentDays ??
        rawStats.absentCount ??
        rawStats.absent ??
        historyList.filter(
          (h) => (h.status || "").toString().toUpperCase() === "ABSENT",
        ).length,
    );

    const leave = Number(
      rawStats.leaveDays ??
        rawStats.leaveCount ??
        rawStats.leave ??
        rawStats.excusedDays ??
        rawStats.excusedCount ??
        historyList.filter((h) => {
          const s = (h.status || "").toString().toUpperCase();
          return s === "LEAVE" || s === "EXCUSED";
        }).length,
    );

    const totalCalculated = present + late + absent + leave;
    const total = Number(
      rawStats.totalWorkingDays ??
        rawStats.totalDays ??
        rawStats.totalClasses ??
        rawStats.totalSessions ??
        rawStats.totalCount ??
        rawStats.total ??
        (totalCalculated > 0 ? totalCalculated : historyList.length),
    );

    const rate =
      rawStats.attendanceRate !== undefined && rawStats.attendanceRate !== null
        ? Number(rawStats.attendanceRate)
        : total > 0
          ? ((present + late) / total) * 100
          : 0;

    return {
      totalWorkingDays: Number.isNaN(total) ? 0 : total,
      presentDays: Number.isNaN(present) ? 0 : present,
      lateDays: Number.isNaN(late) ? 0 : late,
      absentDays: Number.isNaN(absent) ? 0 : absent,
      leaveDays: Number.isNaN(leave) ? 0 : leave,
      attendanceRate: Number.isNaN(rate) ? 0 : rate,
    };
  }, [summary, historyList]);

  return (
    <div className="space-y-6">
      {/* Metric Counters Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="rounded-xl border border-border/80 bg-card p-3 shadow-2xs space-y-1">
          <p className="text-[11px] font-medium text-muted-foreground">
            Working Days
          </p>
          <p className="text-xl font-bold text-foreground font-heading">
            {isLoading ? "..." : (stats.totalWorkingDays ?? 0)}
          </p>
          <p className="text-[10px] text-muted-foreground">Scheduled days</p>
        </div>

        <div className="rounded-xl border border-border/80 bg-card p-3 shadow-2xs space-y-1">
          <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
            On-Time Present
          </p>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-heading">
            {isLoading ? "..." : (stats.presentDays ?? 0)}
          </p>
          <p className="text-[10px] text-muted-foreground">Prompt check-ins</p>
        </div>

        <div className="rounded-xl border border-border/80 bg-card p-3 shadow-2xs space-y-1">
          <p className="text-[11px] font-medium text-amber-600 dark:text-amber-400">
            Late Arrivals
          </p>
          <p className="text-xl font-bold text-amber-600 dark:text-amber-400 font-heading">
            {isLoading ? "..." : (stats.lateDays ?? 0)}
          </p>
          <p className="text-[10px] text-muted-foreground">Recorded late</p>
        </div>

        <div className="rounded-xl border border-border/80 bg-card p-3 shadow-2xs space-y-1">
          <p className="text-[11px] font-medium text-rose-600 dark:text-rose-400">
            Absent Days
          </p>
          <p className="text-xl font-bold text-rose-600 dark:text-rose-400 font-heading">
            {isLoading ? "..." : (stats.absentDays ?? 0)}
          </p>
          <p className="text-[10px] text-muted-foreground">Unexcused absence</p>
        </div>

        <div className="rounded-xl border border-border/80 bg-card p-3 shadow-2xs space-y-1">
          <p className="text-[11px] font-medium text-sky-600 dark:text-sky-400">
            Authorized Leave
          </p>
          <p className="text-xl font-bold text-sky-600 dark:text-sky-400 font-heading">
            {isLoading ? "..." : (stats.leaveDays ?? 0)}
          </p>
          <p className="text-[10px] text-muted-foreground">Approved leaves</p>
        </div>

        <div className="rounded-xl border border-border/80 bg-card p-3 shadow-2xs space-y-1">
          <p className="text-[11px] font-medium text-primary">
            Attendance Rate
          </p>
          <p className="text-xl font-bold text-primary font-heading">
            {isLoading ? "..." : `${(stats.attendanceRate ?? 0).toFixed(1)}%`}
          </p>
          <p className="text-[10px] text-muted-foreground">Compliance score</p>
        </div>
      </div>

      {/* Attendance History Table Card */}
      <Card className="border border-border/80 shadow-2xs">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                <CalendarCheck className="size-4 text-primary" />
                <span>Recent Check-In Records</span>
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Showing last {historyList.length} records of your faculty campus
                attendance
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="space-y-3 py-6">
              {["sk-1", "sk-2", "sk-3", "sk-4", "sk-5"].map((id) => (
                <div
                  key={id}
                  className="h-10 bg-muted/40 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : historyList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted/60 text-muted-foreground mb-3">
                <AlertCircle className="size-6" />
              </div>
              <h4 className="text-sm font-semibold text-foreground mb-1">
                No Attendance Records Found
              </h4>
              <p className="text-xs text-muted-foreground max-w-sm">
                Your campus check-in history will appear here once recorded via
                the daily campus check-in banner.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/60 hover:bg-transparent">
                    <TableHead className="text-xs font-semibold text-muted-foreground h-10 w-36">
                      Date
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground h-10 w-32">
                      Arrival Time
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground h-10 w-28">
                      Status
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground h-10">
                      Remarks
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historyList.map((record: RawRecordItem, idx: number) => {
                    const rawDate =
                      record.date || record.attendanceDate || record.createdAt;
                    const parsedDate = rawDate ? new Date(rawDate) : null;
                    const formattedDate =
                      parsedDate && !Number.isNaN(parsedDate.getTime())
                        ? format(parsedDate, "EEE, MMM d, yyyy")
                        : rawDate || "—";

                    const rawCheckIn =
                      record.checkInTime ||
                      record.checkIn ||
                      record.arrivalTime ||
                      record.time ||
                      record.createdAt;
                    const checkInTimeFormatted = rawCheckIn
                      ? (() => {
                          const t = new Date(rawCheckIn);
                          return !Number.isNaN(t.getTime())
                            ? format(t, "h:mm a")
                            : String(rawCheckIn);
                        })()
                      : "—";

                    const recordId =
                      record.id || record._id || `record-${rawDate}-${idx}`;
                    const remarks =
                      record.remarks || record.remark || record.note || "—";

                    return (
                      <TableRow
                        key={recordId}
                        className="border-border/60 hover:bg-muted/30 transition-colors"
                      >
                        <TableCell className="text-xs font-medium text-foreground py-3">
                          {formattedDate}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground py-3">
                          <span className="inline-flex items-center gap-1 font-mono text-[11px]">
                            {checkInTimeFormatted}
                          </span>
                        </TableCell>
                        <TableCell className="py-3">
                          {getStatusBadge(record.status)}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground py-3 truncate max-w-xs">
                          {remarks}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
