"use client";

import { useForm } from "@tanstack/react-form";
import { Clock, Edit2, Loader2, MapPin, Plus } from "lucide-react";
import { useEffect } from "react";
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
import { useCreateRoutineMutation, useUpdateRoutineMutation } from "@/hooks";
import type { Batch, DayOfWeek, RoutineSlot, User } from "@/types";
import { createRoutineSchema, DAY_OF_WEEK_OPTIONS } from "@/validators";

interface RoutineSlotDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slotToEdit?: RoutineSlot | null;
  defaultBatchId?: string;
  defaultDayOfWeek?: DayOfWeek;
  batches: Batch[];
  teachers: User[];
}

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

export function RoutineSlotDialog({
  open,
  onOpenChange,
  slotToEdit,
  defaultBatchId,
  defaultDayOfWeek,
  batches,
  teachers,
}: RoutineSlotDialogProps) {
  const isEditing = Boolean(slotToEdit);

  const createMutation = useCreateRoutineMutation();
  const updateMutation = useUpdateRoutineMutation();

  const isPending = createMutation.isPending || updateMutation.isPending;

  const form = useForm({
    defaultValues: {
      batchId: slotToEdit?.batchId || defaultBatchId || batches[0]?.id || "",
      dayOfWeek:
        slotToEdit?.dayOfWeek || defaultDayOfWeek || ("SATURDAY" as DayOfWeek),
      startTime: slotToEdit?.startTime || "09:00",
      endTime: slotToEdit?.endTime || "10:30",
      subject: slotToEdit?.subject || "",
      room: slotToEdit?.room || "",
      teacherId: slotToEdit?.teacherId || "UNASSIGNED",
    },
    validators: {
      onSubmit: createRoutineSchema,
    },
    onSubmit: async ({ value }) => {
      const payloadTeacherId =
        value.teacherId && value.teacherId !== "UNASSIGNED"
          ? value.teacherId
          : undefined;

      if (isEditing && slotToEdit) {
        await updateMutation.mutateAsync({
          routineId: slotToEdit.id,
          payload: {
            dayOfWeek: value.dayOfWeek,
            startTime: value.startTime,
            endTime: value.endTime,
            subject: value.subject.trim() || undefined,
            room: value.room.trim() || undefined,
            teacherId: payloadTeacherId ?? null,
          },
        });
      } else {
        await createMutation.mutateAsync({
          batchId: value.batchId,
          dayOfWeek: value.dayOfWeek,
          startTime: value.startTime,
          endTime: value.endTime,
          subject: value.subject.trim() || undefined,
          room: value.room.trim() || undefined,
          teacherId: payloadTeacherId,
        });
      }

      onOpenChange(false);
    },
  });

  // Reset form when slotToEdit or default values change
  useEffect(() => {
    if (open) {
      form.reset({
        batchId: slotToEdit?.batchId || defaultBatchId || batches[0]?.id || "",
        dayOfWeek:
          slotToEdit?.dayOfWeek ||
          defaultDayOfWeek ||
          ("SATURDAY" as DayOfWeek),
        startTime: slotToEdit?.startTime || "09:00",
        endTime: slotToEdit?.endTime || "10:30",
        subject: slotToEdit?.subject || "",
        room: slotToEdit?.room || "",
        teacherId: slotToEdit?.teacherId || "UNASSIGNED",
      });
    }
  }, [open, slotToEdit, defaultBatchId, defaultDayOfWeek, batches, form.reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              {isEditing ? (
                <Edit2 className="size-4" />
              ) : (
                <Plus className="size-4" />
              )}
            </div>
            <div>
              <DialogTitle className="font-heading text-lg">
                {isEditing ? "Edit Routine Slot" : "Schedule Class Session"}
              </DialogTitle>
              <DialogDescription className="text-xs">
                {isEditing
                  ? "Update session timing, assigned room, or faculty member."
                  : "Allocate a weekly routine slot with room and faculty conflict checks."}
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
          {/* Batch Selector (Disabled when editing) */}
          <form.Field name="batchId">
            {(field) => (
              <Field className="gap-1.5">
                <FieldLabel className="text-xs font-semibold">
                  Academic Batch *
                </FieldLabel>
                <Select
                  value={field.state.value || null}
                  onValueChange={(val) => val && field.handleChange(val)}
                  disabled={isEditing}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Select target batch...">
                      {(val: string | null) =>
                        batches.find((b) => b.id === val)?.name ||
                        (val ? val : "Select target batch...")
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="max-h-56">
                    {batches.map((batch) => (
                      <SelectItem
                        key={batch.id}
                        value={batch.id}
                        className="text-xs"
                      >
                        {batch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {field.state.meta.errors.length > 0 && (
                  <FieldError>
                    {getErrorMessage(field.state.meta.errors[0])}
                  </FieldError>
                )}
              </Field>
            )}
          </form.Field>

          {/* Day of Week */}
          <form.Field name="dayOfWeek">
            {(field) => (
              <Field className="gap-1.5">
                <FieldLabel className="text-xs font-semibold">
                  Day of Week *
                </FieldLabel>
                <Select
                  value={field.state.value || null}
                  onValueChange={(val) =>
                    val && field.handleChange(val as DayOfWeek)
                  }
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Select day...">
                      {(val: string | null) =>
                        DAY_OF_WEEK_OPTIONS.find((opt) => opt.value === val)
                          ?.label || (val ? val : "Select day...")
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {DAY_OF_WEEK_OPTIONS.map((opt) => (
                      <SelectItem
                        key={opt.value}
                        value={opt.value}
                        className="text-xs"
                      >
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {field.state.meta.errors.length > 0 && (
                  <FieldError>
                    {getErrorMessage(field.state.meta.errors[0])}
                  </FieldError>
                )}
              </Field>
            )}
          </form.Field>

          {/* Time Range: Start Time & End Time */}
          <div className="grid grid-cols-2 gap-3">
            <form.Field name="startTime">
              {(field) => (
                <Field className="gap-1.5">
                  <FieldLabel className="text-xs font-semibold">
                    Start Time (24h) *
                  </FieldLabel>
                  <div className="relative">
                    <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
                    <Input
                      type="time"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className="h-9 pl-8 text-xs font-mono"
                    />
                  </div>
                  {field.state.meta.errors.length > 0 && (
                    <FieldError>
                      {getErrorMessage(field.state.meta.errors[0])}
                    </FieldError>
                  )}
                </Field>
              )}
            </form.Field>

            <form.Field name="endTime">
              {(field) => (
                <Field className="gap-1.5">
                  <FieldLabel className="text-xs font-semibold">
                    End Time (24h) *
                  </FieldLabel>
                  <div className="relative">
                    <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
                    <Input
                      type="time"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className="h-9 pl-8 text-xs font-mono"
                    />
                  </div>
                  {field.state.meta.errors.length > 0 && (
                    <FieldError>
                      {getErrorMessage(field.state.meta.errors[0])}
                    </FieldError>
                  )}
                </Field>
              )}
            </form.Field>
          </div>

          {/* Subject & Room */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <form.Field name="subject">
              {(field) => (
                <Field className="gap-1.5">
                  <FieldLabel className="text-xs font-semibold">
                    Subject / Topic
                  </FieldLabel>
                  <Input
                    placeholder="e.g. Higher Math - Calculus"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className="h-9 text-xs"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <FieldError>
                      {getErrorMessage(field.state.meta.errors[0])}
                    </FieldError>
                  )}
                </Field>
              )}
            </form.Field>

            <form.Field name="room">
              {(field) => (
                <Field className="gap-1.5">
                  <FieldLabel className="text-xs font-semibold">
                    Class Room
                  </FieldLabel>
                  <div className="relative">
                    <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
                    <Input
                      placeholder="e.g. Room 102"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className="h-9 pl-8 text-xs"
                    />
                  </div>
                  {field.state.meta.errors.length > 0 && (
                    <FieldError>
                      {getErrorMessage(field.state.meta.errors[0])}
                    </FieldError>
                  )}
                </Field>
              )}
            </form.Field>
          </div>

          {/* Assigned Faculty Member */}
          <form.Field name="teacherId">
            {(field) => (
              <Field className="gap-1.5">
                <FieldLabel className="text-xs font-semibold">
                  Instructor / Faculty Member
                </FieldLabel>
                <Select
                  value={field.state.value}
                  onValueChange={(val) => val && field.handleChange(val)}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Assign teacher...">
                      {(val: string | null) => {
                        if (!val || val === "UNASSIGNED") {
                          return "None (TBD / Self-Study)";
                        }
                        const teacher = teachers.find((t) => t.id === val);
                        return teacher
                          ? `${teacher.name}${
                              teacher.teacherProfile?.specialization
                                ? ` (${teacher.teacherProfile.specialization})`
                                : ""
                            }`
                          : val
                            ? val
                            : "Assign teacher...";
                      }}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="max-h-56">
                    <SelectItem value="UNASSIGNED" className="text-xs italic">
                      None (TBD / Self-Study)
                    </SelectItem>
                    {teachers.map((t) => (
                      <SelectItem key={t.id} value={t.id} className="text-xs">
                        {t.name}{" "}
                        {t.teacherProfile?.specialization
                          ? `(${t.teacherProfile.specialization})`
                          : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {field.state.meta.errors.length > 0 && (
                  <FieldError>
                    {getErrorMessage(field.state.meta.errors[0])}
                  </FieldError>
                )}
              </Field>
            )}
          </form.Field>

          <DialogFooter className="gap-2.5 sm:gap-2.5 pt-4 border-t border-border/70">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="size-3.5 animate-spin mr-1.5" />
                  <span>Saving Slot...</span>
                </>
              ) : isEditing ? (
                "Save Changes"
              ) : (
                "Schedule Class"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
