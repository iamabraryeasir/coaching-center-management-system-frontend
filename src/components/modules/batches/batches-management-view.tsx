"use client";

import { Clock, FolderPlus, Layers, Plus } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useBatches,
  useDeleteBatchMutation,
  usePendingEnrollments,
} from "@/hooks";
import type { Batch, BatchStatus } from "@/types";
import { StudentPagination } from "../students/student-pagination";
import { BatchCard } from "./batch-card";
import { BatchTable } from "./batch-table";
import { BatchToolbar } from "./batch-toolbar";
import { CreateBatchDialog } from "./create-batch-dialog";
import { PendingEnrollmentsQueue } from "./pending-enrollments-queue";

export function BatchesManagementView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [_isPending, startTransition] = useTransition();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [batchToEdit, setBatchToEdit] = useState<Batch | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  const deleteMutation = useDeleteBatchMutation();

  // Active Tab Sync
  const activeTab = searchParams.get("tab") || "all";

  // URL Params for Batches
  const page = Number(searchParams.get("page") || "1");
  const limit = Number(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || "";
  const status =
    (searchParams.get("status") as BatchStatus | "ALL" | null) || "ALL";
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder =
    (searchParams.get("sortOrder") as "asc" | "desc" | null) || "desc";

  // Fetch batches query
  const { data: batchesResponse, isLoading: isBatchesLoading } = useBatches({
    page,
    limit,
    search: search.trim() ? search.trim() : undefined,
    status: status !== "ALL" ? status : undefined,
    sortBy,
    sortOrder,
  });

  // Fetch pending enrollments count for the tab badge
  const { data: pendingResponse } = usePendingEnrollments();

  const batches = batchesResponse?.data || [];
  const meta = batchesResponse?.meta;
  const pendingCount = (pendingResponse?.data as unknown[])?.length || 0;

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("tab");
    } else {
      params.set("tab", value);
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleOpenEdit = (batch: Batch) => {
    setBatchToEdit(batch);
    setIsCreateOpen(true);
  };

  const handleCloseDialog = (open: boolean) => {
    setIsCreateOpen(open);
    if (!open) setBatchToEdit(null);
  };

  const handleDeleteCard = (batch: Batch) => {
    if (
      window.confirm(
        `Are you sure you want to cancel the batch "${batch.name}"?`,
      )
    ) {
      deleteMutation.mutate(batch.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Academic Batches
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Configure academic courses, enrollment fees, and supervise student
            placements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              setBatchToEdit(null);
              setIsCreateOpen(true);
            }}
            size="sm"
            className="gap-1.5 shadow-sm font-medium"
          >
            <Plus className="size-4" />
            <span>Create Batch</span>
          </Button>
        </div>
      </div>

      {/* Primary Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full space-y-4"
      >
        <div className="border-b border-border/80 pb-3">
          <TabsList className="group-data-horizontal/tabs:h-11 p-1 bg-muted/60 rounded-xl border border-border/50 gap-1.5 shadow-2xs inline-flex items-center">
            <TabsTrigger
              value="all"
              className="px-4 text-sm font-medium gap-2.5 rounded-lg h-9 data-active:bg-background data-active:text-foreground data-active:shadow-xs transition-all"
            >
              <Layers className="size-4 text-muted-foreground" />
              <span>All Batches</span>
              {meta && (
                <Badge
                  variant="secondary"
                  className="ml-2 text-xs px-2 py-0.5 font-semibold rounded-full"
                >
                  {meta.total}
                </Badge>
              )}
            </TabsTrigger>

            <TabsTrigger
              value="pending"
              className="px-4 text-sm font-medium gap-2.5 rounded-lg h-9 data-active:bg-background data-active:text-foreground data-active:shadow-xs transition-all"
            >
              <Clock className="size-4 text-muted-foreground" />
              <span>Pending Enrollments</span>
              {pendingCount > 0 && (
                <Badge
                  variant="outline"
                  className="ml-2 text-xs px-2 py-0.5 bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 font-semibold rounded-full"
                >
                  {pendingCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: All Batches */}
        <TabsContent value="all" className="space-y-4 outline-none">
          <BatchToolbar
            currentStatus={status}
            currentSort={`${sortBy}:${sortOrder}`}
            currentSearch={search}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {viewMode === "table" ? (
            <BatchTable
              batches={batches}
              isLoading={isBatchesLoading}
              onEditBatch={handleOpenEdit}
              onCreateBatch={() => {
                setBatchToEdit(null);
                setIsCreateOpen(true);
              }}
            />
          ) : (
            <div>
              {isBatchesLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {["sk-b1", "sk-b2", "sk-b3", "sk-b4", "sk-b5", "sk-b6"].map(
                    (skeletonId) => (
                      <div
                        key={skeletonId}
                        className="h-44 rounded-xl border border-border/80 bg-card p-4 space-y-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="size-9 rounded-lg bg-muted animate-pulse" />
                          <div className="space-y-1.5 flex-1">
                            <div className="h-4 w-36 bg-muted rounded animate-pulse" />
                            <div className="h-3 w-20 bg-muted rounded animate-pulse" />
                          </div>
                        </div>
                        <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                        <div className="h-8 w-full bg-muted rounded animate-pulse mt-4" />
                      </div>
                    ),
                  )}
                </div>
              )}

              {!isBatchesLoading && batches.length === 0 && (
                <div className="p-12 text-center rounded-xl border border-border/80 bg-card">
                  <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground mx-auto mb-2">
                    <Layers className="size-6" />
                  </div>
                  <h3 className="font-semibold text-sm text-foreground">
                    No academic batches found
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
                    No batches match your criteria. Create a batch to start
                    enrollments.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setBatchToEdit(null);
                      setIsCreateOpen(true);
                    }}
                    className="mt-3 gap-1.5 text-xs"
                  >
                    <FolderPlus className="size-3.5" />
                    <span>Create Batch</span>
                  </Button>
                </div>
              )}

              {!isBatchesLoading && batches.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {batches.map((batch) => (
                    <BatchCard
                      key={batch.id}
                      batch={batch}
                      onEdit={handleOpenEdit}
                      onDelete={handleDeleteCard}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          <StudentPagination meta={meta} />
        </TabsContent>

        {/* Tab 2: Pending Applications Queue */}
        <TabsContent value="pending" className="space-y-4 outline-none">
          <PendingEnrollmentsQueue />
        </TabsContent>
      </Tabs>

      {/* Batch Create / Edit Modal */}
      <CreateBatchDialog
        open={isCreateOpen}
        onOpenChange={handleCloseDialog}
        batchToEdit={batchToEdit}
      />
    </div>
  );
}
