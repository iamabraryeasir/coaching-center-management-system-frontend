import { z } from "zod";
import type { DayOfWeek } from "@/types";

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

export const DAY_OF_WEEK_OPTIONS: { value: DayOfWeek; label: string }[] = [
  { value: "SATURDAY", label: "Saturday" },
  { value: "SUNDAY", label: "Sunday" },
  { value: "MONDAY", label: "Monday" },
  { value: "TUESDAY", label: "Tuesday" },
  { value: "WEDNESDAY", label: "Wednesday" },
  { value: "THURSDAY", label: "Thursday" },
  { value: "FRIDAY", label: "Friday" },
];

export const createRoutineSchema = z
  .object({
    batchId: z.string().min(1, "Batch is required"),
    dayOfWeek: z.enum(
      [
        "SATURDAY",
        "SUNDAY",
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
      ],
      { error: "Day of week is required" },
    ),
    startTime: z
      .string()
      .min(1, "Start time is required")
      .regex(timeRegex, "Must be in 24h HH:mm format (e.g. 09:30 or 14:00)"),
    endTime: z
      .string()
      .min(1, "End time is required")
      .regex(timeRegex, "Must be in 24h HH:mm format (e.g. 11:00 or 15:30)"),
    subject: z.string().trim().max(100, "Subject cannot exceed 100 characters"),
    room: z.string().trim().max(50, "Room cannot exceed 50 characters"),
    teacherId: z.string(),
  })
  .refine(
    (data) => {
      if (data.startTime && data.endTime) {
        return data.startTime < data.endTime;
      }
      return true;
    },
    {
      message: "Start time must be strictly earlier than end time",
      path: ["startTime"],
    },
  );

export type CreateRoutineFormValues = z.infer<typeof createRoutineSchema>;

export const updateRoutineSchema = z
  .object({
    dayOfWeek: z
      .enum([
        "SATURDAY",
        "SUNDAY",
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
      ])
      .optional(),
    startTime: z
      .string()
      .regex(timeRegex, "Must be in 24h HH:mm format (e.g. 09:30 or 14:00)")
      .optional(),
    endTime: z
      .string()
      .regex(timeRegex, "Must be in 24h HH:mm format (e.g. 11:00 or 15:30)")
      .optional(),
    subject: z
      .string()
      .trim()
      .max(100, "Subject cannot exceed 100 characters")
      .optional()
      .or(z.literal("")),
    room: z
      .string()
      .trim()
      .max(50, "Room cannot exceed 50 characters")
      .optional()
      .or(z.literal("")),
    teacherId: z.string().nullable().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      if (data.startTime && data.endTime) {
        return data.startTime < data.endTime;
      }
      return true;
    },
    {
      message: "Start time must be strictly earlier than end time",
      path: ["startTime"],
    },
  );

export type UpdateRoutineFormValues = z.infer<typeof updateRoutineSchema>;
