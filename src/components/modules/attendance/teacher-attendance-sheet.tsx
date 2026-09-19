"use client";

import {
  Calendar,
  CalendarOff,
  CalendarX2,
  Check,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Clock,
  HelpCircle,
  Loader2,
  Lock,
  RotateCcw,
  Save,
  Search,
  ShieldAlert,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { DatePicker } from "@/components/forms/date-picker";
import { Button } from "@/components/ui/button";
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
  useMarkBulkTeacherAttendanceMutation,
  useTeacherAttendanceSheet,
  useTeachers,
} from "@/hooks";
import { cn } from "@/lib/utils";
import type { TeacherAttendanceStatus, User } from "@/types";
import { AttendanceStatsRibbon } from "./attendance-stats-ribbon";

interface TeacherRowState {
  teacherId: string;
  teacher: User;
  status: TeacherAttendanceStatus | null;
  remarks: string;
}

const TEACHER_STATUS_CONFIG: Record<
  TeacherAttendanceStatus,
  {
    label: string;
    badgeClass: string;
    activeBg: string;
    rowBg: string;
    cardBorder: string;
    icon: typeof Check;
  }
> = {
  PRESENT: {
    label: "Present",
    badgeClass:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    activeBg: "bg-emerald-600 text-white font-bold shadow-xs",
    rowBg: "bg-emerald-500/5 hover:bg-emerald-500/10",
    cardBorder: "border-emerald-500/40 bg-emerald-500/5",
    icon: Check,
  },
  ABSENT: {
    label: "Absent",
    badgeClass:
      "bg-destructive/10 text-destructive dark:text-rose-400 border-destructive/30",
    activeBg: "bg-destructive text-white font-bold shadow-xs",
    rowBg: "bg-destructive/5 hover:bg-destructive/10",
    cardBorder: "border-destructive/40 bg-destructive/5",
    icon: X,
  },
  LATE: {
    label: "Late",
    badgeClass:
      "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30",
    activeBg: "bg-amber-500 text-white font-bold shadow-xs",
    rowBg: "bg-amber-500/5 hover:bg-amber-500/10",
    cardBorder: "border-amber-500/40 bg-amber-500/5",
    icon: Clock,
  },
  LEAVE: {
    label: "Leave",
    badgeClass:
      "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30",
    activeBg: "bg-purple-600 text-white font-bold shadow-xs",
    rowBg: "bg-purple-500/5 hover:bg-purple-500/10",
    cardBorder: "border-purple-500/40 bg-purple-500/5",
    icon: CalendarOff,
  },
};

const TEACHER_STATUSES: TeacherAttendanceStatus[] = [
  "PRESENT",
  "ABSENT",
  "LATE",
  "LEAVE",
];

