import { z } from "zod";

export const createExamSchema = z.object({
  batchId: z.string().min(1, "Please select an academic batch."),
  title: z
    .string()
    .trim()
    .min(3, "Exam title must be at least 3 characters.")
    .max(120, "Exam title cannot exceed 120 characters."),
  description: z.string(),
  totalMarks: z
    .number({ message: "Please enter total marks." })
    .min(1, "Total marks must be at least 1.")
    .max(1000, "Total marks cannot exceed 1000."),
  passMarks: z
    .number({ message: "Please enter pass marks." })
    .min(0, "Pass marks cannot be negative."),
  examDate: z.string().min(1, "Please select an exam date."),
  status: z.enum(["UPCOMING", "ONGOING", "COMPLETED", "CANCELLED"], {
    message: "Please select a valid exam status.",
  }),
});

export const editExamFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Exam title must be at least 3 characters.")
    .max(120, "Exam title cannot exceed 120 characters."),
  description: z.string(),
  totalMarks: z
    .number({ message: "Please enter total marks." })
    .min(1, "Total marks must be at least 1.")
    .max(1000, "Total marks cannot exceed 1000."),
  passMarks: z
    .number({ message: "Please enter pass marks." })
    .min(0, "Pass marks cannot be negative."),
  examDate: z.string().min(1, "Please select an exam date."),
  status: z.enum(["UPCOMING", "ONGOING", "COMPLETED", "CANCELLED"], {
    message: "Please select a valid exam status.",
  }),
});

export const updateExamSchema = z.object({
  batchId: z.string().optional(),
  title: z
    .string()
    .trim()
    .min(3, "Exam title must be at least 3 characters.")
    .max(120, "Exam title cannot exceed 120 characters.")
    .optional(),
  description: z.string().optional(),
  totalMarks: z
    .number({ message: "Please enter total marks." })
    .min(1, "Total marks must be at least 1.")
    .max(1000, "Total marks cannot exceed 1000.")
    .optional(),
  passMarks: z
    .number({ message: "Please enter pass marks." })
    .min(0, "Pass marks cannot be negative.")
    .optional(),
  examDate: z.string().optional(),
  status: z
    .enum(["UPCOMING", "ONGOING", "COMPLETED", "CANCELLED"], {
      message: "Please select a valid exam status.",
    })
    .optional(),
});

export const singleMarkSchema = z.object({
  studentId: z.string().min(1, "Student ID is required."),
  marksObtained: z
    .number({ message: "Marks must be a valid number." })
    .min(0, "Marks cannot be negative."),
  remarks: z.string().trim().max(255).optional().or(z.literal("")),
});

export const bulkMarksSchema = z.object({
  records: z.array(singleMarkSchema),
});

export type CreateExamInput = z.infer<typeof createExamSchema>;
export type EditExamFormInput = z.infer<typeof editExamFormSchema>;
export type UpdateExamInput = z.infer<typeof updateExamSchema>;
export type SingleMarkInput = z.infer<typeof singleMarkSchema>;
export type BulkMarksInput = z.infer<typeof bulkMarksSchema>;
