import {
  AlertCircle,
  Banknote,
  CheckCircle2,
  Clock,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import type { MonthlyRevenueStats } from "@/types";
import { PaymentStatsRibbonSkeleton } from "../shared/payment-skeletons";

interface PaymentStatsRibbonProps {
  stats?: MonthlyRevenueStats;
  isLoading?: boolean;
}

export function PaymentStatsRibbon({
  stats,
  isLoading,
}: PaymentStatsRibbonProps) {
  if (isLoading || !stats) {
    return <PaymentStatsRibbonSkeleton />;
  }

  const expectedRevenue = stats?.expectedRevenue ?? 0;
  const collectedAmount = stats?.collectedAmount ?? 0;
  const totalDue = stats?.totalDue ?? 0;
  const collectionRate = stats?.collectionRate ?? 0;
  const paidCount = stats?.paidCount ?? 0;
  const partialCount = stats?.partialCount ?? 0;
  const unpaidCount = stats?.unpaidCount ?? 0;
  const totalStudents = paidCount + partialCount + unpaidCount;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Expected Revenue */}
      <div className="rounded-xl border border-border/80 bg-card p-4 shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-medium">
            Expected Revenue
          </span>
          <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <DollarSign className="size-4" />
          </div>
        </div>
        <div className="text-2xl font-bold tracking-tight text-foreground font-heading">
          ৳{expectedRevenue.toLocaleString()}
        </div>
        <p className="text-xs text-muted-foreground">
          Across {totalStudents} active student enrollments
        </p>
      </div>

      {/* 2. Collected Amount */}
      <div className="rounded-xl border border-border/80 bg-card p-4 shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-medium">
            Collected Revenue
          </span>
          <div className="size-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Banknote className="size-4" />
          </div>
        </div>
        <div className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 font-heading">
          ৳{collectedAmount.toLocaleString()}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <CheckCircle2 className="size-3.5 text-emerald-500" />
          <span>{paidCount} paid in full</span>
        </div>
      </div>

      {/* 3. Outstanding Due */}
      <div className="rounded-xl border border-border/80 bg-card p-4 shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-medium">
            Outstanding Arrears
          </span>
          <div className="size-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <AlertCircle className="size-4" />
          </div>
        </div>
        <div className="text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400 font-heading">
          ৳{totalDue.toLocaleString()}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3 text-amber-500" />
            <span>{partialCount} partial</span>
          </span>
          <span>•</span>
          <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-medium">
            {unpaidCount} unpaid
          </span>
        </div>
      </div>

      {/* 4. Collection Rate */}
      <div className="rounded-xl border border-border/80 bg-card p-4 shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-medium">
            Collection Rate
          </span>
          <div className="size-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <TrendingUp className="size-4" />
          </div>
        </div>
        <div className="text-2xl font-bold tracking-tight text-foreground font-heading">
          {collectionRate.toFixed(1)}%
        </div>
        <div className="space-y-1">
          <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-primary to-emerald-500 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, Math.max(0, collectionRate))}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
