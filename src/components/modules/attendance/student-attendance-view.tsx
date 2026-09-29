"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Filter, RefreshCw, Search, SlidersHorizontal } from "lucide-react";
import { useId, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { attendanceKeys } from "@/constants";
import { useSuspenseMyStudentAttendanceSummary } from "@/hooks";
import type { AttendanceStatus, StudentAttendanceHistoryItem } from "@/types";
import { StudentAttendanceHealthCard } from "./student-attendance-health-card";
import { StudentAttendanceHistoryTable } from "./student-attendance-history-table";
import { StudentAttendanceStatsCards } from "./student-attendance-stats-cards";

const STATUS_FILTERS: { label: string; value: "ALL" | AttendanceStatus }[] = [
  { label: "All Sessions", value: "ALL" },
  { label: "Present", value: "PRESENT" },
  { label: "Late", value: "LATE" },
  { label: "Absent", value: "ABSENT" },
  { label: "Excused", value: "EXCUSED" },
  { label: "Leave", value: "LEAVE" },
];

export function StudentAttendanceView() {
  const queryClient = useQueryClient();
  const searchInputId = useId();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<
    "ALL" | AttendanceStatus
  >("ALL");
  const [selectedBatch, setSelectedBatch] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Suspense Query Fetch
  const { data: summaryResponse } = useSuspenseMyStudentAttendanceSummary();
  const summary = summaryResponse.data;

  // Normalize stats
  const stats = summary?.stats || {
    totalSessions: 0,
    presentCount: 0,
    lateCount: 0,
    absentCount: 0,
    excusedCount: 0,
    leaveCount: 0,
    attendanceRate: 0,
  };

  const totalSessions =
    stats.totalSessions ??
    stats.totalClasses ??
    stats.presentCount +
      stats.lateCount +
      stats.absentCount +
      (stats.excusedCount || 0) +
      (stats.leaveCount || 0);

  // Normalize history records
  const allRecords: StudentAttendanceHistoryItem[] = useMemo(() => {
    return summary?.records || summary?.history || summary?.recentRecords || [];
  }, [summary]);

  // Extract unique batches from records for filtering
  const availableBatches = useMemo(() => {
    const batchSet = new Set<string>();
    for (const record of allRecords) {
      const name = record.batchName || record.batch?.name;
      if (name) batchSet.add(name);
    }
    return Array.from(batchSet);
  }, [allRecords]);

  // Client-side filtering
  const filteredRecords = useMemo(() => {
    return allRecords.filter((record) => {
      // Status filter
      if (selectedStatus !== "ALL" && record.status !== selectedStatus) {
        return false;
      }

      // Batch filter
      const batchName = record.batchName || record.batch?.name || "";
      if (selectedBatch !== "ALL" && batchName !== selectedBatch) {
        return false;
      }

      // Search query filter (search across date, batch, teacher, remarks)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const remarks = (record.remarks || "").toLowerCase();
        const teacher = (record.markedBy?.name || "").toLowerCase();
        const date = (record.date || "").toLowerCase();
        const batch = batchName.toLowerCase();

        return (
          remarks.includes(query) ||
          teacher.includes(query) ||
          date.includes(query) ||
          batch.includes(query)
        );
      }

      return true;
    });
  }, [allRecords, selectedStatus, selectedBatch, searchQuery]);

  // Pagination slice
  const totalRecords = filteredRecords.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedRecords = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, safePage]);

  // Quick refresh action
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: attendanceKeys.all });
    setIsRefreshing(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            My Attendance & Compliance
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Track your lecture presence, compliance rate against the 75%
            benchmark, and detailed session history.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="gap-2 self-start sm:self-auto"
        >
          <RefreshCw
            className={`size-3.5 ${isRefreshing ? "animate-spin" : ""}`}
          />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Compliance Health Card */}
      <StudentAttendanceHealthCard
        attendanceRate={stats.attendanceRate}
        totalSessions={totalSessions}
        presentCount={stats.presentCount}
      />

      {/* 5 KPI Metric Cards Ribbon */}
      <StudentAttendanceStatsCards
        totalSessions={totalSessions}
        presentCount={stats.presentCount}
        lateCount={stats.lateCount}
        absentCount={stats.absentCount}
        excusedCount={stats.excusedCount}
        leaveCount={stats.leaveCount}
      />

      {/* Filter & History Section */}
      <div className="rounded-xl border border-border/70 bg-card p-4 sm:p-5 shadow-2xs space-y-4 sm:space-y-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="size-4 text-muted-foreground" />
            <h3 className="font-heading text-base font-semibold text-foreground">
              Session Check-in Records
            </h3>
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {totalRecords}
            </span>
          </div>

          {/* Search Input & Batch Dropdown */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {/* Search Input */}
            <div className="relative min-w-[200px] sm:min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <Input
                id={searchInputId}
                type="text"
                placeholder="Search teacher, batch, date..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 h-9 text-sm"
              />
            </div>

            {/* Batch Selector */}
            {availableBatches.length > 1 && (
              <div className="relative">
                <select
                  value={selectedBatch}
                  onChange={(e) => {
                    setSelectedBatch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full sm:w-auto h-9 rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
                >
                  <option value="ALL">All Batches</option>
                  {availableBatches.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 pt-1 border-t border-border/50 overflow-x-auto no-scrollbar sm:flex-wrap pb-1 sm:pb-0">
          <span className="text-xs text-muted-foreground mr-1 flex items-center gap-1 shrink-0">
            <Filter className="size-3" /> Status:
          </span>
          {STATUS_FILTERS.map((filter) => {
            const isActive = selectedStatus === filter.value;
            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => {
                  setSelectedStatus(filter.value);
                  setCurrentPage(1);
                }}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-2xs"
                    : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        {/* Attendance History Table */}
        <StudentAttendanceHistoryTable
          records={paginatedRecords}
          currentPage={safePage}
          totalPages={totalPages}
          totalRecords={totalRecords}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
