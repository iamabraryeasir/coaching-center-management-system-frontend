"use client";

import {
  Building2,
  Calendar,
  CheckCircle2,
  GraduationCap,
  Mail,
  Phone,
  Search,
  UserCheck,
  UserX,
  XCircle,
} from "lucide-react";
import { useState } from "react";
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
  useApproveStudentMutation,
  usePendingStudents,
  useRejectStudentMutation,
} from "@/hooks";
import type { PendingStudent } from "@/types";
import { StudentPagination } from "./student-pagination";

export function PendingStudentsQueue() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [studentToReject, setStudentToReject] = useState<PendingStudent | null>(
    null,
  );
  const [rejectionReason, setRejectionReason] = useState("");

  const { data, isLoading } = usePendingStudents({
    page,
    limit,
    search: search.trim() ? search.trim() : undefined,
  });

  const approveMutation = useApproveStudentMutation();
  const rejectMutation = useRejectStudentMutation();

  const pendingStudents = data?.data || [];
  const meta = data?.meta || {
    page,
    limit,
    total: 0,
    totalPage: 1,
  };

  const handleApprove = (student: PendingStudent) => {
    approveMutation.mutate(student.id);
  };

  const handleConfirmReject = () => {
    if (!studentToReject) return;
    rejectMutation.mutate(
      {
        id: studentToReject.id,
        reason: rejectionReason.trim() || undefined,
      },
      {
        onSettled: () => {
          setStudentToReject(null);
          setRejectionReason("");
        },
      },
    );
  };

  return (
    <div className="space-y-4">
      {/* Top action / search bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-xl border border-border/80 bg-card">
        <div className="flex items-center gap-2.5">
          <div className="size-9 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <UserCheck className="size-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              Online Admission Requests
              <Badge
                variant="outline"
                className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[11px]"
              >
                {meta.total} Pending
              </Badge>
            </h3>
            <p className="text-xs text-muted-foreground">
              Review and verify student registrations submitted via the public
              portal
            </p>
          </div>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search applicants..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-8 text-xs h-9"
          />
        </div>
      </div>

      {/* Table grid */}
      <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="w-60">Applicant</TableHead>
                <TableHead className="min-w-45">Academic</TableHead>
                <TableHead className="min-w-45">Contact</TableHead>
                <TableHead className="min-w-45">Guardian</TableHead>
                <TableHead className="w-30">Submitted</TableHead>
                <TableHead className="w-42.5 text-right">Decisions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {/* Skeleton loading state */}
              {isLoading &&
                Array.from({ length: 4 }).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: Static placeholder row
                  <TableRow key={i}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Skeleton className="size-9 rounded-full" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-28" />
                          <Skeleton className="h-3 w-36" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Skeleton className="h-3.5 w-24" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Skeleton className="h-3.5 w-28" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Skeleton className="h-3.5 w-24" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-3 w-20" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1.5">
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-8 w-16" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

              {/* Data rows */}
              {!isLoading &&
                pendingStudents.map((applicant) => (
                  <TableRow key={applicant.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs ring-1 ring-primary/20 shrink-0">
                          {applicant.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground text-sm truncate">
                            {applicant.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                            <Mail className="size-3 text-muted-foreground/70" />
                            {applicant.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="text-xs font-semibold text-foreground flex items-center gap-1">
                          <GraduationCap className="size-3.5 text-primary" />
                          {applicant.classLevel} &bull; Roll:{" "}
                          <span className="font-mono">
                            {applicant.rollNumber}
                          </span>
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate max-w-50 flex items-center gap-1">
                          <Building2 className="size-3 text-muted-foreground/70 shrink-0" />
                          {applicant.institutionName}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="text-xs font-mono text-foreground flex items-center gap-1">
                          <Phone className="size-3 text-muted-foreground/70" />
                          {applicant.phone}
                        </p>
                        {applicant.gender && (
                          <p className="text-[11px] text-muted-foreground capitalize">
                            Gender: {applicant.gender.toLowerCase()}
                          </p>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="text-xs font-medium text-foreground">
                          {applicant.guardianName}
                        </p>
                        <p className="text-[11px] font-mono text-muted-foreground">
                          {applicant.guardianPhone}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="size-3 text-muted-foreground/70" />
                        {new Date(applicant.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </p>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleApprove(applicant)}
                          disabled={
                            approveMutation.isPending ||
                            rejectMutation.isPending
                          }
                          className="h-8 text-xs font-medium text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-300"
                        >
                          <CheckCircle2 className="size-3.5 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setStudentToReject(applicant);
                            setRejectionReason("");
                          }}
                          disabled={
                            approveMutation.isPending ||
                            rejectMutation.isPending
                          }
                          className="h-8 text-xs font-medium text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                        >
                          <XCircle className="size-3.5 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

              {/* Empty state */}
              {!isLoading && pendingStudents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto text-muted-foreground">
                      <div className="size-12 rounded-full bg-muted/60 flex items-center justify-center">
                        <CheckCircle2 className="size-6 text-emerald-500" />
                      </div>
                      <p className="font-semibold text-foreground text-sm">
                        No pending applications
                      </p>
                      <p className="text-xs">
                        All student enrollment requests have been reviewed and
                        processed.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="p-3 border-t border-border/80 bg-muted/10">
          <StudentPagination
            meta={meta}
            onPageChange={setPage}
            onLimitChange={(newLimit) => {
              setLimit(newLimit);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* Reject Confirmation Dialog */}
      <Dialog
        open={Boolean(studentToReject)}
        onOpenChange={(open) => {
          if (!open) {
            setStudentToReject(null);
            setRejectionReason("");
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="size-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-2">
              <UserX className="size-5" />
            </div>
            <DialogTitle>Reject Admission Application</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject the application for{" "}
              <span className="font-semibold text-foreground">
                {studentToReject?.name}
              </span>
              ?
            </DialogDescription>
          </DialogHeader>

          <div className="py-2">
            <Field>
              <FieldLabel className="text-xs">
                Reason for Rejection (Optional)
              </FieldLabel>
              <Input
                placeholder="e.g. Incomplete credentials or invalid class level"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="text-xs"
              />
            </Field>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose
              render={
                <Button type="button" variant="outline" size="sm">
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
              {rejectMutation.isPending ? "Rejecting..." : "Confirm Rejection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