export function TeacherAttendanceSheet() {
  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [searchQuery, setSearchQuery] = useState("");
  const [rows, setRows] = useState<TeacherRowState[]>([]);

  const isToday = selectedDate === todayStr;
  const isReadOnly = !isToday;
  const isNextDisabled = isToday || selectedDate >= todayStr;

  // 1. Fetch active teachers
  const { data: teachersResponse, isLoading: isTeachersLoading } = useTeachers({
    limit: 100,
    status: "ACTIVE",
  });
  const teachers: User[] = teachersResponse?.data || [];

  // 2. Fetch attendance sheet for the selected date
  const { data: sheetResponse, isLoading: isSheetLoading } =
    useTeacherAttendanceSheet(selectedDate);
  const existingRecords = sheetResponse?.data?.records || [];
  const hasExistingRecords = existingRecords.length > 0;

  const markBulkMutation = useMarkBulkTeacherAttendanceMutation();

  // Populate local rows
  useEffect(() => {
    if (teachers.length === 0) {
      setRows([]);
      return;
    }

    const nextRows: TeacherRowState[] = teachers.map((teacher) => {
      const match = existingRecords.find(
        (r) => r.teacherId === teacher.id || r.teacher?.id === teacher.id,
      );

      return {
        teacherId: teacher.id,
        teacher,
        status: match
          ? (match.status as TeacherAttendanceStatus)
          : isReadOnly
            ? null
            : "PRESENT",
        remarks: match?.remarks || "",
      };
    });

    setRows(nextRows);
  }, [teachers, existingRecords, isReadOnly]);

  // Handle single status change
  const handleStatusChange = (
    teacherId: string,
    status: TeacherAttendanceStatus,
  ) => {
    if (isReadOnly) return;
    setRows((prev) =>
      prev.map((r) => (r.teacherId === teacherId ? { ...r, status } : r)),
    );
  };

  // Handle single remarks change
  const handleRemarksChange = (teacherId: string, remarks: string) => {
    if (isReadOnly) return;
    setRows((prev) =>
      prev.map((r) => (r.teacherId === teacherId ? { ...r, remarks } : r)),
    );
  };

  // Mark all present
  const handleMarkAllPresent = () => {
    if (isReadOnly) return;
    setRows((prev) => prev.map((r) => ({ ...r, status: "PRESENT" })));
  };

  // Mark all absent
  const handleMarkAllAbsent = () => {
    if (isReadOnly) return;
    setRows((prev) => prev.map((r) => ({ ...r, status: "ABSENT" })));
  };

  // Reset to original
  const handleReset = () => {
    if (teachers.length === 0) return;

    const nextRows: TeacherRowState[] = teachers.map((teacher) => {
      const match = existingRecords.find(
        (r) => r.teacherId === teacher.id || r.teacher?.id === teacher.id,
      );

      return {
        teacherId: teacher.id,
        teacher,
        status: match
          ? (match.status as TeacherAttendanceStatus)
          : isReadOnly
            ? null
            : "PRESENT",
        remarks: match?.remarks || "",
      };
    });

    setRows(nextRows);
  };

  // Step 1 day backwards
  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split("T")[0]);
  };

  // Step 1 day forward (only before or up to today)
  const handleNextDay = () => {
    if (isNextDisabled) return;
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    const nextStr = d.toISOString().split("T")[0];
    if (nextStr <= todayStr) {
      setSelectedDate(nextStr);
    }
  };

  // Jump to today
  const handleToday = () => {
    setSelectedDate(todayStr);
  };

  // Save bulk mutation (Today only)
  const handleSave = async () => {
    if (isReadOnly || rows.length === 0) return;

    await markBulkMutation.mutateAsync({
      date: selectedDate,
      records: rows.map((r) => ({
        teacherId: r.teacherId,
        status: r.status || "PRESENT",
        remarks: r.remarks.trim() || undefined,
      })),
    });
  };

  // Filter rows
  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) return rows;
    const q = searchQuery.toLowerCase();
    return rows.filter(
      (r) =>
        r.teacher.name.toLowerCase().includes(q) ||
        r.teacher.email.toLowerCase().includes(q) ||
        r.teacher.teacherProfile?.designation?.toLowerCase().includes(q),
    );
  }, [rows, searchQuery]);

  // Real-time KPI statistics
  const stats = useMemo(() => {
    if (isReadOnly && !hasExistingRecords) {
      return {
        total: teachers.length,
        present: 0,
        absent: 0,
        late: 0,
        leave: 0,
        rate: 0,
      };
    }
    const recordedRows = rows.filter((r) => r.status !== null);
    const total = recordedRows.length || rows.length;
    const present = rows.filter((r) => r.status === "PRESENT").length;
    const absent = rows.filter((r) => r.status === "ABSENT").length;
    const late = rows.filter((r) => r.status === "LATE").length;
    const leave = rows.filter((r) => r.status === "LEAVE").length;
    const rate = total > 0 ? (present / total) * 100 : 0;
    return { total, present, absent, late, leave, rate };
  }, [rows, isReadOnly, hasExistingRecords, teachers.length]);

  const isLoading = isTeachersLoading || isSheetLoading;

  return (
    <div className="space-y-4">
      {/* 1. KPI Ribbon */}
      <AttendanceStatsRibbon
        totalEnrolled={stats.total}
        presentCount={stats.present}
        absentCount={stats.absent}
        lateCount={stats.late}
        leaveCount={stats.leave}
        showLeave={true}
        attendanceRate={stats.rate}
        isLoading={isLoading}
        label="Teachers"
      />

      {/* 2. Controls Toolbar */}
      <div className="rounded-xl border border-border/70 bg-card/60 p-3.5 shadow-2xs space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Date Navigator */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <div className="inline-flex items-center rounded-lg border border-border/70 bg-background p-0.5 shadow-2xs shrink-0">
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={handlePrevDay}
                aria-label="Previous day"
                className="size-7 text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft className="size-3.5" />
              </Button>

              <Button
                type="button"
                variant={isToday ? "secondary" : "ghost"}
                size="xs"
                onClick={handleToday}
                className="h-7 px-2.5 text-xs font-semibold"
              >
                Today
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={handleNextDay}
                disabled={isNextDisabled}
                aria-label="Next day"
                className="size-7 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="size-3.5" />
              </Button>
            </div>

            {/* Shadcn Date Picker (Clamped to Today Max) */}
            <DatePicker
              value={selectedDate}
              onChange={setSelectedDate}
              toDate={new Date()}
              disabled={isLoading || markBulkMutation.isPending}
              className="h-9 flex-1 sm:w-40 sm:flex-none"
            />
          </div>

          {/* Primary Save Button or Read-Only Status Indicator */}
          <div className="flex items-center justify-end w-full sm:w-auto shrink-0">
            {isReadOnly ? (
              <div className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-muted/60 text-muted-foreground border border-border/80 text-xs font-semibold w-full sm:w-auto">
                <Lock className="size-3.5 text-muted-foreground shrink-0" />
                <span>Historical View (Read-Only)</span>
              </div>
            ) : (
              <Button
                type="button"
                onClick={handleSave}
                disabled={
                  markBulkMutation.isPending ||
                  isLoading ||
                  teachers.length === 0
                }
                size="sm"
                className="gap-1.5 font-medium shadow-sm w-full sm:w-auto min-w-32"
              >
                {markBulkMutation.isPending ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="size-3.5" />
                    <span>Save Teacher Attendance</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Quick Search & Bulk Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 pt-2 border-t border-border/60">
          <div className="relative w-full sm:w-64">
            <Search className="size-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search teacher by name..."
              className="h-8 pl-8 text-xs bg-background"
            />
          </div>

          {!isReadOnly ? (
            <div className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap">
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={handleMarkAllPresent}
                disabled={isLoading || teachers.length === 0}
                className="h-7 text-xs gap-1 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10 flex-1 sm:flex-initial"
              >
                <CheckCheck className="size-3 text-emerald-600 dark:text-emerald-400" />
                <span>Mark All Present</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={handleMarkAllAbsent}
                disabled={isLoading || teachers.length === 0}
                className="h-7 text-xs gap-1 border-destructive/30 text-destructive dark:text-rose-400 hover:bg-destructive/10 flex-1 sm:flex-initial"
              >
                <XCircle className="size-3" />
                <span>Mark All Absent</span>
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={handleReset}
                disabled={isLoading}
                className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground shrink-0"
              >
                <RotateCcw className="size-3" />
                <span>Reset</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <ShieldAlert className="size-3.5 text-amber-500 shrink-0" />
              <span>
                Past staff attendance records are locked for historical
                auditing.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Table / Card View or Not Found Empty State */}
      {isLoading ? (
        <div className="rounded-xl border border-border/70 bg-card/60 p-4 space-y-3">
          {["sk-1", "sk-2", "sk-3", "sk-4"].map((skKey) => (
            <div
              key={skKey}
              className="flex items-center justify-between gap-4 py-2"
            >
              <Skeleton className="h-9 w-44 rounded-md" />
              <Skeleton className="h-8 w-60 rounded-lg" />
            </div>
          ))}
        </div>
      ) : isReadOnly && !hasExistingRecords ? (
        <div className="rounded-xl border border-border/70 bg-card/60 p-12 text-center shadow-2xs flex flex-col items-center justify-center space-y-3 w-full">
          <div className="flex size-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-1">
            <CalendarX2 className="size-6" />
          </div>
          <h3 className="font-heading font-semibold text-base text-foreground">
            No Attendance Record Found
          </h3>
          <p className="text-xs text-muted-foreground max-w-md leading-relaxed">
            Staff attendance was not recorded on{" "}
            <strong className="text-foreground">
              {new Date(selectedDate).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </strong>
            .
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleToday}
            className="gap-2 text-xs font-semibold mt-1"
          >
            <Calendar className="size-3.5" />
            <span>Jump to Today</span>
          </Button>
        </div>
      ) : filteredRows.length === 0 ? (
        <div className="rounded-xl border border-border/70 bg-card/60 p-12 text-center shadow-2xs flex flex-col items-center justify-center space-y-2 w-full">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-1">
            <Users className="size-6" />
          </div>
          <h3 className="font-heading font-semibold text-base text-foreground">
            No Teachers Found
          </h3>
          <p className="text-xs text-muted-foreground max-w-md leading-relaxed">
            No teacher accounts match your search filters or exist in the
            institution directory.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table (>= md) */}
          <div className="hidden md:block rounded-xl border border-border/70 bg-card/60 overflow-hidden shadow-2xs">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="w-12 text-center font-mono">
                    #
                  </TableHead>
                  <TableHead className="min-w-56">Teacher Details</TableHead>
                  <TableHead className="min-w-72 text-center">
                    {isReadOnly ? "Attendance Status" : "Daily Status"}
                  </TableHead>
                  <TableHead className="min-w-48">
                    Duty Note / Remarks
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredRows.map((row, index) => {
                  const { teacherId, teacher, status, remarks } = row;
                  const config = status ? TEACHER_STATUS_CONFIG[status] : null;
                  const StatusIcon = config?.icon || HelpCircle;
                  const initials = teacher.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase();

                  return (
                    <TableRow
                      key={teacherId}
                      className={cn(
                        "group transition-colors",
                        config ? config.rowBg : "bg-card hover:bg-muted/30",
                      )}
                    >
                      <TableCell className="text-center font-mono text-xs text-muted-foreground font-semibold">
                        {index + 1}
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary text-xs shadow-2xs">
                            {initials}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-sm text-foreground truncate">
                              {teacher.name}
                            </span>
                            <span className="text-[11px] text-muted-foreground truncate">
                              {teacher.teacherProfile?.designation || "Teacher"}
                              {teacher.teacherProfile?.specialization &&
                                ` • ${teacher.teacherProfile.specialization}`}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        {isReadOnly ? (
                          <div className="flex justify-center">
                            {config ? (
                              <span
                                className={cn(
                                  "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-2xs",
                                  config.badgeClass,
                                )}
                              >
                                <StatusIcon className="size-3.5" />
                                <span>{config.label}</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border border-border/80 bg-muted/60 text-muted-foreground shadow-2xs">
                                <HelpCircle className="size-3.5" />
                                <span>Not Recorded</span>
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-1.5 p-1 rounded-lg bg-muted/40 border border-border/60 max-w-fit mx-auto shadow-2xs">
                            {TEACHER_STATUSES.map((st) => {
                              const itemConfig = TEACHER_STATUS_CONFIG[st];
                              const ItemIcon = itemConfig.icon;
                              const isSelected = status === st;

                              return (
                                <button
                                  key={st}
                                  type="button"
                                  onClick={() =>
                                    handleStatusChange(teacherId, st)
                                  }
                                  className={cn(
                                    "px-2.5 py-1 rounded-md text-xs font-semibold inline-flex items-center gap-1 transition-all cursor-pointer",
                                    isSelected
                                      ? itemConfig.activeBg
                                      : "text-muted-foreground hover:text-foreground hover:bg-background/80",
                                  )}
                                >
                                  <ItemIcon className="size-3" />
                                  <span>{itemConfig.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </TableCell>

                      <TableCell>
                        {isReadOnly ? (
                          <span className="text-xs text-muted-foreground italic truncate block max-w-xs">
                            {remarks ? remarks : "—"}
                          </span>
                        ) : (
                          <Input
                            value={remarks || ""}
                            onChange={(e) =>
                              handleRemarksChange(teacherId, e.target.value)
                            }
                            placeholder="Duty note / leave reason..."
                            className="h-8 text-xs bg-background/80"
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards (< md) */}
          <div className="md:hidden space-y-2.5">
            {filteredRows.map((row, index) => {
              const { teacherId, teacher, status, remarks } = row;
              const config = status ? TEACHER_STATUS_CONFIG[status] : null;
              const StatusIcon = config?.icon || HelpCircle;
              const initials = teacher.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase();

              return (
                <div
                  key={teacherId}
                  className={cn(
                    "rounded-xl border border-border/70 bg-card p-3.5 shadow-2xs space-y-3",
                    config ? config.cardBorder : "border-border/70 bg-card",
                  )}
                >
                  <div className="flex items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary text-xs">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-xs text-foreground truncate">
                          {index + 1}. {teacher.name}
                        </h4>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {teacher.teacherProfile?.designation || "Teacher"}
                        </p>
                      </div>
                    </div>

                    {isReadOnly &&
                      (config ? (
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shrink-0",
                            config.badgeClass,
                          )}
                        >
                          <StatusIcon className="size-3" />
                          <span>{config.label}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border border-border/80 bg-muted/60 text-muted-foreground shrink-0">
                          <HelpCircle className="size-3" />
                          <span>Not Recorded</span>
                        </span>
                      ))}
                  </div>

                  {/* 4 Status Buttons (Editable only) */}
                  {!isReadOnly && (
                    <div className="grid grid-cols-4 gap-1 p-1 rounded-lg bg-muted/40 border border-border/60 text-[11px]">
                      {TEACHER_STATUSES.map((st) => {
                        const itemConfig = TEACHER_STATUS_CONFIG[st];
                        const isSelected = status === st;

                        return (
                          <button
                            key={st}
                            type="button"
                            onClick={() => handleStatusChange(teacherId, st)}
                            className={cn(
                              "py-1.5 rounded-md font-semibold flex items-center justify-center transition-all cursor-pointer",
                              isSelected
                                ? itemConfig.activeBg
                                : "text-muted-foreground hover:bg-background/80",
                            )}
                          >
                            {itemConfig.label}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {isReadOnly ? (
                    remarks && (
                      <div className="rounded-md bg-muted/30 p-2 text-xs text-muted-foreground italic border border-border/40">
                        <span className="font-semibold text-[11px] not-italic text-foreground block mb-0.5">
                          Duty Note / Leave Reason:
                        </span>
                        {remarks}
                      </div>
                    )
                  ) : (
                    <Input
                      value={remarks || ""}
                      onChange={(e) =>
                        handleRemarksChange(teacherId, e.target.value)
                      }
                      placeholder="Duty note / leave reason..."
                      className="h-8 text-xs bg-background"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
