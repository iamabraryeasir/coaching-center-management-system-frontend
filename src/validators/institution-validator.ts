import { z } from "zod";

export const updateInstitutionSchema = z.object({
  institutionName: z
    .string()
    .min(2, "Institution name must be at least 2 characters")
    .max(100, "Institution name cannot exceed 100 characters"),
  institutionAddress: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(250, "Address cannot exceed 250 characters"),
  institutionPhone: z
    .string()
    .min(6, "Phone number must be at least 6 digits")
    .max(20, "Phone number is too long"),
  institutionEmail: z
    .string()
    .email("Please provide a valid official email address"),
  adminName: z
    .string()
    .min(2, "Admin name must be at least 2 characters")
    .max(100, "Admin name cannot exceed 100 characters")
    .optional()
    .or(z.literal("")),
  adminPhone: z
    .string()
    .max(20, "Admin phone number is too long")
    .optional()
    .or(z.literal("")),
  tagline: z
    .string()
    .max(200, "Tagline is too long")
    .optional()
    .or(z.literal("")),
  logoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

export type UpdateInstitutionInput = z.infer<typeof updateInstitutionSchema>;
