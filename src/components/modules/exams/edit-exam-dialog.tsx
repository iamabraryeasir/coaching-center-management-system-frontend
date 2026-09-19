"use client";

import { useForm } from "@tanstack/react-form";
import { Edit3, Loader2 } from "lucide-react";
import { useEffect } from "react";
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
import { useUpdateExamMutation } from "@/hooks";
import type { Exam, ExamStatus, UpdateExamDto } from "@/types";
import { editExamFormSchema } from "@/validators";

interface EditExamDialogProps {
  exam: Exam | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export function EditExamDialog({
  exam,
  open,
  onOpenChange,
}: EditExamDialogProps) {
  const updateMutation = useUpdateExamMutation();
  const isSubmitting = updateMutation.isPending;

  const form = useForm({
    defaultValues: {
      title: exam?.title || "",
      description: exam?.description || "",
      totalMarks: exam?.totalMarks || 100,
      passMarks: exam?.passMarks || 40,
      examDate: exam?.examDate || "",
      status: (exam?.status || "UPCOMING") as ExamStatus,
    },
    validators: {
      onSubmit: editExamFormSchema,
    },
    onSubmit: async ({ value }) => {
      if (!exam) return;

      if (Number(value.passMarks) > Number(value.totalMarks)) {
        toast.error("Pass marks cannot exceed total marks.");
        return;
      }

      const payload: UpdateExamDto = {
        title: value.title.trim(),
        description: value.description?.trim() || undefined,
        totalMarks: Number(value.totalMarks),
        passMarks: Number(value.passMarks),
        examDate: value.examDate,
        status: value.status,
      };

      await updateMutation.mutateAsync(
        {
          examId: exam.id,
          payload,
        },
        {
          onSuccess: () => {
            onOpenChange(false);
          },
        },
      );
    },
  });

  useEffect(() => {
    if (open && exam) {
      form.setFieldValue("title", exam.title);
      form.setFieldValue("description", exam.description || "");
      form.setFieldValue("totalMarks", exam.totalMarks);
      form.setFieldValue("passMarks", exam.passMarks);
      form.setFieldValue("examDate", exam.examDate);
      form.setFieldValue("status", exam.status);
    }
  }, [open, exam, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Edit3 className="size-4" />
            </div>
            <div>
              <DialogTitle className="font-heading text-lg font-bold">
                Edit Exam Details
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Update exam schedule, grading threshold, or lifecycle status.
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
                    placeholder="e.g. Weekly Assessment: Advanced Algebra"
                    className="h-9 text-xs"
                  />
                  {errorMessage && <FieldError>{errorMessage}</FieldError>}
                </Field>
              );
            }}
          </form.Field>

          {/* Marks Configuration */}
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
                    Syllabus / Topics Covered
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
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin mr-1.5" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
