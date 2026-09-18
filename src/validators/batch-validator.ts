import { z } from "zod";

export const createBatchSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Batch name must be at least 2 characters.")
    .max(60, "Batch name cannot exceed 60 characters."),
  fee: z
    .string()
    .trim()
    .min(1, "Please enter a course fee.")
    .refine((val) => !Number.isNaN(Number(val)) && Number(val) >= 0, {
      message: "Tuition fee must be a valid non-negative number.",
    }),
  status: z.enum(["UPCOMING", "ONGOING", "COMPLETED", "CANCELLED"], {
    message: "Please select a valid operational status.",
  }),
});

export const updateBatchSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Batch name must be at least 2 characters.")
    .max(60, "Batch name cannot exceed 60 characters.")
    .optional(),
  fee: z.coerce
    .number({ message: "Please enter a valid tuition fee." })
    .min(0, "Tuition fee cannot be negative.")
    .max(100000, "Tuition fee exceeds maximum limit.")
    .optional(),
  status: z
    .enum(["UPCOMING", "ONGOING", "COMPLETED", "CANCELLED"], {
      message: "Please select a valid operational status.",
    })
    .optional(),
});

export const directEnrollSchema = z.object({
  studentId: z.string().min(1, "Please select an active student to enroll."),
});

export type CreateBatchInput = z.infer<typeof createBatchSchema>;
export type UpdateBatchInput = z.infer<typeof updateBatchSchema>;
export type DirectEnrollInput = z.infer<typeof directEnrollSchema>;
