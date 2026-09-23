export type PaymentMethod =
  | "CASH"
  | "BKASH"
  | "NAGAD"
  | "ROCKET"
  | "BANK_TRANSFER"
  | "STRIPE";

export type PaymentStatus = "COMPLETED" | "PENDING" | "FAILED" | "REFUNDED";

export type BillStatus = "PAID" | "PARTIAL" | "UNPAID";

/**
 * Monthly revenue and collection statistics (Admin)
 */
export interface MonthlyRevenueStats {
  month: number;
  year: number;
  expectedRevenue: number;
  collectedAmount: number;
  totalDue: number;
  collectionRate: number;
  paidCount: number;
  partialCount: number;
  unpaidCount: number;
}

/**
 * Monthly Fee Bill record for a student enrollment
 */
export interface MonthlyFeeBill {
  id: string;
  enrollmentId: string;
  studentId?: string;
  student?: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    avatarUrl?: string | null;
    rollNumber?: string | null;
    classLevel?: string | null;
    studentProfile?: {
      rollNumber?: string;
      classLevel?: string;
      institutionName?: string;
      guardianName?: string;
      guardianPhone?: string;
    };
  };
  batchId?: string;
  batch?: {
    id: string;
    name: string;
    fee: number;
  };
  billingMonth: number;
  billingYear: number;
  billingPeriodText?: string;
  monthlyFee: number;
  previousDue: number;
  totalPayable: number;
  paidAmount: number;
  dueAmount: number;
  status: BillStatus;
  lastPaymentDate?: string | null;
  paymentCount?: number;
  enrollment?: {
    id: string;
    batchId?: string;
    studentId?: string;
    batch?: {
      id: string;
      name: string;
      fee: number;
    };
    student?: {
      id: string;
      name: string;
      email: string;
      phone?: string | null;
      avatarUrl?: string | null;
      rollNumber?: string | null;
      classLevel?: string | null;
      studentProfile?: {
        rollNumber?: string;
        classLevel?: string;
        institutionName?: string;
        guardianName?: string;
        guardianPhone?: string;
      };
    };
  };
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Query parameters for monthly payment sheet
 */
export interface MonthlySheetQueryParams {
  month?: number;
  year?: number;
  batchId?: string;
  status?: BillStatus | "ALL";
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/**
 * Admin manual payment collection payload
 */
export interface ManualCollectPaymentDto {
  enrollmentId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  notes?: string;
  billingMonth: number;
  billingYear: number;
}

/**
 * Itemized batch fee breakdown in student billing summary
 */
export interface StudentBillingBatchItem {
  batchId: string;
  batchName: string;
  enrollmentId: string;
  monthlyFee: number;
  previousDue: number;
  totalPayable: number;
  paidAmount: number;
  dueAmount: number;
  status: BillStatus;
}

/**
 * Student personal monthly bill inquiry summary
 */
export interface StudentBillingSummary {
  billingMonth: number;
  billingYear: number;
  totalCurrentMonthFee: number;
  totalPreviousDue: number;
  netTotalPayable: number;
  netTotalPaid: number;
  netTotalRemainingDue: number;
  batches: StudentBillingBatchItem[];
}

/**
 * Stripe checkout initialization payload
 */
export interface CreateCheckoutSessionDto {
  billingMonth: number;
  billingYear: number;
  successUrl?: string;
  cancelUrl?: string;
}

/**
 * Stripe checkout response with redirect URL
 */
export interface CheckoutSessionResponse {
  url: string;
  sessionId?: string;
}

/**
 * Payment transaction ledger record
 */
export interface PaymentTransaction {
  id: string;
  receiptNumber: string;
  amount: number;
  currency?: string;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  billingMonth?: number;
  billingYear?: number;
  billingPeriodText?: string;
  notes?: string | null;
  stripeSessionId?: string | null;
  studentId?: string;
  studentName?: string;
  studentEmail?: string;
  batchId?: string;
  batchName?: string;
  monthlyFeeBillId?: string;
  monthlyFeeBill?: MonthlyFeeBill;
  paidAt?: string;
  collectedByName?: string | null;
  enrollmentId?: string;
  student?: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    avatarUrl?: string | null;
    studentProfile?: {
      rollNumber?: string;
      classLevel?: string;
      institutionName?: string;
    };
  };
  enrollment?: {
    id: string;
    batch?: {
      id: string;
      name: string;
    };
  };
  collectedBy?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Query parameters for transactions ledger
 */
export interface TransactionQueryParams {
  page?: number;
  limit?: number;
  paymentMethod?: PaymentMethod | "ALL";
  status?: PaymentStatus | "ALL";
  search?: string;
  studentId?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
