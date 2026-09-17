"use client";

import {
  Building2,
  Calendar,
  GraduationCap,
  Hash,
  Mail,
  Phone,
  ShieldAlert,
  ShieldCheck,
  User as UserIcon,
  Users,
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
import { useUpdateStudentStatusMutation } from "@/hooks";
import type { User, UserStatus } from "@/types";
import { StudentStatusBadge } from "./student-status-badge";

interface StudentDetailsModalProps {
  student: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StudentDetailsModal({
  student,
  open,
  onOpenChange,
}: StudentDetailsModalProps) {
  const updateStatusMutation = useUpdateStudentStatusMutation();

  if (!student) return null;

  const profile = student.studentProfile;
  const formattedJoinDate = new Date(student.createdAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  const handleStatusToggle = () => {
    const nextStatus: UserStatus =
      student.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    updateStatusMutation.mutate({
      userId: student.id,
      status: nextStatus,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl md:max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader className="pb-4 border-b border-border/70">
          <div className="flex items-start gap-4">
            <div className="size-14 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl ring-2 ring-primary/20 shrink-0">
              {student.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <DialogTitle className="text-xl font-semibold tracking-tight text-foreground truncate">
                  {student.name}
                </DialogTitle>
                <StudentStatusBadge status={student.status} />
              </div>
              <DialogDescription className="text-xs text-muted-foreground mt-1 flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <Hash className="size-3 text-muted-foreground/70" />
                  ID: {student.id.slice(0, 8)}...
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="size-3 text-muted-foreground/70" />
                  Joined {formattedJoinDate}
                </span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Academic Information */}
          <div className="rounded-lg border border-border/80 bg-muted/20 p-4">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-2 mb-3">
              <GraduationCap className="size-4 text-primary" />
              Academic Credentials
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <p className="text-[11px] font-medium text-muted-foreground">
                  Class / Grade
                </p>
                <p className="text-sm font-semibold text-foreground mt-0.5">
                  {profile?.classLevel || "Not assigned"}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-medium text-muted-foreground">
                  Roll / ID Number
                </p>
                <p className="text-sm font-semibold text-foreground mt-0.5 font-mono">
                  {profile?.rollNumber || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-medium text-muted-foreground">
                  Gender
                </p>
                <p className="text-sm font-medium text-foreground mt-0.5 capitalize">
                  {student.gender?.toLowerCase() || "Unspecified"}
                </p>
              </div>
              <div className="sm:col-span-3 pt-1 border-t border-border/50">
                <p className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                  <Building2 className="size-3 text-muted-foreground" />
                  School / College
                </p>
                <p className="text-sm font-medium text-foreground mt-0.5">
                  {profile?.institutionName || "Not specified"}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="rounded-lg border border-border/80 bg-muted/20 p-4">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-2 mb-3">
              <UserIcon className="size-4 text-primary" />
              Student Contact Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <p className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                  <Mail className="size-3 text-muted-foreground" />
                  Email Address
                </p>
                <a
                  href={`mailto:${student.email}`}
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors mt-0.5 block truncate underline-offset-4 hover:underline"
                >
                  {student.email}
                </a>
              </div>
              <div>
                <p className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                  <Phone className="size-3 text-muted-foreground" />
                  Mobile Phone
                </p>
                {student.phone ? (
                  <a
                    href={`tel:${student.phone}`}
                    className="text-sm font-medium text-foreground hover:text-primary transition-colors mt-0.5 block font-mono underline-offset-4 hover:underline"
                  >
                    {student.phone}
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground mt-0.5 italic">
                    Not provided
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Guardian Information */}
          <div className="rounded-lg border border-border/80 bg-muted/20 p-4">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-2 mb-3">
              <Users className="size-4 text-primary" />
              Parent / Guardian Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <p className="text-[11px] font-medium text-muted-foreground">
                  Guardian Name
                </p>
                <p className="text-sm font-semibold text-foreground mt-0.5">
                  {profile?.guardianName || "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                  <Phone className="size-3 text-muted-foreground" />
                  Guardian Phone
                </p>
                {profile?.guardianPhone ? (
                  <a
                    href={`tel:${profile.guardianPhone}`}
                    className="text-sm font-medium text-foreground hover:text-primary transition-colors mt-0.5 block font-mono underline-offset-4 hover:underline"
                  >
                    {profile.guardianPhone}
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground mt-0.5 italic">
                    Not provided
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-3 border-t border-border/70 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleStatusToggle}
            disabled={updateStatusMutation.isPending}
            className="text-xs"
          >
            {student.status === "ACTIVE" ? (
              <>
                <ShieldAlert className="size-3.5 mr-1.5 text-amber-500" />
                Deactivate Student
              </>
            ) : (
              <>
                <ShieldCheck className="size-3.5 mr-1.5 text-emerald-500" />
                Activate Student
              </>
            )}
          </Button>
          <DialogClose
            render={
              <Button
                type="button"
                variant="default"
                size="sm"
                className="text-xs"
              >
                Close Details
              </Button>
            }
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
