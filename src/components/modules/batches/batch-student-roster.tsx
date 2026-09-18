"use client";

import {
  AlertTriangle,
  MoreHorizontal,
  Search,
  UserMinus,
  UserPlus,
  Users,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useBatchStudents, useRemoveStudentFromBatchMutation } from "@/hooks";

import type { BatchEnrollment } from "@/types";
import { StudentPagination } from "../students/student-pagination";
import { DirectEnrollDialog } from "./direct-enroll-dialog";

interface BatchStudentRosterProps {
  batchId: string;
  batchName: string;
}

export function BatchStudentRoster({
  batchId,
  batchName,
}: BatchStudentRosterProps) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [isDirectEnrollOpen, setIsDirectEnrollOpen] = useState(false);
  const [enrollmentToRemove, setEnrollmentToRemove] =
    useState<BatchEnrollment | null>(null);

  const { data, isLoading } = useBatchStudents(batchId, {
    page,
    limit,
    search: search.trim() || undefined,
  });

  const removeMutation = useRemoveStudentFromBatchMutation();

  const enrollments = (data?.data as BatchEnrollment[]) || [];
  const meta = data?.meta || { page: 1, limit: 10, total: 0, totalPage: 1 };

  const handleConfirmRemove = () => {
    if (!enrollmentToRemove || !enrollmentToRemove.student?.id) return;
    removeMutation.mutate(
      {
        batchId,
        userId: enrollmentToRemove.student.id,
      },
      {
        onSettled: () => setEnrollmentToRemove(null),
      },
    );
  };

  return (
    <div className="space-y-4">
      {/* Top action / search bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-xl border border-border/80 bg-card">
        <div className="flex items-center gap-2.5">
          <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
            <Users className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-semibold text-sm text-foreground">
                Enrolled Students
              </h3>
              <Badge
                variant="outline"
                className="text-xs px-2 py-0.5 border-primary/30 bg-primary/10 text-primary"
              >
                {isLoading ? "..." : `${meta.total} Students`}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Manage active student roster and direct admissions for this batch.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by student name, roll..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9 pr-3 h-9 text-xs"
            />
          </div>

          <Button
            type="button"
            size="sm"
            onClick={() => setIsDirectEnrollOpen(true)}
            className="h-9 gap-1.5 text-xs shrink-0"
          >
            <UserPlus className="size-3.5" />
            <span>Enroll Student</span>
          </Button>
        </div>
      </div>

      {/* Roster Table */}
      <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="min-w-60">Student</TableHead>
                <TableHead className="min-w-44">Academic Info</TableHead>
                <TableHead className="min-w-44">Contact</TableHead>
                <TableHead className="w-32">Status</TableHead>
                <TableHead className="w-36">Enrolled On</TableHead>
                <TableHead className="w-16 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {/* Skeleton loading */}
              {isLoading &&
                Array.from({ length: 5 }).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: Loading skeleton
                  <TableRow key={i}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Skeleton className="size-9 rounded-full" />
                        <div className="space-y-1.5">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1.5">
                        <Skeleton className="h-3.5 w-28" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1.5">
                        <Skeleton className="h-3.5 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-16 rounded-full" />
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
              {!isLoading && enrollments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-44 text-center">
                    <div className="flex flex-col items-center justify-center gap-1.5 max-w-sm mx-auto">
                      <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        <Users className="size-5" />
                      </div>
                      <p className="font-semibold text-sm text-foreground">
                        No students enrolled yet
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Enroll active students directly or approve
                        self-enrollment applications.
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setIsDirectEnrollOpen(true)}
                        className="mt-2 gap-1.5 text-xs"
                      >
                        <UserPlus className="size-3.5" />
                        <span>Enroll First Student</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {/* Data Rows */}
              {!isLoading &&
                enrollments.map((item) => {
                  const student = item.student;
                  const profile = student?.studentProfile;
                  const dateRaw = item.enrolledAt || item.createdAt;
                  const formattedDate = dateRaw
                    ? new Date(dateRaw).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "—";

                  const isApproved =
                    item.status === "APPROVED" || item.status === "ENROLLED";
                  const isPending = item.status === "PENDING";

                  return (
                    <TableRow key={item.id} className="transition-colors">
                      {/* Student Column */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary text-xs shadow-2xs">
                            {student?.name
                              ? student.name.charAt(0).toUpperCase()
                              : "S"}
                          </div>
                          <div className="flex flex-col truncate">
                            <span className="font-semibold text-sm text-foreground truncate">
                              {student?.name || "Unknown Student"}
                            </span>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <span>Roll:</span>
                              <code className="font-mono text-[11px] font-semibold text-foreground">
                                {profile?.rollNumber || "N/A"}
                              </code>
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Academic Column */}
                      <TableCell>
                        <div className="flex flex-col truncate">
                          <span className="text-xs font-medium text-foreground truncate">
                            {profile?.institutionName || "—"}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            {profile?.classLevel || "Standard"}
                          </span>
                        </div>
                      </TableCell>

                      {/* Contact Column */}
                      <TableCell>
                        <div className="flex flex-col truncate">
                          <span className="text-xs text-foreground truncate">
                            {student?.email || "—"}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            {student?.phone || "No phone"}
                          </span>
                        </div>
                      </TableCell>

                      {/* Status Column */}
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            isApproved
                              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-medium"
                              : isPending
                                ? "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-medium"
                                : "border-muted-foreground/30 bg-muted/60 text-muted-foreground text-xs"
                          }
                        >
                          {isApproved
                            ? "Active"
                            : isPending
                              ? "Pending"
                              : item.status}
                        </Badge>
                      </TableCell>

                      {/* Enrolled Date */}
                      <TableCell className="text-xs text-muted-foreground">
                        {formattedDate}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                aria-label="Student actions"
                                className="size-8 p-0 text-muted-foreground hover:text-foreground"
                              />
                            }
                          >
                            <MoreHorizontal className="size-4" />
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem
                              onClick={() => setEnrollmentToRemove(item)}
                              className="gap-2 text-xs text-destructive focus:bg-destructive/10 focus:text-destructive"
                            >
                              <UserMinus className="size-3.5" />
                              <span>Remove from Batch</span>
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

        {/* Pagination controls */}
        <StudentPagination
          meta={meta}
          onPageChange={setPage}
          onLimitChange={(l) => {
            setLimit(l);
            setPage(1);
          }}
        />
      </div>

      {/* Remove student confirmation modal */}
      <Dialog
        open={!!enrollmentToRemove}
        onOpenChange={(open) => !open && setEnrollmentToRemove(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                <AlertTriangle className="size-4" />
              </div>
              <div>
                <DialogTitle className="font-heading text-lg">
                  Remove Student from Batch
                </DialogTitle>
                <DialogDescription className="text-xs">
                  This will unenroll the student from &quot;{batchName}&quot;.
                  Their account will remain active in the system.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {enrollmentToRemove && (
            <div className="rounded-lg border border-border bg-muted/30 p-3 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Student:</span>
                <span className="font-medium text-foreground">
                  {enrollmentToRemove.student?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="text-foreground">
                  {enrollmentToRemove.student?.email}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Batch:</span>
                <span className="font-medium text-foreground">{batchName}</span>
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
                  disabled={removeMutation.isPending}
                >
                  Cancel
                </Button>
              }
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleConfirmRemove}
              disabled={removeMutation.isPending}
            >
              {removeMutation.isPending ? "Removing..." : "Confirm Removal"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Direct Enroll Modal */}
      <DirectEnrollDialog
        batchId={batchId}
        batchName={batchName}
        open={isDirectEnrollOpen}
        onOpenChange={setIsDirectEnrollOpen}
      />
    </div>
  );
}
