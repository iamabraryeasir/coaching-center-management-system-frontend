"use client";

import {
  AlertTriangle,
  ArrowUpRight,
  Edit2,
  FolderPlus,
  Layers,
  MoreHorizontal,
  Trash2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDeleteBatchMutation } from "@/hooks";
import type { Batch } from "@/types";
import { BatchStatusBadge } from "../shared/batch-status-badge";

interface BatchTableProps {
  batches: Batch[];
  isLoading: boolean;
  onEditBatch?: (batch: Batch) => void;
  onCreateBatch?: () => void;
  portalRole?: "ADMIN" | "TEACHER";
}

export function BatchTable({
  batches,
  isLoading,
  onEditBatch,
  onCreateBatch,
  portalRole = "ADMIN",
}: BatchTableProps) {
  const isAdmin = portalRole === "ADMIN";
  const [batchToDelete, setBatchToDelete] = useState<Batch | null>(null);
  const deleteMutation = useDeleteBatchMutation();

  const confirmDelete = () => {
    if (!batchToDelete) return;
    deleteMutation.mutate(batchToDelete.id, {
      onSettled: () => setBatchToDelete(null),
    });
  };

  return (
    <>
      <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="min-w-60">Batch Details</TableHead>
                <TableHead className="w-32">Status</TableHead>
                <TableHead className="w-36">Course Fee</TableHead>
                <TableHead className="w-36">Created Date</TableHead>
                <TableHead className="w-20 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {/* Skeleton loading state */}
              {isLoading &&
                Array.from({ length: 5 }).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: Static placeholder row
                  <TableRow key={i}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Skeleton className="size-9 rounded-lg" />
                        <div className="space-y-1.5">
                          <Skeleton className="h-4 w-40" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="size-8 rounded-md ml-auto" />
                    </TableCell>
                  </TableRow>
                ))}

              {/* Empty state */}
              {!isLoading && batches.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto">
                      <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        <Layers className="size-6" />
                      </div>
                      <h3 className="font-heading text-sm font-semibold text-foreground">
                        No batches found
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {isAdmin
                          ? "Try adjusting your search criteria or create a new batch."
                          : "No batches matched your search or filter options."}
                      </p>
                      {isAdmin && onCreateBatch && (
                        <Button
                          onClick={onCreateBatch}
                          variant="outline"
                          size="sm"
                          className="mt-2 text-xs gap-1.5"
                        >
                          <FolderPlus className="size-3.5" />
                          <span>Create New Batch</span>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {/* Batches rows */}
              {!isLoading &&
                batches.map((batch) => {
                  const formattedDate = batch.createdAt
                    ? new Date(batch.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "—";

                  const detailPath = `/dashboard/${portalRole.toLowerCase()}/batches/${batch.id}`;

                  return (
                    <TableRow
                      key={batch.id}
                      className="group transition-colors hover:bg-muted/40"
                    >
                      {/* Batch Identity Column */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Layers className="size-4.5" />
                          </div>
                          <div className="min-w-0">
                            <Link
                              href={detailPath}
                              className="font-medium text-sm text-foreground hover:underline flex items-center gap-1 group/title"
                            >
                              <span className="truncate">{batch.name}</span>
                              <ArrowUpRight className="size-3 opacity-0 -translate-y-0.5 translate-x-0.5 transition-all group-hover/title:opacity-100" />
                            </Link>
                            <span className="text-[11px] text-muted-foreground font-mono">
                              ID: {batch.id.slice(0, 8)}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Status Column */}
                      <TableCell>
                        <BatchStatusBadge status={batch.status} />
                      </TableCell>

                      {/* Course Fee Column */}
                      <TableCell>
                        <span className="text-sm font-semibold text-foreground">
                          ৳ {batch.fee.toLocaleString()}
                        </span>
                      </TableCell>

                      {/* Created Date Column */}
                      <TableCell className="text-xs text-muted-foreground">
                        {formattedDate}
                      </TableCell>

                      {/* Action Menu Column */}
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                aria-label="Batch actions"
                                className="size-8 p-0 text-muted-foreground hover:text-foreground"
                              />
                            }
                          >
                            <MoreHorizontal className="size-4" />
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                              render={
                                <Link
                                  href={detailPath}
                                  className="flex items-center gap-2 text-xs w-full"
                                />
                              }
                            >
                              <Users className="size-3.5 text-muted-foreground" />
                              <span>View Roster & Details</span>
                            </DropdownMenuItem>

                            {isAdmin && onEditBatch && (
                              <DropdownMenuItem
                                onClick={() => onEditBatch(batch)}
                                className="gap-2 text-xs"
                              >
                                <Edit2 className="size-3.5 text-muted-foreground" />
                                <span>Edit Parameters</span>
                              </DropdownMenuItem>
                            )}

                            {isAdmin && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => setBatchToDelete(batch)}
                                  className="gap-2 text-xs text-destructive focus:bg-destructive/10 focus:text-destructive"
                                >
                                  <Trash2 className="size-3.5" />
                                  <span>Cancel / Archive</span>
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Delete / Archive Confirmation Dialog (Admin only) */}
      {isAdmin && (
        <Dialog
          open={Boolean(batchToDelete)}
          onOpenChange={(open) => !open && setBatchToDelete(null)}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                  <AlertTriangle className="size-5" />
                </div>
                <div>
                  <DialogTitle className="font-heading text-lg font-bold">
                    Cancel & Archive Batch
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground">
                    This action will soft-delete the batch from active
                    enrollment.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="text-xs text-muted-foreground space-y-2 py-2">
              <p>
                Are you sure you want to cancel{" "}
                <strong className="text-foreground font-semibold">
                  {batchToDelete?.name}
                </strong>
                ?
              </p>
              <p className="rounded-lg bg-destructive/5 p-3 text-destructive border border-destructive/20 leading-relaxed">
                Existing enrolled students will remain linked in historical
                records, but new admissions into this batch will be blocked.
              </p>
            </div>

            <DialogFooter className="gap-2">
              <DialogClose
                render={
                  <Button variant="outline" size="sm" className="text-xs">
                    Keep Active
                  </Button>
                }
              />
              <Button
                variant="destructive"
                size="sm"
                onClick={confirmDelete}
                disabled={deleteMutation.isPending}
                className="text-xs gap-1.5"
              >
                <Trash2 className="size-3.5" />
                <span>
                  {deleteMutation.isPending
                    ? "Archiving..."
                    : "Confirm Cancellation"}
                </span>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
