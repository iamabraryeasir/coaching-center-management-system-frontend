export interface TodayCollectionStats {
  totalAmount: number;
  transactionCount: number;
  currency: string;
}

export interface TodayStudentAttendance {
  presentCount: number;
  absentCount: number;
  lateCount: number;
  totalMarked: number;
  attendanceRate: number | null;
  batchesTakenCount: number;
  totalActiveBatches: number;
  notTakenBatches: number;
}

export interface TodayTeacherAttendance {
  checkedInCount: number;
  totalTeachers: number;
  absentCount: number;
}

export interface TodayAttendance {
  student: TodayStudentAttendance;
  teacher: TodayTeacherAttendance;
}

export interface TodayPendingActions {
  studentApplications: number;
  enrollmentRequests: number;
  total: number;
}

export interface TodayRecentTransaction {
  id: string;
  receiptNumber: string;
  studentName: string;
  batchName: string;
  amount: number;
  paymentMethod: string;
  paidAt: string;
}

export interface DashboardTodaySnapshot {
  date: string;
  todayCollection: TodayCollectionStats;
  attendance: TodayAttendance;
  pendingActions: TodayPendingActions;
  recentTransactions: TodayRecentTransaction[];
}

// Monthly Summary
export interface DashboardFinancialSummary {
  expectedRevenue: number;
  collectedAmount: number;
  totalDue: number;
  collectionRate: number;
  paidCount: number;
  partialCount: number;
  unpaidCount: number;
  currency: string;
}

export interface DashboardAcademicSummary {
  totalExams: number;
  publishedResults: number;
  upcomingExams: number;
  completedExams: number;
}

export interface DashboardBatchSummary {
  ongoingBatches: number;
  upcomingBatches: number;
  totalEnrollmentsThisMonth: number;
}

export interface DashboardMonthlySummary {
  month: number;
  year: number;
  billingPeriodText: string;
  financial: DashboardFinancialSummary;
  academic: DashboardAcademicSummary;
  batches: DashboardBatchSummary;
}

// Revenue Trend
export interface RevenueTrendPoint {
  month: number;
  year: number;
  monthLabel: string;
  monthYear: string;
  expectedRevenue: number;
  collectedAmount: number;
  totalDue: number;
  collectionRate: number;
  transactionCount: number;
}

export interface DashboardRevenueTrend {
  months: number;
  trend: RevenueTrendPoint[];
}
