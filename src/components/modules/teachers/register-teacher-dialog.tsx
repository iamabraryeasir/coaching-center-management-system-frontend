"use client";

import { useForm } from "@tanstack/react-form";
import {
  GraduationCap,
  KeyRound,
  Loader2,
  ShieldCheck,
  User,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { useRegisterTeacherMutation } from "@/hooks";
import type { RegisterTeacherDto, TeacherPermission } from "@/types";
import { registerTeacherSchema } from "@/validators";

interface RegisterTeacherDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactElement;
}

const genderLabels: Record<string, string> = {
  MALE: "Male",
  FEMALE: "Female",
  OTHER: "Other",
};

const AVAILABLE_PERMISSIONS: {
  id: TeacherPermission;
  label: string;
  desc: string;
}[] = [
  {
    id: "MANAGE_ATTENDANCE",
    label: "Daily Attendance",
    desc: "Mark batch daily attendance & track student check-ins",
  },
  {
    id: "MANAGE_EXAMS",
    label: "Exams & Results",
    desc: "Schedule assessment exams, record scores & publish cards",
  },
  {
    id: "MANAGE_ROUTINES",
    label: "Routines & Timetable",
    desc: "Create & edit weekly classroom session schedules",
  },
];

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

export function RegisterTeacherDialog({
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  trigger,
}: RegisterTeacherDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = setControlledOpen || setInternalOpen;

  const registerMutation = useRegisterTeacherMutation();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      gender: "MALE" as "MALE" | "FEMALE" | "OTHER",
      designation: "",
      qualification: "",
      specialization: "",
      joiningDate: new Date().toISOString().split("T")[0],
      permissions: [] as TeacherPermission[],
    },
    validators: {
      onSubmit: registerTeacherSchema,
    },
    onSubmit: async ({ value }) => {
      const payload: RegisterTeacherDto = {
        name: value.name.trim(),
        email: value.email.trim().toLowerCase(),
        password: value.password,
        phone: value.phone.trim().replace(/[\s-]/g, ""),
        gender: value.gender,
        designation: value.designation.trim(),
        qualification: value.qualification.trim(),
        specialization: value.specialization.trim(),
        joiningDate: new Date(value.joiningDate).toISOString(),
        permissions: value.permissions,
      };

      await registerMutation.mutateAsync(payload, {
        onSuccess: () => {
          form.reset();
          setIsOpen(false);
        },
      });
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger && <DialogTrigger render={trigger} />}

      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <UserPlus className="size-4" />
            </div>
            <div>
              <DialogTitle className="font-heading text-lg">
                Onboard Teacher
              </DialogTitle>
              <DialogDescription className="text-xs">
                Register a new teacher account with credentials, qualifications,
                and assigned permissions.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-6 pt-2"
        >
          {/* Section 1: Personal & Account */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-border/60 pb-1.5 text-xs font-semibold text-foreground">
              <User className="size-3.5 text-primary" />
              <span>Personal & Account Credentials</span>
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

              {/* Email */}
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
                        Email Address{" "}
                        <span className="text-destructive">*</span>
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

              {/* Phone */}
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
                          field.handleChange(
                            val as "MALE" | "FEMALE" | "OTHER",
                          );
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

              {/* Temporary Password */}
              <div className="sm:col-span-2">
                <form.Field name="password">
                  {(field) => {
                    const errorMsg = getErrorMessage(
                      field.state.meta.errors[0],
                    );
                    return (
                      <Field
                        data-invalid={
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid
                        }
                      >
                        <FieldLabel className="text-xs font-medium">
                          Initial Temporary Password{" "}
                          <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input
                          name={field.name}
                          type="password"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Minimum 6 characters (e.g. Teacher@123)"
                          className="h-9 text-xs"
                        />
                        {errorMsg && <FieldError>{errorMsg}</FieldError>}
                      </Field>
                    );
                  }}
                </form.Field>
              </div>
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
                        placeholder="e.g. Senior Teacher / Lecturer"
                        className="h-9 text-xs"
                      />
                      {errorMsg && <FieldError>{errorMsg}</FieldError>}
                    </Field>
                  );
                }}
              </form.Field>

              {/* Joining Date */}
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
                        Official Joining Date{" "}
                        <span className="text-destructive">*</span>
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

              {/* Highest Qualification */}
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
                        placeholder="e.g. M.Sc in Physics, BUET"
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
                        Specialization Subject{" "}
                        <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Input
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="e.g. Quantum Mechanics & Optics"
                        className="h-9 text-xs"
                      />
                      {errorMsg && <FieldError>{errorMsg}</FieldError>}
                    </Field>
                  );
                }}
              </form.Field>
            </div>
          </div>

          {/* Section 3: Delegated Administrative Permissions */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-border/60 pb-1.5 text-xs font-semibold text-foreground">
              <KeyRound className="size-3.5 text-primary" />
              <span>Permissions & Access Rights</span>
            </div>

            <form.Field name="permissions">
              {(field) => {
                const currentPermissions = field.state.value;

                const togglePermission = (permId: TeacherPermission) => {
                  const next = currentPermissions.includes(permId)
                    ? currentPermissions.filter((p) => p !== permId)
                    : [...currentPermissions, permId];
                  field.handleChange(next);
                };

                return (
                  <div className="space-y-2">
                    {AVAILABLE_PERMISSIONS.map((perm) => {
                      const isChecked = currentPermissions.includes(perm.id);

                      return (
                        <label
                          key={perm.id}
                          className={`flex items-start gap-2.5 rounded-lg border p-2.5 cursor-pointer transition-all ${
                            isChecked
                              ? "border-primary/60 bg-primary/5"
                              : "border-border/70 hover:bg-muted/30"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => togglePermission(perm.id)}
                            className="size-4 mt-0.5 rounded text-primary focus:ring-primary accent-primary cursor-pointer"
                          />
                          <div className="space-y-0.5">
                            <span className="text-xs font-semibold text-foreground flex items-center gap-1">
                              {perm.label}
                              {isChecked && (
                                <ShieldCheck className="size-3 text-primary shrink-0" />
                              )}
                            </span>
                            <p className="text-[11px] text-muted-foreground">
                              {perm.desc}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                );
              }}
            </form.Field>
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(false)}
              disabled={registerMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? (
                <>
                  <Loader2 className="size-3.5 animate-spin mr-1.5" />
                  <span>Registering...</span>
                </>
              ) : (
                "Onboard Teacher"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
