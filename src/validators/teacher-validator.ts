import { z } from "zod";

/**
 * Validates Bangladeshi mobile phone numbers:
 * - 11 digits starting with 01
 * - Operator prefixes: 3, 4, 5, 6, 7, 8, 9 (GP, Banglalink, Teletalk, Robi, Airtel)
 * - Optional +88 or 88 country code prefix
 * - Optional spaces or hyphens between digit blocks
 */
const BD_PHONE_REGEX = /^(?:\+?88)?01[3-9](?:[ -]?\d){8}$/;

export const registerTeacherSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters.")
    .max(70, "Full name cannot exceed 70 characters."),
  email: z
    .string()
    .trim()
    .min(1, "Email address is required.")
    .email("Please enter a valid email address (e.g. teacher@example.com)."),
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
  designation: z
    .string()
    .trim()
    .min(2, "Teacher designation is required (e.g. Senior Teacher).")
    .max(70, "Designation cannot exceed 70 characters."),
  qualification: z
    .string()
    .trim()
    .min(
      2,
      "Highest academic qualification is required (e.g. M.Sc in Mathematics).",
    )
    .max(100, "Qualification cannot exceed 100 characters."),
  specialization: z
    .string()
    .trim()
    .min(
      2,
      "Subject or domain specialization is required (e.g. Physics / Mechanics).",
    )
    .max(100, "Specialization cannot exceed 100 characters."),
  joiningDate: z
    .string()
    .trim()
    .min(1, "Official joining date is required.")
    .refine((val) => !Number.isNaN(Date.parse(val)), {
      message: "Please enter a valid date.",
    }),
  gender: z.enum(["MALE", "FEMALE", "OTHER"], {
    message: "Please select gender.",
  }),
  permissions: z.array(
    z.enum(["MANAGE_ATTENDANCE", "MANAGE_EXAMS", "MANAGE_ROUTINES"]),
  ),
});

export const updateTeacherPermissionsSchema = z.object({
  permissions: z.array(
    z.enum(["MANAGE_ATTENDANCE", "MANAGE_EXAMS", "MANAGE_ROUTINES"]),
  ),
});

export const updateTeacherSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters.")
    .max(70, "Full name cannot exceed 70 characters."),
  email: z
    .string()
    .trim()
    .min(1, "Email address is required.")
    .email("Please enter a valid email address."),
  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required.")
    .regex(
      BD_PHONE_REGEX,
      "Must be a valid 11-digit Bangladeshi number (e.g. 01712345678).",
    ),
  designation: z
    .string()
    .trim()
    .min(2, "Teacher designation is required (e.g. Senior Teacher).")
    .max(70, "Designation cannot exceed 70 characters."),
  qualification: z
    .string()
    .trim()
    .min(
      2,
      "Highest academic qualification is required (e.g. M.Sc in Mathematics).",
    )
    .max(100, "Qualification cannot exceed 100 characters."),
  specialization: z
    .string()
    .trim()
    .min(
      2,
      "Subject or domain specialization is required (e.g. Physics / Mechanics).",
    )
    .max(100, "Specialization cannot exceed 100 characters."),
  joiningDate: z
    .string()
    .trim()
    .min(1, "Official joining date is required.")
    .refine((val) => !Number.isNaN(Date.parse(val)), {
      message: "Please enter a valid date.",
    }),
  gender: z.enum(["MALE", "FEMALE", "OTHER"], {
    message: "Please select gender.",
  }),
});

export type RegisterTeacherInput = z.infer<typeof registerTeacherSchema>;
export type UpdateTeacherPermissionsInput = z.infer<
  typeof updateTeacherPermissionsSchema
>;
export type UpdateTeacherInput = z.infer<typeof updateTeacherSchema>;
