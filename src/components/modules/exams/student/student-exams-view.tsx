"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Filter, RefreshCw, Search, SlidersHorizontal } from "lucide-react";
import { useId, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { examKeys } from "@/constants";
import { useSuspenseMyExamResults } from "@/hooks";
import type { StudentExamResultItem } from "@/types";
import { normalizeStudentExamResult } from "../shared/exam-utils";
import { StudentBatchMeritListModal } from "./student-batch-merit-list-modal";
import { StudentExamScorecardModal } from "./student-exam-scorecard-modal";
import { StudentExamsResultsList } from "./student-exams-results-list";
import { StudentExamsStatsRibbon } from "./student-exams-stats-ribbon";

const STATUS_FILTERS: { label: string; value: "ALL" | "PASSED" | "FAILED" }[] =
  [
    { label: "All Evaluations", value: "ALL" },
    { label: "Passed", value: "PASSED" },
    { label: "Failed", value: "FAILED" },
  ];

export function StudentExamsView() {
  const queryClient = useQueryClient();
  const searchInputId = useId();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<
    "ALL" | "PASSED" | "FAILED"
  >("ALL");
  const [selectedBatch, setSelectedBatch] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Modal States
  const [selectedScorecard, setSelectedScorecard] =
    useState<StudentExamResultItem | null>(null);
  const [selectedMeritExamId, setSelectedMeritExamId] = useState<string | null>(
    null,
  );

  // Suspense Query Fetch
  const { data: response } = useSuspenseMyExamResults();
  const reportCard = response?.data;

  const student = reportCard?.student;
  const studentId = student?.id || "";

  // Normalize results to handle both backend { exam, result } items and flat models
  const allResults = useMemo(() => {
    const rawList = reportCard?.results || [];
    return rawList.map(normalizeStudentExamResult);
  }, [reportCard?.results]);

  // Statistics calculation
  const totalExams = reportCard?.totalExams ?? allResults.length;
  const passedCount = useMemo(
    () =>
      reportCard?.passedExams ?? allResults.filter((r) => r.isPassed).length,
    [reportCard?.passedExams, allResults],
  );

  const overallPassRate = useMemo(() => {
    if (typeof reportCard?.overallPassRate === "number") {
      return reportCard.overallPassRate;
    }
    return totalExams > 0 ? (passedCount / totalExams) * 100 : 0;
  }, [reportCard?.overallPassRate, totalExams, passedCount]);

  const gpaAverage = useMemo(() => {
    if (typeof reportCard?.cumulativeStats?.gpaAverage === "number") {
      return reportCard.cumulativeStats.gpaAverage;
    }
    const validGpas = allResults
      .map((r) => r.gpa)
      .filter(
        (g): g is number => typeof g === "number" && !Number.isNaN(g) && g > 0,
      );
    if (validGpas.length === 0) return 0;
    const sum = validGpas.reduce((acc, curr) => acc + curr, 0);
    return Number((sum / validGpas.length).toFixed(2));
  }, [reportCard?.cumulativeStats?.gpaAverage, allResults]);

  // Calculate best rank
  const bestRank = useMemo(() => {
    const ranks = allResults
      .map((r) => r.rank)
      .filter((r): r is number => typeof r === "number" && r > 0);
    return ranks.length > 0 ? Math.min(...ranks) : null;
  }, [allResults]);

  // Extract unique batch names for filtering
  const availableBatches = useMemo(() => {
    const batchSet = new Set<string>();
    for (const r of allResults) {
      if (r.batchName) batchSet.add(r.batchName);
    }
    return Array.from(batchSet);
  }, [allResults]);

  // Client-side filtering
  const filteredResults = useMemo(() => {
    return allResults.filter((item) => {
      // Status filter
      if (selectedStatus === "PASSED" && !item.isPassed) return false;
      if (selectedStatus === "FAILED" && item.isPassed) return false;

      // Batch filter
      if (selectedBatch !== "ALL" && item.batchName !== selectedBatch) {
        return false;
      }

      // Search query filter (exam title or batch)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const title = (item.examTitle || "").toLowerCase();
        const batch = (item.batchName || "").toLowerCase();
        return title.includes(query) || batch.includes(query);
      }

      return true;
    });
  }, [allResults, selectedStatus, selectedBatch, searchQuery]);

  // Pagination slice
  const totalRecords = filteredResults.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedResults = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredResults.slice(start, start + pageSize);
  }, [filteredResults, safePage]);

  // Quick refresh action
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: examKeys.all });
    setIsRefreshing(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            My Exams & Report Cards
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            View your published test scores, academic GPA ratings, batch
            rankings, and official downloadable report cards.
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

      {/* 4 KPI Stats Ribbon */}
      <StudentExamsStatsRibbon
        totalExams={totalExams}
        gpaAverage={gpaAverage}
        overallPassRate={overallPassRate}
        passedCount={passedCount}
        bestRank={bestRank}
      />

      {/* Filter & Results List Section */}
      <div className="rounded-xl border border-border/70 bg-card p-4 sm:p-5 shadow-2xs space-y-4 sm:space-y-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="size-4 text-muted-foreground" />
            <h3 className="font-heading text-base font-semibold text-foreground">
              Evaluated Assessments
            </h3>
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {totalRecords}
            </span>
          </div>

          {/* Search Input & Batch Dropdown */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {/* Search Input */}
            <div className="relative min-w-50 sm:min-w-55">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <Input
                id={searchInputId}
                type="text"
                placeholder="Search exam title, batch..."
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

        {/* Chronological Results List */}
        <StudentExamsResultsList
          results={paginatedResults}
          studentId={studentId}
          currentPage={safePage}
          totalPages={totalPages}
          totalRecords={totalRecords}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onSelectScorecard={setSelectedScorecard}
          onSelectMeritList={setSelectedMeritExamId}
        />
      </div>

      {/* Scorecard Modal */}
      <StudentExamScorecardModal
        result={selectedScorecard}
        studentId={studentId}
        open={Boolean(selectedScorecard)}
        onOpenChange={(open) => {
          if (!open) setSelectedScorecard(null);
        }}
        onViewMeritList={(examId) => setSelectedMeritExamId(examId)}
      />

      {/* Batch Merit List Modal */}
      <StudentBatchMeritListModal
        examId={selectedMeritExamId}
        currentStudentId={studentId}
        open={Boolean(selectedMeritExamId)}
        onOpenChange={(open) => {
          if (!open) setSelectedMeritExamId(null);
        }}
      />
    </div>
  );
}
