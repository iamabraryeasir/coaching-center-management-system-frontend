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
import { BatchStatusBadge } from "./batch-status-badge";

interface BatchTableProps {
  batches: Batch[];
  isLoading: boolean;
  onEditBatch: (batch: Batch) => void;
  onCreateBatch?: () => void;
}

export function BatchTable({
  batches,
  isLoading,
  onEditBatch,
  onCreateBatch,
}: BatchTableProps) {
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
                      <p className="font-semibold text-sm text-foreground">
                        No academic batches found
                      </p>
                      <p className="text-xs text-muted-foreground">
                        No batches matched your current filter criteria, or none
                        have been created yet.
                      </p>
                      {onCreateBatch && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={onCreateBatch}
                          className="mt-2 gap-1.5 text-xs"
                        >
                          <FolderPlus className="size-3.5" />
                          <span>Create First Batch</span>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {/* Data rows */}
              {!isLoading &&
                batches.map((batch) => {
                  const formattedDate = batch.createdAt
                    ? new Date(batch.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "—";

                  return (
                    <TableRow
                      key={batch.id}
                      className="group transition-colors"
                    >
                      {/* Batch Details Column */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-bold text-primary text-xs shadow-2xs">
                            <Layers className="size-4" />
                          </div>
                          <div className="flex flex-col truncate">
                            <Link
                              href={`/dashboard/admin/batches/${batch.id}`}
                              className="font-semibold text-sm text-foreground hover:text-primary transition-colors truncate flex items-center gap-1 group/link"
                            >
                              <span>{batch.name}</span>
                              <ArrowUpRight className="size-3 opacity-0 -translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all text-muted-foreground" />
                            </Link>
                            <span className="text-[11px] text-muted-foreground">
                              ID:{" "}
                              <code className="font-mono">
                                {batch.id.slice(0, 8)}
                              </code>
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
                                  href={`/dashboard/admin/batches/${batch.id}`}
                                  className="flex items-center gap-2 text-xs w-full"
                                />
                              }
                            >
                              <Users className="size-3.5 text-muted-foreground" />
                              <span>View Roster & Details</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => onEditBatch(batch)}
                              className="gap-2 text-xs"
                            >
                              <Edit2 className="size-3.5 text-muted-foreground" />
                              <span>Edit Parameters</span>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              onClick={() => setBatchToDelete(batch)}
                              className="gap-2 text-xs text-destructive focus:bg-destructive/10 focus:text-destructive"
                            >
                              <Trash2 className="size-3.5" />
                              <span>Cancel / Archive</span>
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
      </div>

      {/* Delete / Cancel Batch Confirmation Dialog */}
      <Dialog
        open={!!batchToDelete}
        onOpenChange={(open) => !open && setBatchToDelete(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                <AlertTriangle className="size-4" />
              </div>
              <div>
                <DialogTitle className="font-heading text-lg">
                  Cancel / Archive Batch
                </DialogTitle>
                <DialogDescription className="text-xs">
                  This will mark the batch as CANCELLED. Students currently
                  enrolled will remain in system records.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {batchToDelete && (
            <div className="rounded-lg border border-border bg-muted/30 p-3 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Batch Name:</span>
                <span className="font-medium text-foreground">
                  {batchToDelete.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fee:</span>
                <span className="font-medium text-foreground">
                  ৳ {batchToDelete.fee.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <BatchStatusBadge status={batchToDelete.status} />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 pt-2">
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={deleteMutation.isPending}
                >
                  Keep Batch
                </Button>
              }
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Cancelling..." : "Confirm Cancel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
