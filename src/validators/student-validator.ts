import { z } from "zod";

/**
 * Validates Bangladeshi mobile phone numbers:
 * - 11 digits starting with 01
 * - Operator prefixes: 3, 4, 5, 6, 7, 8, 9 (GP, Banglalink, Teletalk, Robi, Airtel)
 * - Optional +88 or 88 country code prefix
 * - Optional spaces or hyphens between digit blocks
 */
const BD_PHONE_REGEX = /^(?:\+?88)?01[3-9](?:[ -]?\d){8}$/;

export const registerStudentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters.")
    .max(70, "Full name cannot exceed 70 characters."),
  email: z
    .string()
    .trim()
    .min(1, "Email address is required.")
    .email("Please enter a valid email address (e.g. student@example.com)."),
  password: z
    .string()
    .min(6, "Temporary password must be at least 6 characters.")
    .max(50, "Password cannot exceed 50 characters."),
  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required.")
    .regex(
      BD_PHONE_REGEX,
      "Must be a valid 11-digit Bangladeshi number (e.g. 01712345678).",
    ),
  guardianName: z
    .string()
    .trim()
    .min(2, "Guardian name must be at least 2 characters.")
    .max(70, "Guardian name cannot exceed 70 characters."),
  guardianPhone: z
    .string()
    .trim()
    .min(1, "Guardian phone number is required.")
    .regex(
      BD_PHONE_REGEX,
      "Must be a valid 11-digit Bangladeshi number (e.g. 01812345678).",
    ),
  institutionName: z
    .string()
    .trim()
    .min(2, "School or college name is required.")
    .max(100, "Institution name cannot exceed 100 characters."),
  classLevel: z
    .string()
    .trim()
    .min(1, "Class or academic level is required (e.g. HSC-2025, Class 10).")
    .max(50, "Class level cannot exceed 50 characters."),
  rollNumber: z
    .string()
    .trim()
    .min(1, "Roll or student ID number is required.")
    .max(30, "Roll number cannot exceed 30 characters."),
  gender: z.enum(["MALE", "FEMALE", "OTHER"], {
    message: "Please select a valid gender.",
  }),
});

export const updateStudentStatusSchema = z.object({
  status: z.enum(["ACTIVE", "PENDING_ACTIVATION", "INACTIVE", "BLOCKED"], {
    message: "Please select a valid status.",
  }),
});

export type RegisterStudentInput = z.infer<typeof registerStudentSchema>;
export type UpdateStudentStatusInput = z.infer<
  typeof updateStudentStatusSchema
>;
