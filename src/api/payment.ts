import apiClient from "@/lib/api-client";
import type {
  ApiResponse,
  CheckoutSessionResponse,
  CreateCheckoutSessionDto,
  ManualCollectPaymentDto,
  MonthlyFeeBill,
  MonthlyRevenueStats,
  MonthlySheetQueryParams,
  PaginatedResponse,
  PaymentTransaction,
  StudentBillingSummary,
  TransactionQueryParams,
} from "@/types";

/**
 * 1. Fetch monthly revenue & collection statistics (Admin only)
 * GET /payments/monthly-stats
 */
export async function getMonthlyRevenueStats(params?: {
  month?: number;
  year?: number;
  batchId?: string;
}): Promise<ApiResponse<MonthlyRevenueStats>> {
  const query: Record<string, string | number> = {};

  if (params?.month) query.month = params.month;
  if (params?.year) query.year = params.year;
  if (params?.batchId) query.batchId = params.batchId;

  return await apiClient<ApiResponse<MonthlyRevenueStats>>(
    "/payments/monthly-stats",
    {
      method: "GET",
      query,
    },
  );
}

/**
 * 2. Fetch monthly payment sheet / student roster (Admin only)
 * GET /payments/monthly-sheet
 */
export async function getMonthlyPaymentSheet(
  params?: MonthlySheetQueryParams,
): Promise<PaginatedResponse<MonthlyFeeBill>> {
  const query: Record<string, string | number> = {};

  if (params?.month) query.month = params.month;
  if (params?.year) query.year = params.year;
  if (params?.page) query.page = params.page;
  if (params?.limit) query.limit = params.limit;
  if (params?.batchId) query.batchId = params.batchId;
  if (params?.status && params.status !== "ALL") query.status = params.status;
  if (params?.search && params.search.trim() !== "") {
    query.search = params.search.trim();
  }
  if (params?.sortBy) query.sortBy = params.sortBy;
  if (params?.sortOrder) query.sortOrder = params.sortOrder;

  return await apiClient<PaginatedResponse<MonthlyFeeBill>>(
    "/payments/monthly-sheet",
    {
      method: "GET",
      query,
    },
  );
}

/**
 * 3. Record an offline / partial manual payment collection (Admin only)
 * POST /payments/manual-collect
 */
export async function manualCollectPayment(
  payload: ManualCollectPaymentDto,
): Promise<ApiResponse<PaymentTransaction>> {
  return await apiClient<ApiResponse<PaymentTransaction>>(
    "/payments/manual-collect",
    {
      method: "POST",
      body: payload,
    },
  );
}

/**
 * 4. Get student billing summary & itemized batch breakdown (Student only)
 * GET /payments/my-bill
 */
export async function getStudentBillingSummary(params?: {
  month?: number;
  year?: number;
}): Promise<ApiResponse<StudentBillingSummary>> {
  const query: Record<string, string | number> = {};

  if (params?.month) query.month = params.month;
  if (params?.year) query.year = params.year;

  return await apiClient<ApiResponse<StudentBillingSummary>>(
    "/payments/my-bill",
    {
      method: "GET",
      query,
    },
  );
}

/**
 * 5. Create a hosted Stripe Checkout session for full settlement (Student only)
 * POST /payments/create-checkout-session
 */
export async function createCheckoutSession(
  payload: CreateCheckoutSessionDto,
): Promise<ApiResponse<CheckoutSessionResponse>> {
  return await apiClient<ApiResponse<CheckoutSessionResponse>>(
    "/payments/create-checkout-session",
    {
      method: "POST",
      body: payload,
    },
  );
}

/**
 * 6. Get payment transactions ledger (Admin & Student)
 * GET /payments/transactions
 */
export async function getPaymentTransactions(
  params?: TransactionQueryParams,
): Promise<PaginatedResponse<PaymentTransaction>> {
  const query: Record<string, string | number> = {};

  if (params?.page) query.page = params.page;
  if (params?.limit) query.limit = params.limit;
  if (params?.paymentMethod && params.paymentMethod !== "ALL") {
    query.paymentMethod = params.paymentMethod;
  }
  if (params?.status && params.status !== "ALL") {
    query.status = params.status;
  }
  if (params?.search && params.search.trim() !== "") {
    query.search = params.search.trim();
  }
  if (params?.studentId) query.studentId = params.studentId;
  if (params?.sortBy) query.sortBy = params.sortBy;
  if (params?.sortOrder) query.sortOrder = params.sortOrder;

  return await apiClient<PaginatedResponse<PaymentTransaction>>(
    "/payments/transactions",
    {
      method: "GET",
      query,
    },
  );
}

/**
 * 7. Build URL for payment receipt PDF download / preview
 * GET /payments/transactions/:transactionId/pdf?download=true
 */
export function getPaymentReceiptPdfUrl(
  transactionId: string,
  download = false,
): string {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "http://localhost:5000/api/v1";
  return `${baseUrl}/payments/transactions/${transactionId}/pdf?download=${download}`;
}
