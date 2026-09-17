"use client";

import {
  Eye,
  MoreHorizontal,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  User as UserIcon,
} from "lucide-react";
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
import {
  useDeleteStudentMutation,
  useUpdateStudentStatusMutation,
} from "@/hooks";
import type { User, UserStatus } from "@/types";
import { StudentStatusBadge } from "./student-status-badge";

interface StudentTableProps {
  students: User[];
  isLoading: boolean;
  onViewDetails: (student: User) => void;
}

export function StudentTable({
  students,
  isLoading,
  onViewDetails,
}: StudentTableProps) {
  const [studentToDelete, setStudentToDelete] = useState<User | null>(null);

  const updateStatusMutation = useUpdateStudentStatusMutation();
  const deleteMutation = useDeleteStudentMutation();

  const handleStatusToggle = (student: User) => {
    const nextStatus: UserStatus =
      student.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    updateStatusMutation.mutate({
      userId: student.id,
      status: nextStatus,
    });
  };

  const confirmDelete = () => {
    if (!studentToDelete) return;
    deleteMutation.mutate(studentToDelete.id, {
      onSettled: () => setStudentToDelete(null),
    });
  };

  return (
    <>
      <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="w-70">Student</TableHead>
                <TableHead className="min-w-45">Academic</TableHead>
                <TableHead className="min-w-45">Contact</TableHead>
                <TableHead className="min-w-45">Guardian</TableHead>
                <TableHead className="w-30">Status</TableHead>
                <TableHead className="w-30">Admitted</TableHead>
                <TableHead className="w-17.5 text-right">Actions</TableHead>
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
                        <Skeleton className="size-9 rounded-full" />
                        <div className="space-y-1.5">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1.5">
                        <Skeleton className="h-3.5 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1.5">
                        <Skeleton className="h-3.5 w-36" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1.5">
                        <Skeleton className="h-3.5 w-28" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-3.5 w-20" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="size-8 rounded-md ml-auto" />
                    </TableCell>
                  </TableRow>
                ))}

              {/* Empty state */}
              {!isLoading && students.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      <UserIcon className="size-8 opacity-40" />
                      <p className="font-medium text-sm text-foreground">
                        No students found
                      </p>
                      <p className="text-xs">
                        Try adjusting your filters, searching for a different
                        keyword, or admit a new student.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {/* Data rows */}
              {!isLoading &&
                students.map((student) => {
                  const profile = student.studentProfile;
                  const initials = student.name
                    ? student.name.charAt(0).toUpperCase()
                    : "S";

                  const formattedDate = student.createdAt
                    ? new Date(student.createdAt).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        },
                      )
                    : "—";

                  return (
                    <TableRow
                      key={student.id}
                      className="group transition-colors"
                    >
                      {/* Student Column */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary text-xs shadow-2xs">
                            {initials}
                          </div>
                          <div className="flex flex-col truncate">
                            <span className="font-semibold text-sm text-foreground truncate">
                              {student.name}
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
                            {profile?.classLevel || "General"}
                          </span>
                        </div>
                      </TableCell>

                      {/* Contact Column */}
                      <TableCell>
                        <div className="flex flex-col truncate">
                          <span className="text-xs text-foreground truncate">
                            {student.email}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            {student.phone || "No phone"}
                          </span>
                        </div>
                      </TableCell>

                      {/* Guardian Column */}
                      <TableCell>
                        <div className="flex flex-col truncate">
                          <span className="text-xs font-medium text-foreground truncate">
                            {profile?.guardianName || "—"}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            {profile?.guardianPhone || "—"}
                          </span>
                        </div>
                      </TableCell>

                      {/* Status Column */}
                      <TableCell>
                        <StudentStatusBadge status={student.status} />
                      </TableCell>

                      {/* Admission Date Column */}
                      <TableCell className="text-xs text-muted-foreground">
                        {formattedDate}
                      </TableCell>

                      {/* Action Menu */}
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
                              onClick={() => onViewDetails(student)}
                              className="gap-2 text-xs"
                            >
                              <Eye className="size-3.5 text-muted-foreground" />
                              <span>View Details</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => handleStatusToggle(student)}
                              className="gap-2 text-xs"
                            >
                              {student.status === "ACTIVE" ? (
                                <>
                                  <ShieldAlert className="size-3.5 text-amber-500" />
                                  <span>Deactivate</span>
                                </>
                              ) : (
                                <>
                                  <ShieldCheck className="size-3.5 text-emerald-500" />
                                  <span>Activate</span>
                                </>
                              )}
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              onClick={() => setStudentToDelete(student)}
                              className="gap-2 text-xs text-destructive focus:bg-destructive/10 focus:text-destructive"
                            >
                              <Trash2 className="size-3.5" />
                              <span>Delete Record</span>
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

      {/* Delete Confirmation Modal */}
      <Dialog
        open={Boolean(studentToDelete)}
        onOpenChange={(open) => {
          if (!open) setStudentToDelete(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Student Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong className="text-foreground">
                {studentToDelete?.name}
              </strong>
              ? This will remove their enrollment access and archive their
              records.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose render={<Button variant="outline" size="sm" />}>
              Cancel
            </DialogClose>
            <Button
              variant="destructive"
              size="sm"
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Student"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
