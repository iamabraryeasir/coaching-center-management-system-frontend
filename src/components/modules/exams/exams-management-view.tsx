"use client";

import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth, useBatches, useExams } from "@/hooks";
import type { Exam, ExamStatus } from "@/types";
import { CreateExamDialog } from "./create-exam-dialog";
import { EditExamDialog } from "./edit-exam-dialog";
import { ExamResultsModal } from "./exam-results-modal";
import { ExamsTable } from "./exams-table";
import { MarksEntryModal } from "./marks-entry-modal";

interface ExamsManagementViewProps {
  portalRole?: "ADMIN" | "TEACHER";
  initialBatchId?: string;
}

export function ExamsManagementView({
  portalRole = "ADMIN",
  initialBatchId = "",
}: ExamsManagementViewProps) {
  const { hasPermission } = useAuth();
  const canManageExams =
    portalRole === "ADMIN" || hasPermission("MANAGE_EXAMS");

  const [selectedBatchId, setSelectedBatchId] =
    useState<string>(initialBatchId);
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal States
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [examToEdit, setExamToEdit] = useState<Exam | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [examForMarks, setExamForMarks] = useState<Exam | null>(null);
  const [marksModalOpen, setMarksModalOpen] = useState(false);
  const [examForResults, setExamForResults] = useState<Exam | null>(null);
  const [resultsModalOpen, setResultsModalOpen] = useState(false);

  // Fetch batches for filter dropdown
  const { data: batchesData, isLoading: isLoadingBatches } = useBatches({
    limit: 100,
  });
  const batches = batchesData?.data || [];

  // Query parameters for exams list
  const queryParams = useMemo(() => {
    return {
      batchId: selectedBatchId || undefined,
      status:
        activeTab === "ALL" || activeTab === "DRAFT"
          ? undefined
          : (activeTab as ExamStatus),
      search: searchQuery.trim() || undefined,
      limit: 100,
    };
  }, [selectedBatchId, activeTab, searchQuery]);

  const { data: examsResponse, isLoading } = useExams(queryParams);

  const rawExams = examsResponse?.data;
  const allExams: Exam[] = Array.isArray(rawExams)
    ? rawExams
    : rawExams
      ? [rawExams as unknown as Exam]
      : [];

  // Filter for DRAFT results tab on client if activeTab === "DRAFT"
  const filteredExams = useMemo(() => {
    if (activeTab === "DRAFT") {
      return allExams.filter((e) => e.resultStatus !== "PUBLISHED");
    }
    return allExams;
  }, [allExams, activeTab]);

  const handleEditExam = (exam: Exam) => {
    setExamToEdit(exam);
    setEditDialogOpen(true);
  };

  const handleEnterMarks = (exam: Exam) => {
    setExamForMarks(exam);
    setMarksModalOpen(true);
  };

  const handleViewResults = (exam: Exam) => {
    setExamForResults(exam);
    setResultsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Overview Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {portalRole === "ADMIN"
              ? "Exams & Results Pipeline"
              : "Exams & Grading Workspace"}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Schedule examinations, enter student marks with real-time grading,
            and publish batch merit leaderboards.
          </p>
        </div>

        {canManageExams && (
          <Button
            type="button"
            size="sm"
            onClick={() => setCreateDialogOpen(true)}
            className="h-9 px-3.5 text-xs shadow-2xs self-start sm:self-auto"
          >
            <Plus className="size-3.5 mr-1.5" />
            Schedule Exam
          </Button>
        )}
      </div>

      {/* Tabs & Filtering Toolbar */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Status Tabs */}
          <TabsList className="h-9 bg-muted/60 p-1 flex-wrap">
            <TabsTrigger value="ALL" className="text-xs px-3">
              All Exams
            </TabsTrigger>
            <TabsTrigger value="UPCOMING" className="text-xs px-3">
              Upcoming
            </TabsTrigger>
            <TabsTrigger value="ONGOING" className="text-xs px-3">
              Ongoing
            </TabsTrigger>
            <TabsTrigger value="COMPLETED" className="text-xs px-3">
              Completed
            </TabsTrigger>
            <TabsTrigger value="DRAFT" className="text-xs px-3">
              Draft Results
            </TabsTrigger>
          </TabsList>

          {/* Search & Batch Filters */}
          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search exam title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 pl-8 text-xs bg-card"
              />
            </div>

            {/* Batch Filter Dropdown */}
            <Select
              value={selectedBatchId || "ALL_BATCHES"}
              onValueChange={(val) =>
                setSelectedBatchId(!val || val === "ALL_BATCHES" ? "" : val)
              }
              disabled={isLoadingBatches}
            >
              <SelectTrigger className="h-9 text-xs w-full sm:w-56 bg-card">
                <SelectValue placeholder="All Academic Batches">
                  {(val: string | null) => {
                    if (!val || val === "ALL_BATCHES") {
                      return "All Academic Batches";
                    }
                    const b = batches.find((item) => item.id === val);
                    return b ? b.name : val;
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL_BATCHES">
                  All Academic Batches
                </SelectItem>
                {batches.map((batch) => (
                  <SelectItem key={batch.id} value={batch.id}>
                    {batch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tab Contents: Render Exams Table */}
        <TabsContent
          value={activeTab}
          className="m-0 focus-visible:outline-none"
        >
          <ExamsTable
            exams={filteredExams}
            isLoading={isLoading}
            onOpenCreate={() => setCreateDialogOpen(true)}
            onEditExam={handleEditExam}
            onEnterMarks={handleEnterMarks}
            onViewResults={handleViewResults}
          />
        </TabsContent>
      </Tabs>

      {/* Dialog Modals */}
      <CreateExamDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        defaultBatchId={selectedBatchId}
      />

      <EditExamDialog
        exam={examToEdit}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />

      <MarksEntryModal
        exam={examForMarks}
        open={marksModalOpen}
        onOpenChange={setMarksModalOpen}
      />

      <ExamResultsModal
        exam={examForResults}
        open={resultsModalOpen}
        onOpenChange={setResultsModalOpen}
        onOpenMarksEntry={handleEnterMarks}
      />
    </div>
  );
}
