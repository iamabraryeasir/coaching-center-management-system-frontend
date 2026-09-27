"use client";

import { Clock, Layers, Plus } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

interface BatchesManagementViewProps {
  portalRole?: "ADMIN" | "TEACHER";
}

export function BatchesManagementView({
  portalRole = "ADMIN",
}: BatchesManagementViewProps = {}) {
  const isAdmin = portalRole === "ADMIN";
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [_isPending, startTransition] = useTransition();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [batchToEdit, setBatchToEdit] = useState<Batch | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  const deleteMutation = useDeleteBatchMutation();

  // Active Tab Sync (For teachers, activeTab is strictly "all")
  const activeTab = isAdmin ? searchParams.get("tab") || "all" : "all";

  // URL Params for Batches
  const page = Number(searchParams.get("page") || "1");
  const limit = Number(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || "";
  const status = (searchParams.get("status") as BatchStatus) || undefined;
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";

  // Fetch batches
  const { data: batchesResponse, isLoading: isBatchesLoading } = useBatches({
    page,
    limit,
    search: search || undefined,
    status,
    sortBy,
    sortOrder,
  });

  // Fetch pending count only for Admins
  const { data: pendingResponse } = usePendingEnrollments(
    { limit: 1 },
    { enabled: isAdmin },
  );
  const pendingCount = pendingResponse?.meta?.total || 0;

  const batches = batchesResponse?.data || [];
  const meta = batchesResponse?.meta;

  const handleTabChange = (val: string | null) => {
    if (!val) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", val);
    if (val === "pending") {
      params.delete("page");
      params.delete("status");
    }
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  const handleOpenEdit = (batch: Batch) => {
    if (!isAdmin) return;
    setBatchToEdit(batch);
    setIsCreateOpen(true);
  };

  const handleDeleteCard = (batch: Batch) => {
    if (!isAdmin) return;
    deleteMutation.mutate(batch.id);
  };

  const handleCloseDialog = (open: boolean) => {
    setIsCreateOpen(open);
    if (!open) {
      setBatchToEdit(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header View Options & Creation */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            {isAdmin ? "Academic Batches" : "My Batches & Classes"}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {isAdmin
              ? "Manage course offerings, schedules, fee structures, and enrollment registrations."
              : "View course offerings, routine schedules, fee structures, and enrolled student rosters."}
          </p>
        </div>

        {isAdmin && (
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
        )}
      </div>

      {/* View Switcher Select Component (Admin only) */}
      {isAdmin && (
        <div className="border-b border-border/80 pb-3 flex items-center justify-between gap-3">
          <div className="w-full sm:w-64">
            <Select value={activeTab} onValueChange={handleTabChange}>
              <SelectTrigger className="h-10 text-xs w-full bg-background font-medium">
                <SelectValue placeholder="Select View">
                  {(val: string | null) => {
                    if (val === "pending") {
                      return (
                        <div className="flex items-center justify-between w-full pr-2">
                          <div className="flex items-center gap-2">
                            <Clock className="size-3.5 text-muted-foreground" />
                            <span>Pending Enrollments</span>
                          </div>
                          {pendingCount > 0 && (
                            <Badge
                              variant="outline"
                              className="text-xs px-2 py-0.5 bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 font-semibold rounded-full"
                            >
                              {pendingCount}
                            </Badge>
                          )}
                        </div>
                      );
                    }
                    return (
                      <div className="flex items-center justify-between w-full pr-2">
                        <div className="flex items-center gap-2">
                          <Layers className="size-3.5 text-muted-foreground" />
                          <span>All Batches</span>
                        </div>
                        {meta && (
                          <Badge
                            variant="secondary"
                            className="text-xs px-2 py-0.5 font-semibold rounded-full"
                          >
                            {meta.total}
                          </Badge>
                        )}
                      </div>
                    );
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="w-64">
                <SelectItem value="all" className="text-xs py-2">
                  <div className="flex items-center justify-between w-full gap-4">
                    <div className="flex items-center gap-2">
                      <Layers className="size-3.5 text-muted-foreground" />
                      <span>All Batches</span>
                    </div>
                    {meta && (
                      <Badge
                        variant="secondary"
                        className="text-xs px-2 py-0.5 font-semibold rounded-full"
                      >
                        {meta.total}
                      </Badge>
                    )}
                  </div>
                </SelectItem>
                <SelectItem value="pending" className="text-xs py-2">
                  <div className="flex items-center justify-between w-full gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="size-3.5 text-muted-foreground" />
                      <span>Pending Enrollments</span>
                    </div>
                    {pendingCount > 0 && (
                      <Badge
                        variant="outline"
                        className="text-xs px-2 py-0.5 bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 font-semibold rounded-full"
                      >
                        {pendingCount}
                      </Badge>
                    )}
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Active View Content */}
      {activeTab === "all" ? (
        <div className="space-y-4">
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
              onCreateBatch={() => setIsCreateOpen(true)}
              portalRole={portalRole}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {batches.map((batch) => (
                <BatchCard
                  key={batch.id}
                  batch={batch}
                  onEdit={handleOpenEdit}
                  onDelete={handleDeleteCard}
                  portalRole={portalRole}
                />
              ))}
            </div>
          )}

          {meta && (
            <StudentPagination
              meta={meta}
              onPageChange={(p) => {
                const params = new URLSearchParams(searchParams.toString());
                params.set("page", p.toString());
                startTransition(() => {
                  router.replace(`${pathname}?${params.toString()}`);
                });
              }}
              onLimitChange={(l) => {
                const params = new URLSearchParams(searchParams.toString());
                params.set("limit", l.toString());
                params.set("page", "1");
                startTransition(() => {
                  router.replace(`${pathname}?${params.toString()}`);
                });
              }}
              itemLabel="batches"
            />
          )}
        </div>
      ) : (
        isAdmin && <PendingEnrollmentsQueue />
      )}

      {/* Admin Create / Edit Modal Dialog */}
      {isAdmin && (
        <CreateBatchDialog
          open={isCreateOpen}
          onOpenChange={handleCloseDialog}
          batchToEdit={batchToEdit}
        />
      )}
    </div>
  );
}
