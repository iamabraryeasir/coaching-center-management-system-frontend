"use client";

import {
  Calendar,
  Eye,
  KeyRound,
  MoreHorizontal,
  Plus,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Users,
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
  useDeleteTeacherMutation,
  useUpdateTeacherStatusMutation,
} from "@/hooks";
import {
  type ApiMeta,
  getTeacherPermissions,
  type User,
  type UserStatus,
} from "@/types";
import { StudentPagination } from "../students/student-pagination";
import { TeacherPermissionsBadges } from "./teacher-permissions-badges";
import { TeacherStatusBadge } from "./teacher-status-badge";

interface TeacherTableProps {
  teachers: User[];
  isLoading: boolean;
  meta?: ApiMeta;
  onViewDetails: (teacher: User) => void;
  onManagePermissions: (teacher: User) => void;
  onCreateTeacher?: () => void;
}

export function TeacherTable({
  teachers,
  isLoading,
  meta,
  onViewDetails,
  onManagePermissions,
  onCreateTeacher,
}: TeacherTableProps) {
  const [teacherToDelete, setTeacherToDelete] = useState<User | null>(null);

  const updateStatusMutation = useUpdateTeacherStatusMutation();
  const deleteMutation = useDeleteTeacherMutation();

  const handleStatusToggle = (teacher: User) => {
    const nextStatus: UserStatus =
      teacher.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    updateStatusMutation.mutate({
      userId: teacher.id,
      status: nextStatus,
    });
  };

  const confirmDelete = () => {
    if (!teacherToDelete) return;
    deleteMutation.mutate(teacherToDelete.id, {
      onSettled: () => setTeacherToDelete(null),
    });
  };

  return (
    <>
      <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="min-w-60">Faculty Member</TableHead>
                <TableHead className="min-w-44">
                  Designation & Specialty
                </TableHead>
                <TableHead className="min-w-48">Permissions</TableHead>
                <TableHead className="w-36">Joining Date</TableHead>
                <TableHead className="w-32">Status</TableHead>
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
                        <Skeleton className="size-9 rounded-full" />
                        <div className="space-y-1.5">
                          <Skeleton className="h-4 w-36" />
                          <Skeleton className="h-3 w-28" />
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
                      <div className="flex gap-1.5">
                        <Skeleton className="h-5 w-20 rounded-full" />
                        <Skeleton className="h-5 w-24 rounded-full" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-3.5 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="size-8 rounded-md ml-auto" />
                    </TableCell>
                  </TableRow>
                ))}

              {/* Empty state */}
              {!isLoading && teachers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-52 text-center">
                    <div className="flex flex-col items-center justify-center gap-2.5 max-w-md mx-auto text-muted-foreground p-6">
                      <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        <Users className="size-6" />
                      </div>
                      <p className="font-semibold text-sm text-foreground">
                        No faculty members found
                      </p>
                      <p className="text-xs leading-relaxed">
                        No teachers matched your search or status filters. Try
                        clearing active filters or onboard a new faculty member.
                      </p>
                      {onCreateTeacher && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={onCreateTeacher}
                          className="mt-2 gap-1.5 font-medium"
                        >
                          <Plus className="size-3.5" />
                          <span>Onboard Faculty Member</span>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {/* Data rows */}
              {!isLoading &&
                teachers.map((teacher) => {
                  const profile = teacher.teacherProfile;
                  const initials = teacher.name
                    ? teacher.name
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()
                    : "T";

                  const joinDate = profile?.joiningDate || teacher.createdAt;
                  const formattedJoinDate = joinDate
                    ? new Date(joinDate).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "—";

                  return (
                    <TableRow
                      key={teacher.id}
                      className="group transition-colors"
                    >
                      {/* Faculty Member Column */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary text-xs shadow-2xs">
                            {initials}
                          </div>
                          <div className="flex flex-col truncate">
                            <span className="font-semibold text-sm text-foreground truncate">
                              {teacher.name}
                            </span>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span className="truncate">{teacher.email}</span>
                              {teacher.phone && (
                                <>
                                  <span className="text-border">•</span>
                                  <span className="truncate">
                                    {teacher.phone}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Designation & Specialty Column */}
                      <TableCell>
                        <div className="flex flex-col truncate">
                          <span className="text-xs font-semibold text-foreground truncate">
                            {profile?.designation || "Faculty Member"}
                          </span>
                          <span className="text-[11px] text-muted-foreground truncate">
                            {profile?.specialization
                              ? `${profile.specialization}${profile.qualification ? ` • ${profile.qualification}` : ""}`
                              : profile?.qualification || "General Instruction"}
                          </span>
                        </div>
                      </TableCell>

                      {/* Permissions Column */}
                      <TableCell>
                        <TeacherPermissionsBadges
                          permissions={getTeacherPermissions(teacher)}
                        />
                      </TableCell>

                      {/* Joining Date Column */}
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Calendar className="size-3.5 text-muted-foreground/70 shrink-0" />
                          <span>{formattedJoinDate}</span>
                        </div>
                      </TableCell>

                      {/* Status Column */}
                      <TableCell>
                        <TeacherStatusBadge status={teacher.status} />
                      </TableCell>

                      {/* Action Menu */}
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                aria-label="Faculty actions"
                                className="size-8 p-0 text-muted-foreground hover:text-foreground"
                              />
                            }
                          >
                            <MoreHorizontal className="size-4" />
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end" className="w-52">
                            <DropdownMenuItem
                              onClick={() => onViewDetails(teacher)}
                              className="gap-2 text-xs cursor-pointer"
                            >
                              <Eye className="size-3.5 text-muted-foreground" />
                              <span>View Faculty Profile</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => onManagePermissions(teacher)}
                              className="gap-2 text-xs cursor-pointer"
                            >
                              <KeyRound className="size-3.5 text-primary" />
                              <span>Manage Permissions</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => handleStatusToggle(teacher)}
                              className="gap-2 text-xs cursor-pointer"
                            >
                              {teacher.status === "ACTIVE" ? (
                                <>
                                  <ShieldAlert className="size-3.5 text-amber-500" />
                                  <span>Deactivate Account</span>
                                </>
                              ) : (
                                <>
                                  <ShieldCheck className="size-3.5 text-emerald-500" />
                                  <span>Activate Account</span>
                                </>
                              )}
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              onClick={() => setTeacherToDelete(teacher)}
                              className="gap-2 text-xs text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                            >
                              <Trash2 className="size-3.5" />
                              <span>Delete Faculty Account</span>
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

        {/* Table Footer with Pagination */}
        {meta && meta.total > 0 && (
          <StudentPagination meta={meta} itemLabel="faculty members" />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={Boolean(teacherToDelete)}
        onOpenChange={(open) => {
          if (!open) setTeacherToDelete(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive font-heading">
              Confirm Faculty Deletion
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm leading-relaxed pt-1">
              Are you sure you want to delete the faculty account for{" "}
              <strong className="text-foreground">
                {teacherToDelete?.name}
              </strong>
              ? This action will archive their profile, revoke routine teaching
              assignments, and terminate active authentication tokens.
            </DialogDescription>
          </DialogHeader>

          {teacherToDelete && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-xs space-y-1 text-destructive">
              <p className="font-semibold flex items-center gap-1.5">
                <Trash2 className="size-3.5" />
                Permanent Revocation Notice
              </p>
              <p className="text-muted-foreground text-[11px]">
                Faculty member will immediately lose access to attendance
                registers, routine timetables, and assessment recording.
              </p>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={deleteMutation.isPending}
                >
                  Cancel
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
              {deleteMutation.isPending
                ? "Deleting Faculty..."
                : "Confirm Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
