"use client";

import { useForm } from "@tanstack/react-form";
import { Edit2, GraduationCap, Loader2, User as UserIcon } from "lucide-react";
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
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateTeacherMutation } from "@/hooks";
import type { UpdateTeacherDto, User } from "@/types";
import { updateTeacherSchema } from "@/validators";
import { TeacherStatusBadge } from "./teacher-status-badge";

interface EditTeacherDialogProps {
  teacher: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const genderLabels: Record<string, string> = {
  MALE: "Male",
  FEMALE: "Female",
  OTHER: "Other",
};

function getErrorMessage(error: unknown): string {
  if (!error) return "";
  if (typeof error === "string") return error;
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }
  return String(error);
}

export function EditTeacherDialog({
  teacher,
  open,
  onOpenChange,
}: EditTeacherDialogProps) {
  const updateMutation = useUpdateTeacherMutation();

  if (!teacher) return null;

  const profile = teacher.teacherProfile;
  const initialJoiningDate = profile?.joiningDate
    ? profile.joiningDate.split("T")[0]
    : teacher.createdAt
      ? teacher.createdAt.split("T")[0]
      : new Date().toISOString().split("T")[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Edit2 className="size-4" />
            </div>
            <div>
              <DialogTitle className="font-heading text-lg">
                Edit Teacher Details
              </DialogTitle>
              <DialogDescription className="text-xs">
                Update personal contact information, academic designations, and
                credentials for this teacher.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Account Identity Context Bar */}
        <div className="rounded-lg border border-border/70 bg-muted/30 p-3 flex items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground font-medium">
              Teacher ID:
            </span>
            <span className="font-mono text-xs font-semibold text-foreground">
              {teacher.id.slice(0, 8)}...
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground font-medium">
              Status:
            </span>
            <TeacherStatusBadge status={teacher.status} />
          </div>
        </div>

        {/* Edit Form */}
        <EditTeacherForm
          key={teacher.id}
          teacher={teacher}
          initialJoiningDate={initialJoiningDate}
          onSubmit={async (payload) => {
            await updateMutation.mutateAsync({
              userId: teacher.id,
              payload,
            });
            onOpenChange(false);
          }}
          isSubmitting={updateMutation.isPending}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

interface EditTeacherFormProps {
  teacher: User;
  initialJoiningDate: string;
  onSubmit: (payload: UpdateTeacherDto) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
}

function EditTeacherForm({
  teacher,
  initialJoiningDate,
  onSubmit,
  isSubmitting,
  onCancel,
}: EditTeacherFormProps) {
  const profile = teacher.teacherProfile;

  const form = useForm({
    defaultValues: {
      name: teacher.name || "",
      email: teacher.email || "",
      phone: teacher.phone || "",
      gender: (teacher.gender as "MALE" | "FEMALE" | "OTHER") || "MALE",
      designation: profile?.designation || "",
      qualification: profile?.qualification || "",
      specialization: profile?.specialization || "",
      joiningDate: initialJoiningDate,
    },
    validators: {
      onSubmit: updateTeacherSchema,
    },
    onSubmit: async ({ value }) => {
      const payload: UpdateTeacherDto = {
        name: value.name.trim(),
        email: value.email.trim().toLowerCase(),
        phone: value.phone.trim().replace(/[\s-]/g, ""),
        gender: value.gender,
        designation: value.designation.trim(),
        qualification: value.qualification.trim(),
        specialization: value.specialization.trim(),
        joiningDate: new Date(value.joiningDate).toISOString(),
      };
      await onSubmit(payload);
    },
  });

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-6 pt-1"
    >
      {/* Section 1: Personal & Contact Details */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 border-b border-border/60 pb-1.5 text-xs font-semibold text-foreground">
          <UserIcon className="size-3.5 text-primary" />
          <span>Personal & Contact Information</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Full Name */}
          <form.Field name="name">
            {(field) => {
              const errorMsg = getErrorMessage(field.state.meta.errors[0]);
              return (
                <Field
                  data-invalid={
                    field.state.meta.isTouched && !field.state.meta.isValid
                  }
                >
                  <FieldLabel className="text-xs font-medium">
                    Full Name <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="e.g. Dr. Mohammad Rahman"
                    className="h-9 text-xs"
                  />
                  {errorMsg && <FieldError>{errorMsg}</FieldError>}
                </Field>
              );
            }}
          </form.Field>

          {/* Email Address */}
          <form.Field name="email">
            {(field) => {
              const errorMsg = getErrorMessage(field.state.meta.errors[0]);
              return (
                <Field
                  data-invalid={
                    field.state.meta.isTouched && !field.state.meta.isValid
                  }
                >
                  <FieldLabel className="text-xs font-medium">
                    Official Email <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    name={field.name}
                    type="email"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="e.g. teacher@apexacademy.edu"
                    className="h-9 text-xs"
                  />
                  {errorMsg && <FieldError>{errorMsg}</FieldError>}
                </Field>
              );
            }}
          </form.Field>

          {/* Phone Number */}
          <form.Field name="phone">
            {(field) => {
              const errorMsg = getErrorMessage(field.state.meta.errors[0]);
              return (
                <Field
                  data-invalid={
                    field.state.meta.isTouched && !field.state.meta.isValid
                  }
                >
                  <FieldLabel className="text-xs font-medium">
                    Mobile Phone <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    name={field.name}
                    type="tel"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="h-9 text-xs"
                  />
                  {errorMsg && <FieldError>{errorMsg}</FieldError>}
                </Field>
              );
            }}
          </form.Field>

          {/* Gender */}
          <form.Field name="gender">
            {(field) => (
              <Field>
                <FieldLabel className="text-xs font-medium">
                  Gender <span className="text-destructive">*</span>
                </FieldLabel>
                <Select
                  value={field.state.value}
                  onValueChange={(val) => {
                    if (val)
                      field.handleChange(val as "MALE" | "FEMALE" | "OTHER");
                  }}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Select gender">
                      {(val: string | null) =>
                        val ? genderLabels[val] || val : "Select gender"
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            )}
          </form.Field>

          {/* Official Joining Date */}
          <form.Field name="joiningDate">
            {(field) => {
              const errorMsg = getErrorMessage(field.state.meta.errors[0]);
              return (
                <Field
                  data-invalid={
                    field.state.meta.isTouched && !field.state.meta.isValid
                  }
                >
                  <FieldLabel className="text-xs font-medium">
                    Joining Date <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    name={field.name}
                    type="date"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="h-9 text-xs"
                  />
                  {errorMsg && <FieldError>{errorMsg}</FieldError>}
                </Field>
              );
            }}
          </form.Field>
        </div>
      </div>

      {/* Section 2: Professional & Academic Credentials */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 border-b border-border/60 pb-1.5 text-xs font-semibold text-foreground">
          <GraduationCap className="size-3.5 text-primary" />
          <span>Professional & Academic Profile</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Designation */}
          <form.Field name="designation">
            {(field) => {
              const errorMsg = getErrorMessage(field.state.meta.errors[0]);
              return (
                <Field
                  data-invalid={
                    field.state.meta.isTouched && !field.state.meta.isValid
                  }
                  className="sm:col-span-2"
                >
                  <FieldLabel className="text-xs font-medium">
                    Designation / Role{" "}
                    <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="e.g. Senior Teacher / Lead Instructor"
                    className="h-9 text-xs"
                  />
                  {errorMsg && <FieldError>{errorMsg}</FieldError>}
                </Field>
              );
            }}
          </form.Field>

          {/* Qualification */}
          <form.Field name="qualification">
            {(field) => {
              const errorMsg = getErrorMessage(field.state.meta.errors[0]);
              return (
                <Field
                  data-invalid={
                    field.state.meta.isTouched && !field.state.meta.isValid
                  }
                >
                  <FieldLabel className="text-xs font-medium">
                    Highest Qualification{" "}
                    <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="e.g. M.Sc in Mathematics, BUET"
                    className="h-9 text-xs"
                  />
                  {errorMsg && <FieldError>{errorMsg}</FieldError>}
                </Field>
              );
            }}
          </form.Field>

          {/* Specialization */}
          <form.Field name="specialization">
            {(field) => {
              const errorMsg = getErrorMessage(field.state.meta.errors[0]);
              return (
                <Field
                  data-invalid={
                    field.state.meta.isTouched && !field.state.meta.isValid
                  }
                >
                  <FieldLabel className="text-xs font-medium">
                    Subject Specialization{" "}
                    <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="e.g. Higher Math & Statistics"
                    className="h-9 text-xs"
                  />
                  {errorMsg && <FieldError>{errorMsg}</FieldError>}
                </Field>
              );
            }}
          </form.Field>
        </div>
      </div>

      {/* Modal Actions Footer */}
      <DialogFooter className="gap-2.5 sm:gap-2.5 pt-4 border-t border-border/70">
        <DialogClose
          render={
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          }
        />
        <Button
          type="submit"
          size="sm"
          disabled={isSubmitting}
          className="gap-1.5 font-medium"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <span>Save Teacher Details</span>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
