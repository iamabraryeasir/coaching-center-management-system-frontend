"use client";

import {
  CalendarOff,
  Check,
  Clock,
  HelpCircle,
  History,
  MoreHorizontal,
  Phone,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { cn } from "@/lib/utils";
import type { AttendanceStatus, User } from "@/types";

export interface StudentAttendanceRowState {
  studentId: string;
  student: User;
  status: AttendanceStatus | null;
  remarks: string;
  isModified?: boolean;
}

interface StudentAttendanceTableProps {
  rows: StudentAttendanceRowState[];
  onStatusChange: (studentId: string, status: AttendanceStatus) => void;
  onRemarksChange: (studentId: string, remarks: string) => void;
  onViewHistory: (student: User) => void;
  isLoading: boolean;
  batchName?: string;
  isReadOnly?: boolean;
}

const SKELETON_KEYS = ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5", "sk-6"];

const STATUS_CONFIG: Record<
  AttendanceStatus,
  {
    label: string;
    shortLabel: string;
    activeBg: string;
    badgeClass: string;
    rowBg: string;
    cardBorder: string;
    icon: typeof Check;
  }
> = {
  PRESENT: {
    label: "Present",
    shortLabel: "P",
    activeBg: "bg-emerald-600 text-white font-bold shadow-xs",
    badgeClass:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    rowBg: "bg-emerald-500/5 hover:bg-emerald-500/10",
    cardBorder: "border-emerald-500/40 bg-emerald-500/5",
    icon: Check,
  },
  ABSENT: {
    label: "Absent",
    shortLabel: "A",
    activeBg: "bg-destructive text-white font-bold shadow-xs",
    badgeClass:
      "bg-destructive/10 text-destructive dark:text-rose-400 border-destructive/30",
    rowBg: "bg-destructive/5 hover:bg-destructive/10",
    cardBorder: "border-destructive/40 bg-destructive/5",
    icon: X,
  },
  LATE: {
    label: "Late",
    shortLabel: "L",
    activeBg: "bg-amber-500 text-white font-bold shadow-xs",
    badgeClass:
      "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30",
    rowBg: "bg-amber-500/5 hover:bg-amber-500/10",
    cardBorder: "border-amber-500/40 bg-amber-500/5",
    icon: Clock,
  },
  EXCUSED: {
    label: "Excused",
    shortLabel: "E",
    activeBg: "bg-sky-600 text-white font-bold shadow-xs",
    badgeClass:
      "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/30",
    rowBg: "bg-sky-500/5 hover:bg-sky-500/10",
    cardBorder: "border-sky-500/40 bg-sky-500/5",
    icon: HelpCircle,
  },
  LEAVE: {
    label: "Leave",
    shortLabel: "LV",
    activeBg: "bg-purple-600 text-white font-bold shadow-xs",
    badgeClass:
      "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30",
    rowBg: "bg-purple-500/5 hover:bg-purple-500/10",
    cardBorder: "border-purple-500/40 bg-purple-500/5",
    icon: CalendarOff,
  },
};

const ALL_STATUSES: AttendanceStatus[] = [
  "PRESENT",
  "ABSENT",
  "LATE",
  "EXCUSED",
  "LEAVE",
];

export function StudentAttendanceTable({
  rows,
  onStatusChange,
  onRemarksChange,
  onViewHistory,
  isLoading,
  batchName,
  isReadOnly = false,
}: StudentAttendanceTableProps) {
  // Loading skeleton
  if (isLoading) {
    return (
      <div className="rounded-xl border border-border/70 bg-card/60 overflow-hidden shadow-2xs">
        <div className="p-4 space-y-3">
          {SKELETON_KEYS.map((skKey) => (
            <div
              key={skKey}
              className="flex items-center justify-between gap-4 py-2"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="size-9 rounded-full" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20 rounded-lg" />
                <Skeleton className="h-8 w-20 rounded-lg" />
                <Skeleton className="h-8 w-20 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-border/70 bg-card/60 p-12 text-center shadow-2xs flex flex-col items-center justify-center space-y-2 w-full">
        <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-1">
          <Users className="size-6" />
        </div>
        <h3 className="font-heading font-semibold text-base text-foreground">
          No Students in Batch
        </h3>
        <p className="text-xs text-muted-foreground max-w-md leading-relaxed">
          {batchName
            ? `There are no enrolled students currently assigned to ${batchName}.`
            : "Select an active batch to load the student roster and record daily attendance."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Desktop Spreadsheet Matrix (>= md) */}
      <div className="hidden md:block rounded-xl border border-border/70 bg-card/60 overflow-hidden shadow-2xs">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="w-12 text-center font-mono">#</TableHead>
              <TableHead className="min-w-56">Student Details</TableHead>
              <TableHead className="min-w-64 text-center">
                {isReadOnly ? "Attendance Status" : "Mark Status"}
              </TableHead>
              <TableHead className="min-w-48">Note / Remarks</TableHead>
              <TableHead className="w-16 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.map((row, index) => {
              const { studentId, student, status, remarks } = row;
              const config = status ? STATUS_CONFIG[status] : null;
              const StatusIcon = config?.icon || HelpCircle;
              const initials = student.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase();

              return (
                <TableRow
                  key={studentId}
                  className={cn(
                    "group transition-colors",
                    config ? config.rowBg : "bg-card hover:bg-muted/30",
                  )}
                >
                  {/* Roll / Index */}
                  <TableCell className="text-center font-mono text-xs text-muted-foreground font-semibold">
                    {index + 1}
                  </TableCell>

                  {/* Student Identity */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary text-xs shadow-2xs">
                        {initials}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-sm text-foreground truncate">
                          {student.name}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="font-mono text-[11px] truncate">
                            ID:{" "}
                            {student.studentProfile?.rollNumber ||
                              student.id.slice(0, 8)}
                          </span>
                          {student.studentProfile?.guardianPhone && (
                            <>
                              <span className="text-border">•</span>
                              <span className="flex items-center gap-1 text-[11px] truncate">
                                <Phone className="size-2.5" />
                                {student.studentProfile.guardianPhone}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Status: Read-Only Badge vs Editable Segmented Toggles */}
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
                      <div className="flex items-center justify-center gap-1 p-1 rounded-lg bg-muted/40 border border-border/60 max-w-fit mx-auto shadow-2xs">
                        {ALL_STATUSES.map((st) => {
                          const itemConfig = STATUS_CONFIG[st];
                          const ItemIcon = itemConfig.icon;
                          const isSelected = status === st;

                          return (
                            <button
                              key={st}
                              type="button"
                              onClick={() => onStatusChange(studentId, st)}
                              className={cn(
                                "px-2 py-1 rounded-md text-[11px] font-semibold inline-flex items-center gap-1 transition-all cursor-pointer",
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

                  {/* Remarks: Read-Only Text vs Editable Input */}
                  <TableCell>
                    {isReadOnly ? (
                      <span className="text-xs text-muted-foreground italic truncate block max-w-xs">
                        {remarks ? remarks : "—"}
                      </span>
                    ) : (
                      <Input
                        value={remarks || ""}
                        onChange={(e) =>
                          onRemarksChange(studentId, e.target.value)
                        }
                        placeholder="Optional remarks..."
                        className="h-8 text-xs bg-background/80"
                      />
                    )}
                  </TableCell>

                  {/* Actions (View History) */}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            aria-label="Student actions"
                            className="size-7 text-muted-foreground hover:text-foreground"
                          />
                        }
                      >
                        <MoreHorizontal className="size-3.5" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                          onClick={() => onViewHistory(student)}
                          className="gap-2 text-xs cursor-pointer"
                        >
                          <History className="size-3.5 text-primary" />
                          <span>View Attendance History</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card Checklist (< md) */}
      <div className="md:hidden space-y-2.5">
        {rows.map((row, index) => {
          const { studentId, student, status, remarks } = row;
          const config = status ? STATUS_CONFIG[status] : null;
          const StatusIcon = config?.icon || HelpCircle;
          const initials = student.name
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();

          return (
            <div
              key={studentId}
              className={cn(
                "rounded-xl border border-border/70 bg-card p-3.5 shadow-2xs space-y-3 transition-colors",
                config ? config.cardBorder : "border-border/70 bg-card",
              )}
            >
              <div className="flex items-start justify-between gap-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary text-xs">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-xs text-foreground truncate">
                      {index + 1}. {student.name}
                    </h4>
                    <p className="text-[11px] font-mono text-muted-foreground">
                      ID:{" "}
                      {student.studentProfile?.rollNumber ||
                        student.id.slice(0, 8)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {isReadOnly &&
                    (config ? (
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                          config.badgeClass,
                        )}
                      >
                        <StatusIcon className="size-3" />
                        <span>{config.label}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border border-border/80 bg-muted/60 text-muted-foreground">
                        <HelpCircle className="size-3" />
                        <span>Not Recorded</span>
                      </span>
                    ))}

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => onViewHistory(student)}
                    aria-label="View history"
                    className="size-7 text-muted-foreground hover:text-foreground shrink-0"
                  >
                    <History className="size-3.5" />
                  </Button>
                </div>
              </div>

              {/* Mobile Status Selector (Only if not read-only) */}
              {!isReadOnly && (
                <div className="grid grid-cols-5 gap-1 p-1 rounded-lg bg-muted/40 border border-border/60">
                  {ALL_STATUSES.map((st) => {
                    const itemConfig = STATUS_CONFIG[st];
                    const ItemIcon = itemConfig.icon;
                    const isSelected = status === st;

                    return (
                      <button
                        key={st}
                        type="button"
                        onClick={() => onStatusChange(studentId, st)}
                        className={cn(
                          "py-1.5 rounded-md text-[10px] font-semibold flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer",
                          isSelected
                            ? itemConfig.activeBg
                            : "text-muted-foreground hover:bg-background/80",
                        )}
                      >
                        <ItemIcon className="size-3" />
                        <span>{itemConfig.shortLabel}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Remarks Section */}
              {isReadOnly ? (
                remarks && (
                  <div className="rounded-md bg-muted/30 p-2 text-xs text-muted-foreground italic border border-border/40">
                    <span className="font-semibold text-[11px] not-italic text-foreground block mb-0.5">
                      Note:
                    </span>
                    {remarks}
                  </div>
                )
              ) : (
                <Input
                  value={remarks || ""}
                  onChange={(e) => onRemarksChange(studentId, e.target.value)}
                  placeholder="Optional remarks / reason..."
                  className="h-8 text-xs bg-background"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
