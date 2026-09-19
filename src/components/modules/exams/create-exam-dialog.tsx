"use client";

import { useForm } from "@tanstack/react-form";
import { GraduationCap, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { DatePicker } from "@/components/forms/date-picker";
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
import { useBatches, useCreateExamMutation } from "@/hooks";
import type { CreateExamDto, ExamStatus } from "@/types";
import { createExamSchema } from "@/validators";

interface CreateExamDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactElement;
  defaultBatchId?: string;
}

const statusLabels: Record<ExamStatus, string> = {
  UPCOMING: "Upcoming (Scheduled)",
  ONGOING: "Ongoing (In Progress)",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
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

function getTodayIsoString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function CreateExamDialog({
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  trigger,
  defaultBatchId,
}: CreateExamDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = setControlledOpen || setInternalOpen;

  const { data: batchesData, isLoading: isLoadingBatches } = useBatches({
    limit: 100,
  });
  const batches = batchesData?.data || [];

  const createMutation = useCreateExamMutation();
  const isSubmitting = createMutation.isPending;

  const form = useForm({
    defaultValues: {
      batchId: defaultBatchId || "",
      title: "",
      description: "",
      totalMarks: 100,
      passMarks: 40,
      examDate: getTodayIsoString(),
      status: "UPCOMING" as ExamStatus,
    },
    validators: {
      onSubmit: createExamSchema,
    },
    onSubmit: async ({ value }) => {
      if (Number(value.passMarks) > Number(value.totalMarks)) {
        toast.error("Pass marks cannot exceed total marks.");
        return;
      }

      const payload: CreateExamDto = {
        batchId: value.batchId,
        title: value.title.trim(),
        description: value.description?.trim() || undefined,
        totalMarks: Number(value.totalMarks),
        passMarks: Number(value.passMarks),
        examDate: value.examDate,
        status: value.status,
      };

      await createMutation.mutateAsync(payload, {
        onSuccess: () => {
          form.reset();
          setIsOpen(false);
        },
      });
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (defaultBatchId) {
        form.setFieldValue("batchId", defaultBatchId);
      }
    } else {
      form.reset();
    }
  }, [isOpen, defaultBatchId, form]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger && <DialogTrigger render={trigger} />}

      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <GraduationCap className="size-5" />
            </div>
            <div>
              <DialogTitle className="font-heading text-lg font-bold">
                Schedule New Exam
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Define exam parameters, batch assignment, grading scale, and
                calendar date.
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
          className="space-y-4 pt-2"
        >
          {/* Batch Selector */}
          <form.Field name="batchId">
            {(field) => {
              const errorMessage = getErrorMessage(field.state.meta.errors[0]);
              return (
                <Field
                  data-invalid={
                    field.state.meta.isTouched && !field.state.meta.isValid
                  }
                >
                  <FieldLabel className="text-xs font-semibold">
                    Target Academic Batch{" "}
                    <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Select
                    value={field.state.value}
                    onValueChange={(val) => {
                      if (val) field.handleChange(val);
                    }}
                    disabled={isLoadingBatches}
                  >
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Select batch">
                        {(val: string | null) => {
                          if (!val) return "Select batch";
                          const b = batches.find((item) => item.id === val);
                          return b ? b.name : val;
                        }}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {batches.map((batch) => (
                        <SelectItem key={batch.id} value={batch.id}>
                          {batch.name} ({batch.status})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errorMessage && <FieldError>{errorMessage}</FieldError>}
                </Field>
              );
            }}
          </form.Field>

          {/* Exam Title */}
          <form.Field name="title">
            {(field) => {
              const errorMessage = getErrorMessage(field.state.meta.errors[0]);
              return (
                <Field
                  data-invalid={
                    field.state.meta.isTouched && !field.state.meta.isValid
                  }
                >
                  <FieldLabel className="text-xs font-semibold">
                    Exam Title <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="e.g. Weekly Assessment: Algebra & Polynomials"
                    className="h-9 text-xs"
                  />
                  {errorMessage && <FieldError>{errorMessage}</FieldError>}
                </Field>
              );
            }}
          </form.Field>

          {/* Marks Configuration (Total Marks & Pass Marks) */}
          <div className="grid grid-cols-2 gap-3">
            <form.Field name="totalMarks">
              {(field) => {
                const errorMessage = getErrorMessage(
                  field.state.meta.errors[0],
                );
                return (
                  <Field
                    data-invalid={
                      field.state.meta.isTouched && !field.state.meta.isValid
                    }
                  >
                    <FieldLabel className="text-xs font-semibold">
                      Total Marks <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      name={field.name}
                      type="number"
                      min="1"
                      max="1000"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        field.handleChange(Number(e.target.value))
                      }
                      placeholder="100"
                      className="h-9 text-xs"
                    />
                    {errorMessage && <FieldError>{errorMessage}</FieldError>}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="passMarks">
              {(field) => {
                const errorMessage = getErrorMessage(
                  field.state.meta.errors[0],
                );
                return (
                  <Field
                    data-invalid={
                      field.state.meta.isTouched && !field.state.meta.isValid
                    }
                  >
                    <FieldLabel className="text-xs font-semibold">
                      Pass Marks <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      name={field.name}
                      type="number"
                      min="0"
                      max="1000"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        field.handleChange(Number(e.target.value))
                      }
                      placeholder="40"
                      className="h-9 text-xs"
                    />
                    {errorMessage && <FieldError>{errorMessage}</FieldError>}
                  </Field>
                );
              }}
            </form.Field>
          </div>

          {/* Date & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <form.Field name="examDate">
              {(field) => {
                const errorMessage = getErrorMessage(
                  field.state.meta.errors[0],
                );
                return (
                  <Field
                    data-invalid={
                      field.state.meta.isTouched && !field.state.meta.isValid
                    }
                  >
                    <FieldLabel className="text-xs font-semibold">
                      Exam Date <span className="text-destructive">*</span>
                    </FieldLabel>
                    <DatePicker
                      value={field.state.value}
                      onChange={(val) => field.handleChange(val)}
                      className="w-full h-9 text-xs"
                    />
                    {errorMessage && <FieldError>{errorMessage}</FieldError>}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="status">
              {(field) => {
                const errorMessage = getErrorMessage(
                  field.state.meta.errors[0],
                );
                return (
                  <Field
                    data-invalid={
                      field.state.meta.isTouched && !field.state.meta.isValid
                    }
                  >
                    <FieldLabel className="text-xs font-semibold">
                      Status <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Select
                      value={field.state.value}
                      onValueChange={(val) => {
                        if (val) field.handleChange(val as ExamStatus);
                      }}
                    >
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Select status">
                          {(val: string | null) =>
                            val
                              ? statusLabels[val as ExamStatus] || val
                              : "Select status"
                          }
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UPCOMING">
                          Upcoming (Scheduled)
                        </SelectItem>
                        <SelectItem value="ONGOING">
                          Ongoing (Active)
                        </SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    {errorMessage && <FieldError>{errorMessage}</FieldError>}
                  </Field>
                );
              }}
            </form.Field>
          </div>

          {/* Description */}
          <form.Field name="description">
            {(field) => {
              const errorMessage = getErrorMessage(field.state.meta.errors[0]);
              return (
                <Field
                  data-invalid={
                    field.state.meta.isTouched && !field.state.meta.isValid
                  }
                >
                  <FieldLabel className="text-xs font-semibold">
                    Syllabus / Topics Covered (Optional)
                  </FieldLabel>
                  <Input
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Chapters 3 & 4 covering polynomials and quadratic equations"
                    className="h-9 text-xs"
                  />
                  {errorMessage && <FieldError>{errorMessage}</FieldError>}
                </Field>
              );
            }}
          </form.Field>

          <DialogFooter className="pt-3 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin mr-1.5" />
                  Scheduling...
                </>
              ) : (
                "Schedule Exam"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
