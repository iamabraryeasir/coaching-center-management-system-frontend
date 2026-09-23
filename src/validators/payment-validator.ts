import { z } from "zod";

export const PAYMENT_METHODS = [
  "CASH",
  "BKASH",
  "NAGAD",
  "ROCKET",
  "BANK_TRANSFER",
  "STRIPE",
] as const;

export const MANUAL_PAYMENT_METHODS = [
  "CASH",
  "BKASH",
  "NAGAD",
  "ROCKET",
  "BANK_TRANSFER",
] as const;

export const BILL_STATUSES = ["PAID", "PARTIAL", "UNPAID"] as const;

export const manualCollectFormSchema = z.object({
  amount: z
    .number({ message: "Amount must be a valid number." })
    .positive("Collection amount must be greater than 0.")
    .max(1000000, "Amount exceeds maximum allowable limit."),
  paymentMethod: z.enum(MANUAL_PAYMENT_METHODS, {
    message: "Please select a valid payment channel.",
  }),
  notes: z.string().max(255, "Notes cannot exceed 255 characters."),
});

export type ManualCollectFormInput = z.infer<typeof manualCollectFormSchema>;

export const manualCollectPaymentSchema = z.object({
  enrollmentId: z.string().min(1, "Please select an enrollment."),
  amount: z
    .number()
    .positive("Collection amount must be greater than 0.")
    .max(1000000, "Amount exceeds maximum allowable limit."),
  paymentMethod: z.enum(MANUAL_PAYMENT_METHODS, {
    message: "Please select a valid payment channel.",
  }),
  notes: z
    .string()
    .max(255, "Notes cannot exceed 255 characters.")
    .optional()
    .or(z.literal("")),
  billingMonth: z
    .number()
    .min(1, "Month must be between 1 and 12.")
    .max(12, "Month must be between 1 and 12."),
  billingYear: z
    .number()
    .min(2020, "Year must be 2020 or later.")
    .max(2050, "Year must be 2050 or earlier."),
});

export type ManualCollectPaymentInput = z.infer<
  typeof manualCollectPaymentSchema
>;

export const createCheckoutSessionSchema = z.object({
  billingMonth: z
    .number()
    .min(1, "Month must be between 1 and 12.")
    .max(12, "Month must be between 1 and 12."),
  billingYear: z
    .number()
    .min(2020, "Year must be 2020 or later.")
    .max(2050, "Year must be 2050 or earlier."),
});

export type CreateCheckoutSessionInput = z.infer<
  typeof createCheckoutSessionSchema
>;
