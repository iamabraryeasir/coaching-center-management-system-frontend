import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  adjustBillPreviousDue,
  createCheckoutSession,
  getMonthlyPaymentSheet,
  getMonthlyRevenueStats,
  getPaymentTransactions,
  getStudentBillingSummary,
  manualCollectPayment,
} from "@/api";
import { dashboardKeys, paymentKeys } from "@/constants";
import type {
  AdjustPreviousDuePayload,
  CreateCheckoutSessionDto,
  ManualCollectPaymentDto,
  MonthlySheetQueryParams,
  TransactionQueryParams,
} from "@/types";

/**
 * 1. Hook to fetch monthly revenue statistics (Admin)
 */
export function useMonthlyRevenueStats(
  params?: {
    month?: number;
    year?: number;
    batchId?: string;
  },
  enabled = true,
) {
  return useQuery({
    queryKey: paymentKeys.stats(params as Record<string, unknown>),
    queryFn: () => getMonthlyRevenueStats(params),
    enabled,
    placeholderData: (previousData) => previousData,
  });
}

/**
 * 2. Hook to fetch monthly payment sheet roster (Admin)
 */
export function useMonthlyPaymentSheet(
  params?: MonthlySheetQueryParams,
  enabled = true,
) {
  return useQuery({
    queryKey: paymentKeys.monthlySheet(params as Record<string, unknown>),
    queryFn: () => getMonthlyPaymentSheet(params),
    enabled,
    placeholderData: (previousData) => previousData,
  });
}

/**
 * 3. Hook to record manual / offline fee collection (Admin)
 */
export function useManualCollectPaymentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ManualCollectPaymentDto) =>
      manualCollectPayment(payload),
    onSuccess: () => {
      // Invalidate all payment queries (sheet, stats, transactions, student bill, dashboard)
      queryClient.invalidateQueries({ queryKey: paymentKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to record payment.");
    },
  });
}

/**
 * 4. Hook to adjust / set previous dues on a monthly fee bill (Admin)
 */
export function useAdjustBillPreviousDueMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      billId,
      payload,
    }: {
      billId: string;
      payload: AdjustPreviousDuePayload;
    }) => adjustBillPreviousDue(billId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to adjust previous dues.");
    },
  });
}

/**
 * 5. Hook to fetch student billing summary & batch breakdown (Student)
 */
export function useStudentBillingSummary(
  params?: {
    month?: number;
    year?: number;
  },
  enabled = true,
) {
  return useQuery({
    queryKey: paymentKeys.myBill(params as Record<string, unknown>),
    queryFn: () => getStudentBillingSummary(params),
    enabled,
    placeholderData: (previousData) => previousData,
  });
}

/**
 * 6. Hook to create a Stripe hosted checkout session (Student)
 */
export function useCreateCheckoutSessionMutation() {
  return useMutation({
    mutationFn: (payload: CreateCheckoutSessionDto) =>
      createCheckoutSession(payload),
    onError: (error: Error) => {
      toast.error(error.message || "Failed to initialize checkout session.");
    },
  });
}

/**
 * 7. Hook to fetch payment transactions ledger (Admin & Student)
 */
export function usePaymentTransactions(
  params?: TransactionQueryParams,
  enabled = true,
) {
  return useQuery({
    queryKey: paymentKeys.transactions(params as Record<string, unknown>),
    queryFn: () => getPaymentTransactions(params),
    enabled,
    placeholderData: (previousData) => previousData,
  });
}
