"use client";

import { useForm } from "@tanstack/react-form";
import { Layers, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
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
import { useCreateBatchMutation, useUpdateBatchMutation } from "@/hooks";
import type { Batch, BatchStatus, CreateBatchDto } from "@/types";
import { createBatchSchema } from "@/validators";

interface CreateBatchDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactElement;
  batchToEdit?: Batch | null;
}

const statusLabels: Record<BatchStatus, string> = {
  ONGOING: "Ongoing",
  UPCOMING: "Upcoming",
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

export function CreateBatchDialog({
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  trigger,
  batchToEdit,
}: CreateBatchDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = setControlledOpen || setInternalOpen;

  const isEditing = !!batchToEdit;
  const createMutation = useCreateBatchMutation();
  const updateMutation = useUpdateBatchMutation();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const form = useForm({
    defaultValues: {
      name: batchToEdit?.name || "",
      fee: batchToEdit?.fee !== undefined ? String(batchToEdit.fee) : "",
      status: (batchToEdit?.status || "UPCOMING") as BatchStatus,
    },
    validators: {
      onSubmit: createBatchSchema,
    },
    onSubmit: async ({ value }) => {
      const payload: CreateBatchDto = {
        name: value.name.trim(),
        fee: Number(value.fee),
        status: value.status,
      };

      if (isEditing && batchToEdit) {
        await updateMutation.mutateAsync(
          {
            batchId: batchToEdit.id,
            payload,
          },
          {
            onSuccess: () => {
              setIsOpen(false);
            },
          },
        );
      } else {
        await createMutation.mutateAsync(payload, {
          onSuccess: () => {
            form.reset();
            setIsOpen(false);
          },
        });
      }
    },
  });

  // Sync form values when batchToEdit changes or dialog opens
  useEffect(() => {
    if (isOpen) {
      if (batchToEdit) {
        form.setFieldValue("name", batchToEdit.name);
        form.setFieldValue("fee", String(batchToEdit.fee));
        form.setFieldValue("status", batchToEdit.status);
      } else {
        form.reset();
      }
    }
  }, [isOpen, batchToEdit, form]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger && <DialogTrigger render={trigger} />}

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Layers className="size-4" />
            </div>
            <div>
              <DialogTitle className="font-heading text-lg">
                {isEditing ? "Edit Academic Batch" : "Create New Batch"}
              </DialogTitle>
              <DialogDescription className="text-xs">
                {isEditing
                  ? "Update batch parameters, course fees, and status."
                  : "Define a new academic batch, enrollment pricing, and operational status."}
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
          {/* Batch Name */}
          <form.Field name="name">
            {(field) => {
              const errorMessage = getErrorMessage(field.state.meta.errors[0]);
              return (
                <Field
                  data-invalid={
                    field.state.meta.isTouched && !field.state.meta.isValid
                  }
                >
                  <FieldLabel className="text-xs font-semibold">
                    Batch Name <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="e.g. HSC 2026 Physics Crash Course"
                    className="h-9 text-sm"
                  />
                  {errorMessage && <FieldError>{errorMessage}</FieldError>}
                </Field>
              );
            }}
          </form.Field>

          {/* Course Fee */}
          <form.Field name="fee">
            {(field) => {
              const errorMessage = getErrorMessage(field.state.meta.errors[0]);
              return (
                <Field
                  data-invalid={
                    field.state.meta.isTouched && !field.state.meta.isValid
                  }
                >
                  <FieldLabel className="text-xs font-semibold">
                    Course Fee (BDT / ৳){" "}
                    <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    name={field.name}
                    type="number"
                    min="0"
                    step="50"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="e.g. 4500"
                    className="h-9 text-sm"
                  />
                  {errorMessage && <FieldError>{errorMessage}</FieldError>}
                </Field>
              );
            }}
          </form.Field>

          {/* Status */}
          <form.Field name="status">
            {(field) => {
              const errorMessage = getErrorMessage(field.state.meta.errors[0]);
              return (
                <Field
                  data-invalid={
                    field.state.meta.isTouched && !field.state.meta.isValid
                  }
                >
                  <FieldLabel className="text-xs font-semibold">
                    Operational Status{" "}
                    <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Select
                    value={field.state.value}
                    onValueChange={(val) => {
                      if (val) field.handleChange(val as BatchStatus);
                    }}
                  >
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="Select batch status">
                        {(val: string | null) =>
                          val
                            ? statusLabels[val as BatchStatus] || val
                            : "Select status"
                        }
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UPCOMING">Upcoming</SelectItem>
                      <SelectItem value="ONGOING">Ongoing</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      {isEditing && (
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
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
                  {isEditing ? "Saving..." : "Creating..."}
                </>
              ) : isEditing ? (
                "Save Changes"
              ) : (
                "Create Batch"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
