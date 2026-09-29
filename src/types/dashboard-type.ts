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

// ==========================================
// Student Dashboard Analytics Types
// ==========================================

export interface StudentTodayClass {
  id: string;
  subject: string;
  batchId: string;
  batchName: string;
  startTime: string; // e.g. "10:00"
  endTime: string; // e.g. "11:30"
  room: string;
  teacherName: string;
  status?: "UPCOMING" | "IN_PROGRESS" | "COMPLETED";
}

export interface StudentDashboardKpis {
  enrolledBatchesCount: number;
  attendanceRate: number; // e.g. 92.5
  totalClassesMarked: number;
  presentCount: number;
  averageGpa: number; // e.g. 4.85
  totalExamsEvaluated: number;
  totalDue: number; // e.g. 2500
  paymentStatus: "PAID" | "UNPAID" | "PARTIAL";
}

export interface StudentBillingAlert {
  totalDue: number;
  effectiveMonthlyFee?: number;
  arrears?: number;
  totalPaid?: number;
  paymentStatus: "PAID" | "UNPAID" | "PARTIAL";
  isFullyPaid: boolean;
  billingMonth?: string; // e.g. "October 2026"
}

export interface StudentRecentExamResult {
  examId: string;
  examTitle: string;
  batchName: string;
  examDate: string;
  marksObtained: number;
  totalMarks: number;
  letterGrade: string; // "A+", "A", etc.
  gpa: number; // 5.0
  rank: number | null; // 1, 2, etc.
  isPassed: boolean;
}

export interface StudentEnrolledBatchSummary {
  batchId: string;
  batchName: string;
  subject: string;
  fee: number;
  status: string; // "ONGOING", "UPCOMING"
  teacherName?: string;
  weeklyClassesCount?: number;
}

export interface StudentDashboardSummary {
  kpis: StudentDashboardKpis;
  todayClasses: StudentTodayClass[];
  billing: StudentBillingAlert;
  recentExams: StudentRecentExamResult[];
  enrolledBatches: StudentEnrolledBatchSummary[];
}
