"use client";

import {
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Edit2,
  Hash,
  KeyRound,
  Mail,
  Phone,
  ShieldAlert,
  ShieldCheck,
  User as UserIcon,
  XCircle,
} from "lucide-react";
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
import { useTeacher, useUpdateTeacherStatusMutation } from "@/hooks";
import {
  getTeacherPermissions,
  type TeacherPermission,
  type User,
  type UserStatus,
} from "@/types";
import { TeacherStatusBadge } from "./teacher-status-badge";

interface TeacherDetailsModalProps {
  teacher: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onManagePermissions?: (teacher: User) => void;
  onEditTeacher?: (teacher: User) => void;
}

const PERMISSION_CONFIG: {
  key: TeacherPermission;
  label: string;
  description: string;
}[] = [
  {
    key: "MANAGE_ATTENDANCE",
    label: "Daily Attendance Management",
    description: "Mark daily batch attendance and inspect check-in histories.",
  },
  {
    key: "MANAGE_EXAMS",
    label: "Exams & Results Publishing",
    description: "Create assessment papers and input student marks.",
  },
  {
    key: "MANAGE_ROUTINES",
    label: "Routine & Timetable Scheduling",
    description: "Schedule class periods and assign timetable slots.",
  },
];

export function TeacherDetailsModal({
  teacher,
  open,
  onOpenChange,
  onManagePermissions,
  onEditTeacher,
}: TeacherDetailsModalProps) {
  const updateStatusMutation = useUpdateTeacherStatusMutation();

  // Fresh profile query
  const { data: teacherResponse } = useTeacher(teacher?.id || "");
  const activeTeacher = teacherResponse?.data || teacher;

  if (!activeTeacher) return null;

  const profile = activeTeacher.teacherProfile;
  const joinDate = profile?.joiningDate || activeTeacher.createdAt;
  const formattedJoinDate = joinDate
    ? new Date(joinDate).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  const memberSince = activeTeacher.createdAt
    ? new Date(activeTeacher.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

  const initials = activeTeacher.name
    ? activeTeacher.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "T";

  const handleStatusToggle = () => {
    const nextStatus: UserStatus =
      activeTeacher.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    updateStatusMutation.mutate({
      userId: activeTeacher.id,
      status: nextStatus,
    });
  };

  const handleOpenPermissions = () => {
    if (onManagePermissions) {
      onOpenChange(false);
      onManagePermissions(activeTeacher);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl md:max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        {/* Modal Header */}
        <DialogHeader className="pb-4 border-b border-border/70">
          <div className="flex items-start gap-4">
            <div className="size-14 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl ring-2 ring-primary/20 shrink-0">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <DialogTitle className="text-xl font-semibold tracking-tight text-foreground truncate">
                  {activeTeacher.name}
                </DialogTitle>
                <TeacherStatusBadge status={activeTeacher.status} />
              </div>
              <DialogDescription className="text-xs text-muted-foreground mt-1 flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <Hash className="size-3 text-muted-foreground/70" />
                  ID: {activeTeacher.id.slice(0, 8)}...
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="size-3 text-muted-foreground/70" />
                  Account created {memberSince}
                </span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Professional Credentials Section */}
          <div className="rounded-lg border border-border/80 bg-muted/20 p-4">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-2 mb-3">
              <Award className="size-4 text-primary" />
              Academic & Teacher Credentials
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <p className="text-[11px] text-muted-foreground font-medium">
                  Designation
                </p>
                <p className="text-sm font-semibold text-foreground mt-0.5">
                  {profile?.designation || "Teacher"}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground font-medium">
                  Academic Qualification
                </p>
                <p className="text-sm font-semibold text-foreground mt-0.5">
                  {profile?.qualification || "General Academic"}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground font-medium">
                  Subject Specialization
                </p>
                <p className="text-sm font-semibold text-foreground mt-0.5">
                  {profile?.specialization || "All Disciplines"}
                </p>
              </div>
            </div>
          </div>

          {/* Contact & Personal Information */}
          <div className="rounded-lg border border-border/80 bg-muted/20 p-4">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-2 mb-3">
              <UserIcon className="size-4 text-primary" />
              Contact & Profile Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <p className="text-[11px] text-muted-foreground font-medium">
                  Official Email
                </p>
                <p className="text-sm font-semibold text-foreground mt-0.5 truncate flex items-center gap-1.5">
                  <Mail className="size-3.5 text-muted-foreground" />
                  <span>{activeTeacher.email}</span>
                </p>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground font-medium">
                  Phone Number
                </p>
                <p className="text-sm font-semibold text-foreground mt-0.5 flex items-center gap-1.5">
                  <Phone className="size-3.5 text-muted-foreground" />
                  <span>{activeTeacher.phone || "Not provided"}</span>
                </p>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground font-medium">
                  Gender
                </p>
                <p className="text-sm font-semibold text-foreground mt-0.5">
                  {activeTeacher.gender || "Unspecified"}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground font-medium">
                  Official Joining Date
                </p>
                <p className="text-sm font-semibold text-foreground mt-0.5 flex items-center gap-1.5">
                  <Calendar className="size-3.5 text-muted-foreground" />
                  <span>{formattedJoinDate}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Permissions & Access Rights Section */}
          <div className="rounded-lg border border-border/80 bg-muted/20 p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
                <KeyRound className="size-4 text-primary" />
                Permissions & Access Rights
              </h4>
              {onManagePermissions && (
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  onClick={handleOpenPermissions}
                  className="gap-1 text-xs"
                >
                  <KeyRound className="size-3 text-primary" />
                  <span>Edit Permissions</span>
                </Button>
              )}
            </div>

            <div className="space-y-2">
              {PERMISSION_CONFIG.map((perm) => {
                const activePermissions = getTeacherPermissions(activeTeacher);
                const isGranted = activePermissions.includes(perm.key);
                return (
                  <div
                    key={perm.key}
                    className={`flex items-start justify-between p-2.5 rounded-lg border text-xs transition-colors ${
                      isGranted
                        ? "border-primary/30 bg-primary/5"
                        : "border-border/60 bg-card/60 opacity-60"
                    }`}
                  >
                    <div className="space-y-0.5">
                      <p className="font-semibold text-foreground flex items-center gap-1.5">
                        {isGranted ? (
                          <CheckCircle2 className="size-3.5 text-primary shrink-0" />
                        ) : (
                          <XCircle className="size-3.5 text-muted-foreground shrink-0" />
                        )}
                        <span>{perm.label}</span>
                      </p>
                      <p className="text-muted-foreground text-[11px] pl-5">
                        {perm.description}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                        isGranted
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isGranted ? "Granted" : "Not Assigned"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 pt-4 border-t border-border/70 flex flex-col-reverse sm:flex-row sm:justify-between items-center w-full">
          <div className="w-full sm:w-auto">
            <Button
              type="button"
              variant={
                activeTeacher.status === "ACTIVE" ? "outline" : "default"
              }
              size="sm"
              onClick={handleStatusToggle}
              disabled={updateStatusMutation.isPending}
              className="w-full sm:w-auto gap-1.5"
            >
              {activeTeacher.status === "ACTIVE" ? (
                <>
                  <ShieldAlert className="size-3.5 text-amber-500" />
                  <span>Deactivate Teacher Account</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="size-3.5 text-emerald-500" />
                  <span>Activate Teacher Account</span>
                </>
              )}
            </Button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {onEditTeacher && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  onOpenChange(false);
                  onEditTeacher(activeTeacher);
                }}
                className="gap-1.5"
              >
                <Edit2 className="size-3.5 text-primary" />
                <span>Edit Teacher</span>
              </Button>
            )}

            <DialogClose
              render={
                <Button type="button" variant="secondary" size="sm">
                  Close Details
                </Button>
              }
            />
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
