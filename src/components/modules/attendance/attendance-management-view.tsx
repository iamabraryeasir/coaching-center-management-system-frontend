"use client";

import { Calendar, CalendarX2, GraduationCap, Users } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useBatchAttendanceSheet,
  useBatches,
  useBatchStudents,
  useMarkBatchAttendanceMutation,
} from "@/hooks";
import type { AttendanceStatus, Batch, BatchEnrollment, User } from "@/types";
import { AttendanceSheetToolbar } from "./attendance-sheet-toolbar";
import { AttendanceStatsRibbon } from "./attendance-stats-ribbon";
import { StudentAttendanceHistoryModal } from "./student-attendance-history-modal";
import {
  type StudentAttendanceRowState,
  StudentAttendanceTable,
} from "./student-attendance-table";
import { TeacherAttendanceSheet } from "./teacher-attendance-sheet";

export type AttendanceViewMode = "student" | "teacher";

interface AttendanceManagementViewProps {
  defaultView?: AttendanceViewMode;
  allowTeacherView?: boolean;
}

export function AttendanceManagementView({
  defaultView = "student",
  allowTeacherView = true,
}: AttendanceManagementViewProps) {
  const searchParams = useSearchParams();
  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  const [viewMode, setViewMode] = useState<AttendanceViewMode>(
    (searchParams.get("view") as AttendanceViewMode) || defaultView,
  );
  const [selectedBatchId, setSelectedBatchId] = useState<string>(
    searchParams.get("batchId") || "",
  );
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const paramDate = searchParams.get("date");
    if (paramDate && paramDate <= todayStr) return paramDate;
    return todayStr;
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [studentRows, setStudentRows] = useState<StudentAttendanceRowState[]>(
    [],
  );
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Student history modal
  const [selectedStudentForHistory, setSelectedStudentForHistory] =
    useState<User | null>(null);

  // Compute date states
  const isToday = selectedDate === todayStr;
  const isReadOnly = !isToday;

  // Fetch batches
  const { data: batchesResponse, isLoading: isBatchesLoading } = useBatches({
    limit: 100,
  });
  const batches: Batch[] = batchesResponse?.data || [];

  // Auto-select first batch if none selected
  const activeBatchId = selectedBatchId || batches[0]?.id || "";

  // Fetch batch student roster
  const { data: batchStudentsResponse, isLoading: isBatchStudentsLoading } =
    useBatchStudents(activeBatchId, { limit: 100 });
  const enrolledStudents: BatchEnrollment[] = batchStudentsResponse?.data || [];

  // Fetch existing attendance records for the selected batch & date
  const { data: sheetResponse, isLoading: isSheetLoading } =
    useBatchAttendanceSheet(
      activeBatchId,
      selectedDate,
      Boolean(activeBatchId),
    );
  const existingSheet = sheetResponse?.data;
  const existingRecords = existingSheet?.records || [];

  const markBatchMutation = useMarkBatchAttendanceMutation();

  const hasExistingRecords = existingRecords.length > 0;

  // Populate local rows whenever enrolled students or existing records change
  useEffect(() => {
    if (enrolledStudents.length === 0) {
      setStudentRows([]);
      setHasUnsavedChanges(false);
      return;
    }

    const rows: StudentAttendanceRowState[] = enrolledStudents
      .filter((enrollment) => Boolean(enrollment.student || enrollment.user))
      .map((enrollment) => {
        const studentUser = (enrollment.student ||
          enrollment.user) as unknown as User;
        const match = existingRecords.find(
          (r) =>
            r.studentId === studentUser.id || r.student?.id === studentUser.id,
        );

        return {
          studentId: studentUser.id,
          student: studentUser,
          status: match
            ? (match.status as AttendanceStatus)
            : isReadOnly
              ? null
              : "PRESENT",
          remarks: match?.remarks || "",
          isModified: false,
        };
      });

    setStudentRows(rows);
    setHasUnsavedChanges(false);
  }, [enrolledStudents, existingRecords, isReadOnly]);

  // Handle single student status change (Only allowed if today)
  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    if (isReadOnly) return;
    setStudentRows((prev) =>
      prev.map((row) =>
        row.studentId === studentId
          ? { ...row, status, isModified: true }
          : row,
      ),
    );
    setHasUnsavedChanges(true);
  };

  // Handle single student remarks change
  const handleRemarksChange = (studentId: string, remarks: string) => {
    if (isReadOnly) return;
    setStudentRows((prev) =>
      prev.map((row) =>
        row.studentId === studentId
          ? { ...row, remarks, isModified: true }
          : row,
      ),
    );
    setHasUnsavedChanges(true);
  };

  // Mark all present
  const handleMarkAllPresent = () => {
    if (isReadOnly) return;
    setStudentRows((prev) =>
      prev.map((row) => ({ ...row, status: "PRESENT", isModified: true })),
    );
    setHasUnsavedChanges(true);
  };

  // Mark all absent
  const handleMarkAllAbsent = () => {
    if (isReadOnly) return;
    setStudentRows((prev) =>
      prev.map((row) => ({ ...row, status: "ABSENT", isModified: true })),
    );
    setHasUnsavedChanges(true);
  };

  // Reset to original fetched values
  const handleReset = () => {
    if (enrolledStudents.length === 0) return;

    const rows: StudentAttendanceRowState[] = enrolledStudents
      .filter((enrollment) => Boolean(enrollment.student || enrollment.user))
      .map((enrollment) => {
        const studentUser = (enrollment.student ||
          enrollment.user) as unknown as User;
        const match = existingRecords.find(
          (r) =>
            r.studentId === studentUser.id || r.student?.id === studentUser.id,
        );

        return {
          studentId: studentUser.id,
          student: studentUser,
          status: match
            ? (match.status as AttendanceStatus)
            : isReadOnly
              ? null
              : "PRESENT",
          remarks: match?.remarks || "",
          isModified: false,
        };
      });

    setStudentRows(rows);
    setHasUnsavedChanges(false);
  };

  // Save Bulk Attendance (Today only)
  const handleSave = async () => {
    if (isReadOnly || !activeBatchId || studentRows.length === 0) return;

    await markBatchMutation.mutateAsync({
      batchId: activeBatchId,
      payload: {
        date: selectedDate,
        records: studentRows.map((r) => ({
          studentId: r.studentId,
          status: r.status || "PRESENT",
          remarks: r.remarks.trim() || undefined,
        })),
      },
    });

    setHasUnsavedChanges(false);
  };

  // Filtered rows for search query
  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) return studentRows;
    const q = searchQuery.toLowerCase();
    return studentRows.filter(
      (r) =>
        r.student.name.toLowerCase().includes(q) ||
        r.student.email.toLowerCase().includes(q) ||
        r.student.studentProfile?.rollNumber?.toLowerCase().includes(q) ||
        r.student.studentProfile?.guardianPhone?.includes(q),
    );
  }, [studentRows, searchQuery]);

  // Real-time KPI counts across 5 statuses
  const stats = useMemo(() => {
    if (isReadOnly && !hasExistingRecords) {
      return {
        total: enrolledStudents.length,
        present: 0,
        absent: 0,
        late: 0,
        excused: 0,
        leave: 0,
        rate: 0,
      };
    }
    const recordedRows = studentRows.filter((r) => r.status !== null);
    const total = recordedRows.length || studentRows.length;
    const present = studentRows.filter((r) => r.status === "PRESENT").length;
    const absent = studentRows.filter((r) => r.status === "ABSENT").length;
    const late = studentRows.filter((r) => r.status === "LATE").length;
    const excused = studentRows.filter((r) => r.status === "EXCUSED").length;
    const leave = studentRows.filter((r) => r.status === "LEAVE").length;
    const rate = total > 0 ? (present / total) * 100 : 0;
    return { total, present, absent, late, excused, leave, rate };
  }, [studentRows, isReadOnly, hasExistingRecords, enrolledStudents.length]);

  const activeBatchObj = batches.find((b) => b.id === activeBatchId);
  const isLoading =
    isBatchesLoading || isBatchStudentsLoading || isSheetLoading;

  return (
    <div className="space-y-6">
      {/* Top Banner & View Switcher Tabs */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Daily Attendance Tracking
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Mark classroom presence by batch, record student attendance notes,
            and track staff check-ins.
          </p>
        </div>

        {/* View Switcher Tabs */}
        {allowTeacherView && (
          <Tabs
            value={viewMode}
            onValueChange={(val) =>
              val && setViewMode(val as AttendanceViewMode)
            }
            className="w-full sm:w-auto shrink-0"
          >
            <TabsList className="grid grid-cols-2 w-full sm:w-auto">
              <TabsTrigger
                value="student"
                className="gap-2 text-xs font-semibold px-3"
              >
                <Users className="size-3.5 text-primary" />
                <span>Student Attendance</span>
              </TabsTrigger>
              <TabsTrigger
                value="teacher"
                className="gap-2 text-xs font-semibold px-3"
              >
                <GraduationCap className="size-3.5 text-primary" />
                <span>Teacher Attendance</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}
      </div>

      {/* Main Content View based on Selected Tab */}
      {viewMode === "student" ? (
        <div className="space-y-4">
          {/* 1. Summary Ribbon */}
          <AttendanceStatsRibbon
            totalEnrolled={stats.total}
            presentCount={stats.present}
            absentCount={stats.absent}
            lateCount={stats.late}
            excusedCount={stats.excused}
            leaveCount={stats.leave}
            showExcused={true}
            showLeave={true}
            attendanceRate={stats.rate}
            isLoading={isLoading}
            label="Students"
          />

          {/* 2. Interactive / Read-Only Toolbar */}
          <AttendanceSheetToolbar
            batches={batches}
            selectedBatchId={activeBatchId}
            onSelectBatchId={(id) => setSelectedBatchId(id)}
            selectedDate={selectedDate}
            onSelectDate={(d) => setSelectedDate(d)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onMarkAllPresent={handleMarkAllPresent}
            onMarkAllAbsent={handleMarkAllAbsent}
            onReset={handleReset}
            onSave={handleSave}
            isSaving={markBatchMutation.isPending}
            hasUnsavedChanges={hasUnsavedChanges}
            disabled={isLoading || batches.length === 0}
            isReadOnly={isReadOnly}
          />

          {/* 3. Student Attendance Table or Not Found Empty State */}
          {isReadOnly && !hasExistingRecords && !isLoading ? (
            <div className="rounded-xl border border-border/70 bg-card/60 p-12 text-center shadow-2xs flex flex-col items-center justify-center space-y-3 w-full">
              <div className="flex size-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-1">
                <CalendarX2 className="size-6" />
              </div>
              <h3 className="font-heading font-semibold text-base text-foreground">
                No Attendance Record Found
              </h3>
              <p className="text-xs text-muted-foreground max-w-md leading-relaxed">
                No attendance was recorded for{" "}
                <strong className="text-foreground">
                  {activeBatchObj?.name || "this batch"}
                </strong>{" "}
                on{" "}
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
                onClick={() => setSelectedDate(todayStr)}
                className="gap-2 text-xs font-semibold mt-1"
              >
                <Calendar className="size-3.5" />
                <span>Jump to Today</span>
              </Button>
            </div>
          ) : (
            <StudentAttendanceTable
              rows={filteredRows}
              onStatusChange={handleStatusChange}
              onRemarksChange={handleRemarksChange}
              onViewHistory={(student) => setSelectedStudentForHistory(student)}
              isLoading={isLoading}
              batchName={activeBatchObj?.name}
              isReadOnly={isReadOnly}
            />
          )}

          {/* 4. Student Attendance History Modal */}
          <StudentAttendanceHistoryModal
            student={selectedStudentForHistory}
            open={Boolean(selectedStudentForHistory)}
            onOpenChange={(open) => {
              if (!open) setSelectedStudentForHistory(null);
            }}
          />
        </div>
      ) : (
        <TeacherAttendanceSheet />
      )}
    </div>
  );
}
