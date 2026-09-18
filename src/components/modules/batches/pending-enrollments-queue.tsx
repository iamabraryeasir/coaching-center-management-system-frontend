"use client";

import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
  Loader2,
  Mail,
  Phone,
  Search,
  User,
  UserCheck,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
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
import { Field, FieldLabel } from "@/components/ui/field";
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
  useApproveEnrollmentMutation,
  usePendingEnrollments,
  useRejectEnrollmentMutation,
} from "@/hooks";
import type { BatchEnrollment } from "@/types";
import { BatchStatusBadge } from "./batch-status-badge";

export function PendingEnrollmentsQueue() {
  const [search, setSearch] = useState("");
  const [enrollmentToReject, setEnrollmentToReject] =
    useState<BatchEnrollment | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const { data, isLoading } = usePendingEnrollments();

  const approveMutation = useApproveEnrollmentMutation();
  const rejectMutation = useRejectEnrollmentMutation();

  const pendingList = (data?.data as BatchEnrollment[]) || [];

  // Filter client-side by student name, email, or batch name
  const filteredList = useMemo(() => {
    if (!search.trim()) return pendingList;
    const q = search.toLowerCase();
    return pendingList.filter(
      (item) =>
        item.student?.name?.toLowerCase().includes(q) ||
        item.student?.email?.toLowerCase().includes(q) ||
        item.student?.phone?.toLowerCase().includes(q) ||
        item.batch?.name?.toLowerCase().includes(q),
    );
  }, [pendingList, search]);

  const handleApprove = (enrollment: BatchEnrollment) => {
    approveMutation.mutate(enrollment.id);
  };

  const handleConfirmReject = () => {
    if (!enrollmentToReject) return;
    rejectMutation.mutate(
      {
        enrollmentId: enrollmentToReject.id,
        reason: rejectionReason.trim() || undefined,
      },
      {
        onSettled: () => {
          setEnrollmentToReject(null);
          setRejectionReason("");
        },
      },
    );
  };

  return (
    <div className="space-y-4">
      {/* Top Banner / Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-xl border border-border/80 bg-card">
        <div className="flex items-center gap-2.5">
          <div className="size-9 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <Clock className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-semibold text-sm text-foreground">
                Self-Enrollment Queue
              </h3>
              <Badge
                variant="outline"
                className="border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs px-2 py-0.5"
              >
                {isLoading ? "..." : `${pendingList.length} Pending`}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Review and approve or reject student self-enrollment applications.
            </p>
          </div>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Filter by student or batch..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-3 h-9 text-xs"
          />
        </div>
      </div>

      {/* Table of Pending Enrollments */}
      <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="min-w-56">Student Details</TableHead>
                <TableHead className="min-w-56">Requested Batch</TableHead>
                <TableHead className="w-32">Course Fee</TableHead>
                <TableHead className="w-36">Requested On</TableHead>
                <TableHead className="w-44 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {/* Skeleton State */}
              {isLoading &&
                Array.from({ length: 4 }).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: Static placeholder row
                  <TableRow key={i}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <Skeleton className="size-8 rounded-full" />
                        <div className="space-y-1.5">
                          <Skeleton className="h-3.5 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1.5">
                        <Skeleton className="h-3.5 w-36" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-3.5 w-24" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Skeleton className="h-8 w-20 rounded-md" />
                        <Skeleton className="h-8 w-16 rounded-md" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

              {/* Empty State */}
              {!isLoading && filteredList.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-44 text-center">
                    <div className="flex flex-col items-center justify-center gap-1.5 max-w-sm mx-auto">
                      <div className="flex size-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        <UserCheck className="size-5" />
                      </div>
                      <p className="font-semibold text-sm text-foreground">
                        No pending enrollments
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {search.trim()
                          ? "No pending requests matched your search query."
                          : "All student enrollment requests have been reviewed and resolved."}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {/* Data Rows */}
              {!isLoading &&
                filteredList.map((enrollment) => {
                  const student = enrollment.student;
                  const batch = enrollment.batch;
                  const dateRaw = enrollment.enrolledAt || enrollment.createdAt;
                  const formattedDate = dateRaw
                    ? new Date(dateRaw).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "—";

                  const isApproving =
                    approveMutation.isPending &&
                    approveMutation.variables === enrollment.id;
                  const isRejecting =
                    rejectMutation.isPending &&
                    rejectMutation.variables?.enrollmentId === enrollment.id;

                  return (
                    <TableRow key={enrollment.id} className="transition-colors">
                      {/* Student Details */}
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
                            {student?.name ? (
                              student.name.charAt(0).toUpperCase()
                            ) : (
                              <User className="size-3.5" />
                            )}
                          </div>
                          <div className="flex flex-col truncate">
                            <span className="font-semibold text-xs text-foreground truncate">
                              {student?.name || "Unknown Student"}
                            </span>
                            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                              {student?.email && (
                                <span className="flex items-center gap-0.5 truncate">
                                  <Mail className="size-2.5 shrink-0" />
                                  {student.email}
                                </span>
                              )}
                              {student?.phone && (
                                <span className="flex items-center gap-0.5 shrink-0">
                                  <Phone className="size-2.5" />
                                  {student.phone}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Requested Batch */}
                      <TableCell>
                        <div className="flex flex-col truncate">
                          <div className="flex items-center gap-1 text-xs font-semibold text-foreground truncate">
                            <Layers className="size-3 text-muted-foreground shrink-0" />
                            <span className="truncate">
                              {batch?.name || "Unknown Batch"}
                            </span>
                          </div>
                          {batch?.status && (
                            <div className="mt-0.5">
                              <BatchStatusBadge
                                status={batch.status}
                                className="text-[10px] px-1.5 py-0"
                              />
                            </div>
                          )}
                        </div>
                      </TableCell>

                      {/* Fee */}
                      <TableCell>
                        <span className="text-xs font-semibold text-foreground">
                          {batch?.fee !== undefined
                            ? `৳ ${batch.fee.toLocaleString()}`
                            : "—"}
                        </span>
                      </TableCell>

                      {/* Date */}
                      <TableCell className="text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="size-3 text-muted-foreground" />
                          <span>{formattedDate}</span>
                        </div>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Approve Button */}
                          <Button
                            type="button"
                            variant="default"
                            size="sm"
                            onClick={() => handleApprove(enrollment)}
                            disabled={isApproving || isRejecting}
                            className="h-8 gap-1 px-2.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            {isApproving ? (
                              <Loader2 className="size-3 animate-spin" />
                            ) : (
                              <CheckCircle2 className="size-3.5" />
                            )}
                            <span>Approve</span>
                          </Button>

                          {/* Reject Button */}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setEnrollmentToReject(enrollment)}
                            disabled={isApproving || isRejecting}
                            className="h-8 gap-1 px-2 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive border-border"
                          >
                            {isRejecting ? (
                              <Loader2 className="size-3 animate-spin" />
                            ) : (
                              <XCircle className="size-3.5" />
                            )}
                            <span>Reject</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Reject Reason Confirmation Modal */}
      <Dialog
        open={!!enrollmentToReject}
        onOpenChange={(open) => {
          if (!open) {
            setEnrollmentToReject(null);
            setRejectionReason("");
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                <AlertTriangle className="size-4" />
              </div>
              <div>
                <DialogTitle className="font-heading text-lg">
                  Reject Enrollment Application
                </DialogTitle>
                <DialogDescription className="text-xs">
                  Are you sure you want to decline this student&apos;s
                  enrollment request?
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {enrollmentToReject && (
            <div className="space-y-3 pt-2">
              <div className="rounded-lg border border-border bg-muted/30 p-3 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Student:</span>
                  <span className="font-medium text-foreground">
                    {enrollmentToReject.student?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Target Batch:</span>
                  <span className="font-medium text-foreground">
                    {enrollmentToReject.batch?.name}
                  </span>
                </div>
              </div>

              <Field>
                <FieldLabel className="text-xs font-semibold">
                  Reason for Rejection{" "}
                  <span className="text-muted-foreground font-normal">
                    (Optional)
                  </span>
                </FieldLabel>
                <Input
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. Batch capacity reached, prerequisite not met..."
                  className="h-9 text-xs"
                />
              </Field>
            </div>
          )}

          <DialogFooter className="gap-2 pt-2">
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={rejectMutation.isPending}
                >
                  Cancel
                </Button>
              }
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleConfirmReject}
              disabled={rejectMutation.isPending}
            >
              {rejectMutation.isPending ? (
                <>
                  <Loader2 className="size-3.5 animate-spin mr-1.5" />
                  <span>Rejecting...</span>
                </>
              ) : (
                "Confirm Rejection"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
