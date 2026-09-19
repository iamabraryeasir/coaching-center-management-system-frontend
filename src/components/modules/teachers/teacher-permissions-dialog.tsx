"use client";

import { KeyRound, Loader2, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUpdateTeacherPermissionsMutation } from "@/hooks";
import {
  getTeacherPermissions,
  type TeacherPermission,
  type User,
} from "@/types";

interface TeacherPermissionsDialogProps {
  teacher: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AVAILABLE_PERMISSIONS: {
  id: TeacherPermission;
  label: string;
  description: string;
}[] = [
  {
    id: "MANAGE_ATTENDANCE",
    label: "Daily Attendance Management",
    description:
      "Empowers the teacher to mark batch daily attendance, record check-ins, and inspect student attendance history.",
  },
  {
    id: "MANAGE_EXAMS",
    label: "Exams & Results Publishing",
    description:
      "Allows creating assessment papers, entering student scores/marks, and publishing class results.",
  },
  {
    id: "MANAGE_ROUTINES",
    label: "Routine & Timetable Scheduling",
    description:
      "Authorizes managing classroom routine slots, modifying session timings, and assigning rooms.",
  },
];

export function TeacherPermissionsDialog({
  teacher,
  open,
  onOpenChange,
}: TeacherPermissionsDialogProps) {
  const [selectedPermissions, setSelectedPermissions] = useState<
    TeacherPermission[]
  >([]);

  const updatePermissionsMutation = useUpdateTeacherPermissionsMutation();

  useEffect(() => {
    if (teacher) {
      setSelectedPermissions(getTeacherPermissions(teacher));
    }
  }, [teacher]);

  const togglePermission = (permission: TeacherPermission) => {
    setSelectedPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission],
    );
  };

  const handleSave = () => {
    if (!teacher) return;
    updatePermissionsMutation.mutate(
      {
        userId: teacher.id,
        permissions: selectedPermissions,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  if (!teacher) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <KeyRound className="size-4" />
            </div>
            <div>
              <DialogTitle className="font-heading text-lg">
                Teacher Permissions
              </DialogTitle>
              <DialogDescription className="text-xs">
                Configure system access and management permissions for{" "}
                <span className="font-semibold text-foreground">
                  {teacher.name}
                </span>
                .
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3 pt-2">
          {AVAILABLE_PERMISSIONS.map((perm) => {
            const isChecked = selectedPermissions.includes(perm.id);

            return (
              <label
                key={perm.id}
                className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-all ${
                  isChecked
                    ? "border-primary bg-primary/5 shadow-2xs"
                    : "border-border/80 hover:bg-muted/40"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => togglePermission(perm.id)}
                  className="size-4 mt-0.5 rounded text-primary focus:ring-primary accent-primary cursor-pointer"
                />
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    {perm.label}
                    {isChecked && (
                      <ShieldCheck className="size-3.5 text-primary shrink-0" />
                    )}
                  </span>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {perm.description}
                  </p>
                </div>
              </label>
            );
          })}
        </div>

        <DialogFooter className="gap-2 pt-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={updatePermissionsMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            disabled={updatePermissionsMutation.isPending}
          >
            {updatePermissionsMutation.isPending ? (
              <>
                <Loader2 className="size-3.5 animate-spin mr-1.5" />
                <span>Saving Permissions...</span>
              </>
            ) : (
              "Save Permissions"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
