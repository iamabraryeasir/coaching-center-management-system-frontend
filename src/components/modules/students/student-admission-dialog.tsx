"use client";

import { useForm } from "@tanstack/react-form";
import { Loader2, Plus } from "lucide-react";
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
import { useRegisterStudentMutation } from "@/hooks";
import type { RegisterStudentDto } from "@/types";
import { registerStudentSchema } from "@/validators";

interface StudentAdmissionDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactElement;
}

const genderLabels: Record<string, string> = {
  MALE: "Male",
  FEMALE: "Female",
  OTHER: "Other",
};

/**
 * Robust extractor for TanStack Form validation errors,
 * handling both plain strings and { message: string } objects.
 */
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

export function StudentAdmissionDialog({
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  trigger,
}: StudentAdmissionDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = setControlledOpen || setInternalOpen;

  const registerMutation = useRegisterStudentMutation();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      guardianName: "",
      guardianPhone: "",
      institutionName: "",
      classLevel: "",
      rollNumber: "",
      gender: "MALE" as "MALE" | "FEMALE" | "OTHER",
    },
    validators: {
      onSubmit: registerStudentSchema,
    },
    onSubmit: async ({ value }) => {
      const payload: RegisterStudentDto = {
        name: value.name.trim(),
        email: value.email.trim().toLowerCase(),
        password: value.password,
        phone: value.phone.trim().replace(/[\s-]/g, ""),
        guardianName: value.guardianName.trim(),
        guardianPhone: value.guardianPhone.trim().replace(/[\s-]/g, ""),
        institutionName: value.institutionName.trim(),
        classLevel: value.classLevel.trim(),
        rollNumber: value.rollNumber.trim(),
        gender: value.gender,
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
              <Plus className="size-4" />
            </div>
            <div>
              <DialogTitle className="font-heading text-lg">
                Direct Student Admission
              </DialogTitle>
              <DialogDescription className="text-xs">
                Enter student, academic, and guardian details to provision an
                active account.
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
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border/60 pb-1.5">
              1. Student Identity & Login
            </h4>

            <div className="grid gap-3 sm:grid-cols-2">
              <form.Field name="name">
                {(field) => {
                  const errorMsg = field.state.meta.errors?.[0]
                    ? getErrorMessage(field.state.meta.errors[0])
                    : null;
                  return (
                    <Field data-invalid={Boolean(errorMsg)}>
                      <FieldLabel
                        htmlFor={field.name}
                        className="text-xs font-medium"
                      >
                        Full Name *
                      </FieldLabel>
                      <Input
                        id={field.name}
                        placeholder="e.g. Shakib Al Hasan"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={Boolean(errorMsg)}
                        className="h-9 text-sm"
                      />
                      {errorMsg && (
                        <FieldError className="text-[11px] text-destructive">
                          {errorMsg}
                        </FieldError>
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="email">
                {(field) => {
                  const errorMsg = field.state.meta.errors?.[0]
                    ? getErrorMessage(field.state.meta.errors[0])
                    : null;
                  return (
                    <Field data-invalid={Boolean(errorMsg)}>
                      <FieldLabel
                        htmlFor={field.name}
                        className="text-xs font-medium"
                      >
                        Email Address *
                      </FieldLabel>
                      <Input
                        id={field.name}
                        type="email"
                        placeholder="student@example.com"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={Boolean(errorMsg)}
                        className="h-9 text-sm"
                      />
                      {errorMsg && (
                        <FieldError className="text-[11px] text-destructive">
                          {errorMsg}
                        </FieldError>
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="phone">
                {(field) => {
                  const errorMsg = field.state.meta.errors?.[0]
                    ? getErrorMessage(field.state.meta.errors[0])
                    : null;
                  return (
                    <Field data-invalid={Boolean(errorMsg)}>
                      <FieldLabel
                        htmlFor={field.name}
                        className="text-xs font-medium"
                      >
                        Phone Number (11-digit BD) *
                      </FieldLabel>
                      <Input
                        id={field.name}
                        type="tel"
                        placeholder="017XXXXXXXX"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={Boolean(errorMsg)}
                        className="h-9 text-sm font-mono"
                      />
                      {errorMsg && (
                        <FieldError className="text-[11px] text-destructive">
                          {errorMsg}
                        </FieldError>
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="password">
                {(field) => {
                  const errorMsg = field.state.meta.errors?.[0]
                    ? getErrorMessage(field.state.meta.errors[0])
                    : null;
                  return (
                    <Field data-invalid={Boolean(errorMsg)}>
                      <FieldLabel
                        htmlFor={field.name}
                        className="text-xs font-medium"
                      >
                        Temporary Password *
                      </FieldLabel>
                      <Input
                        id={field.name}
                        type="password"
                        placeholder="Min 6 characters"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={Boolean(errorMsg)}
                        className="h-9 text-sm"
                      />
                      {errorMsg && (
                        <FieldError className="text-[11px] text-destructive">
                          {errorMsg}
                        </FieldError>
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="gender">
                {(field) => {
                  const errorMsg = field.state.meta.errors?.[0]
                    ? getErrorMessage(field.state.meta.errors[0])
                    : null;
                  return (
                    <Field data-invalid={Boolean(errorMsg)}>
                      <FieldLabel
                        htmlFor={field.name}
                        className="text-xs font-medium"
                      >
                        Gender *
                      </FieldLabel>
                      <Select
                        value={field.state.value}
                        onValueChange={(val) => {
                          if (val) {
                            field.handleChange(
                              val as "MALE" | "FEMALE" | "OTHER",
                            );
                          }
                        }}
                      >
                        <SelectTrigger className="h-9 w-full text-sm">
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
                      {errorMsg && (
                        <FieldError className="text-[11px] text-destructive">
                          {errorMsg}
                        </FieldError>
                      )}
                    </Field>
                  );
                }}
              </form.Field>
            </div>
          </div>

          {/* Section 2: Academic Records */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border/60 pb-1.5">
              2. Academic Records
            </h4>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="sm:col-span-1">
                <form.Field name="institutionName">
                  {(field) => {
                    const errorMsg = field.state.meta.errors?.[0]
                      ? getErrorMessage(field.state.meta.errors[0])
                      : null;
                    return (
                      <Field data-invalid={Boolean(errorMsg)}>
                        <FieldLabel
                          htmlFor={field.name}
                          className="text-xs font-medium"
                        >
                          School / College *
                        </FieldLabel>
                        <Input
                          id={field.name}
                          placeholder="e.g. Dhaka College"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={Boolean(errorMsg)}
                          className="h-9 text-sm"
                        />
                        {errorMsg && (
                          <FieldError className="text-[11px] text-destructive">
                            {errorMsg}
                          </FieldError>
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </div>

              <div>
                <form.Field name="classLevel">
                  {(field) => {
                    const errorMsg = field.state.meta.errors?.[0]
                      ? getErrorMessage(field.state.meta.errors[0])
                      : null;
                    return (
                      <Field data-invalid={Boolean(errorMsg)}>
                        <FieldLabel
                          htmlFor={field.name}
                          className="text-xs font-medium"
                        >
                          Class / Level *
                        </FieldLabel>
                        <Input
                          id={field.name}
                          placeholder="e.g. HSC-2025"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={Boolean(errorMsg)}
                          className="h-9 text-sm"
                        />
                        {errorMsg && (
                          <FieldError className="text-[11px] text-destructive">
                            {errorMsg}
                          </FieldError>
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </div>

              <div>
                <form.Field name="rollNumber">
                  {(field) => {
                    const errorMsg = field.state.meta.errors?.[0]
                      ? getErrorMessage(field.state.meta.errors[0])
                      : null;
                    return (
                      <Field data-invalid={Boolean(errorMsg)}>
                        <FieldLabel
                          htmlFor={field.name}
                          className="text-xs font-medium"
                        >
                          Roll / Student ID *
                        </FieldLabel>
                        <Input
                          id={field.name}
                          placeholder="e.g. 1045"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={Boolean(errorMsg)}
                          className="h-9 text-sm"
                        />
                        {errorMsg && (
                          <FieldError className="text-[11px] text-destructive">
                            {errorMsg}
                          </FieldError>
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </div>
            </div>
          </div>

          {/* Section 3: Guardian Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border/60 pb-1.5">
              3. Guardian Contacts
            </h4>

            <div className="grid gap-3 sm:grid-cols-2">
              <form.Field name="guardianName">
                {(field) => {
                  const errorMsg = field.state.meta.errors?.[0]
                    ? getErrorMessage(field.state.meta.errors[0])
                    : null;
                  return (
                    <Field data-invalid={Boolean(errorMsg)}>
                      <FieldLabel
                        htmlFor={field.name}
                        className="text-xs font-medium"
                      >
                        Guardian Name *
                      </FieldLabel>
                      <Input
                        id={field.name}
                        placeholder="e.g. Father / Mother Name"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={Boolean(errorMsg)}
                        className="h-9 text-sm"
                      />
                      {errorMsg && (
                        <FieldError className="text-[11px] text-destructive">
                          {errorMsg}
                        </FieldError>
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="guardianPhone">
                {(field) => {
                  const errorMsg = field.state.meta.errors?.[0]
                    ? getErrorMessage(field.state.meta.errors[0])
                    : null;
                  return (
                    <Field data-invalid={Boolean(errorMsg)}>
                      <FieldLabel
                        htmlFor={field.name}
                        className="text-xs font-medium"
                      >
                        Guardian Phone (11-digit BD) *
                      </FieldLabel>
                      <Input
                        id={field.name}
                        type="tel"
                        placeholder="018XXXXXXXX"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={Boolean(errorMsg)}
                        className="h-9 text-sm font-mono"
                      />
                      {errorMsg && (
                        <FieldError className="text-[11px] text-destructive">
                          {errorMsg}
                        </FieldError>
                      )}
                    </Field>
                  );
                }}
              </form.Field>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={registerMutation.isPending}
              className="gap-1.5"
            >
              {registerMutation.isPending && (
                <Loader2 className="size-3.5 animate-spin" />
              )}
              <span>Complete Admission</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
