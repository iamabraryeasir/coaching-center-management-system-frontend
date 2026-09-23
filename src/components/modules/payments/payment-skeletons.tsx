import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const STATS_SKELETON_IDS = [
  "stats-sk-1",
  "stats-sk-2",
  "stats-sk-3",
  "stats-sk-4",
];

const SHEET_ROW_SKELETON_IDS = [
  "sheet-sk-1",
  "sheet-sk-2",
  "sheet-sk-3",
  "sheet-sk-4",
  "sheet-sk-5",
  "sheet-sk-6",
];

const TRX_ROW_SKELETON_IDS = [
  "trx-sk-1",
  "trx-sk-2",
  "trx-sk-3",
  "trx-sk-4",
  "trx-sk-5",
  "trx-sk-6",
];

const OVERVIEW_SUB_SKELETON_IDS = [
  "sub-sk-1",
  "sub-sk-2",
  "sub-sk-3",
  "sub-sk-4",
];

const ITEMIZED_SKELETON_IDS = ["item-sk-1", "item-sk-2", "item-sk-3"];

/**
 * Skeleton placeholder for Admin Payment Revenue & Collection Statistics Ribbon
 */
export function PaymentStatsRibbonSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
      {STATS_SKELETON_IDS.map((skId) => (
        <Card
          key={skId}
          className="p-4 space-y-3 bg-card border-border/80 shadow-2xs"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="size-8 rounded-lg" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-7 w-28" />
            <Skeleton className="h-3 w-36" />
          </div>
        </Card>
      ))}
    </div>
  );
}

/**
 * Skeleton placeholder for Monthly Payment Sheet Roster Table
 */
export function MonthlyPaymentSheetTableSkeleton() {
  return (
    <div className="space-y-4">
      {/* Filter Toolbar Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border/80 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <Skeleton className="h-9 w-64 rounded-md" />
          <Skeleton className="h-9 w-48 rounded-md" />
          <Skeleton className="h-9 w-36 rounded-md" />
        </div>
        <Skeleton className="h-4 w-24 self-center" />
      </div>

      {/* Table Skeleton */}
      <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-2xs">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="w-60 text-xs font-semibold">
                Student
              </TableHead>
              <TableHead className="text-xs font-semibold">Batch</TableHead>
              <TableHead className="text-xs font-semibold text-right">
                Monthly Fee
              </TableHead>
              <TableHead className="text-xs font-semibold text-right">
                Previous Due
              </TableHead>
              <TableHead className="text-xs font-semibold text-right">
                Total Payable
              </TableHead>
              <TableHead className="text-xs font-semibold text-right">
                Paid
              </TableHead>
              <TableHead className="text-xs font-semibold text-right">
                Due Balance
              </TableHead>
              <TableHead className="text-xs font-semibold text-center">
                Status
              </TableHead>
              <TableHead className="text-xs font-semibold text-right">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {SHEET_ROW_SKELETON_IDS.map((skId) => (
              <TableRow key={skId}>
                <TableCell>
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-28" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-4 w-12 ml-auto" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-4 w-12 ml-auto" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-4 w-14 ml-auto" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-4 w-12 ml-auto" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-4 w-12 ml-auto" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="h-5 w-16 mx-auto rounded-full" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-8 w-20 ml-auto rounded-md" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

/**
 * Skeleton placeholder for Payment Transactions Ledger Table
 */
export function PaymentTransactionsTableSkeleton({
  hideStudentColumn = false,
}: {
  hideStudentColumn?: boolean;
}) {
  return (
    <div className="space-y-4">
      {/* Filter Toolbar Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border/80 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <Skeleton className="h-9 w-64 rounded-md" />
          <Skeleton className="h-9 w-40 rounded-md" />
          <Skeleton className="h-9 w-36 rounded-md" />
        </div>
        <Skeleton className="h-4 w-28 self-center" />
      </div>

      {/* Table Skeleton */}
      <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-2xs">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="text-xs font-semibold">Receipt #</TableHead>
              <TableHead className="text-xs font-semibold">
                Date & Time
              </TableHead>
              {!hideStudentColumn && (
                <TableHead className="text-xs font-semibold">Student</TableHead>
              )}
              <TableHead className="text-xs font-semibold">Batch</TableHead>
              <TableHead className="text-xs font-semibold text-right">
                Amount
              </TableHead>
              <TableHead className="text-xs font-semibold text-center">
                Channel
              </TableHead>
              <TableHead className="text-xs font-semibold text-center">
                Status
              </TableHead>
              <TableHead className="text-xs font-semibold text-right">
                Receipt
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {TRX_ROW_SKELETON_IDS.map((skId) => (
              <TableRow key={skId}>
                <TableCell>
                  <Skeleton className="h-4 w-28" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                {!hideStudentColumn && (
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                )}
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-4 w-14 ml-auto" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="h-5 w-16 mx-auto rounded-full" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="h-5 w-16 mx-auto rounded-full" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-8 w-20 ml-auto rounded-md" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

/**
 * Skeleton placeholder for Student Billing Overview Hero Card
 */
export function StudentBillingOverviewSkeleton() {
  return (
    <div className="space-y-6">
      {/* Hero Settlement Card Skeleton */}
      <Card className="p-6 space-y-6 bg-card border-border/80 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-9 w-44" />
            <Skeleton className="h-3 w-56" />
          </div>
          <Skeleton className="h-11 w-64 rounded-lg" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-border/60">
          {OVERVIEW_SUB_SKELETON_IDS.map((skId) => (
            <div
              key={skId}
              className="p-3 rounded-xl border border-border/60 bg-muted/20 space-y-2"
            >
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-5 w-16" />
            </div>
          ))}
        </div>
      </Card>

      {/* Itemized Table Skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-44" />
        <div className="rounded-xl border border-border/80 bg-card p-4 space-y-3">
          {ITEMIZED_SKELETON_IDS.map((skId) => (
            <div
              key={skId}
              className="flex items-center justify-between py-2 border-b border-border/40 last:border-0"
            >
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Full Page-level Admin Payments Loading Shell (for Next.js route streaming)
 */
export function AdminPaymentsViewSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats Ribbon Skeleton */}
      <PaymentStatsRibbonSkeleton />

      {/* Toolbar Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-3">
        <Skeleton className="h-9 w-80 rounded-lg" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-32 rounded-lg" />
          <Skeleton className="h-9 w-36 rounded-lg" />
          <Skeleton className="h-9 w-24 rounded-lg" />
        </div>
      </div>

      {/* Table Content Skeleton */}
      <MonthlyPaymentSheetTableSkeleton />
    </div>
  );
}

/**
 * Full Page-level Student Payments Loading Shell (for Next.js route streaming)
 */
export function StudentPaymentsViewSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border/80 shadow-2xs">
        <div className="space-y-2">
          <Skeleton className="h-4 w-36 rounded-full" />
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-3 w-80" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-36 rounded-lg" />
          <Skeleton className="h-9 w-24 rounded-lg" />
        </div>
      </div>

      {/* Tabs List Skeleton */}
      <div className="border-b border-border/80 pb-2">
        <Skeleton className="h-9 w-72 rounded-lg" />
      </div>

      {/* Overview Card Skeleton */}
      <StudentBillingOverviewSkeleton />
    </div>
  );
}
