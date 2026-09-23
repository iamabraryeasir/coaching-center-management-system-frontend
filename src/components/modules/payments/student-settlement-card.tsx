"use client";

import { ArrowRight, CheckCircle2, CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { StudentBillingSummary } from "@/types";

interface StudentSettlementCardProps {
  billingData: StudentBillingSummary;
  billingPeriodText: string;
  isCheckingOut: boolean;
  onPayWithStripe: () => void;
}

export function StudentSettlementCard({
  billingData,
  billingPeriodText,
  isCheckingOut,
  onPayWithStripe,
}: StudentSettlementCardProps) {
  const netRemainingDue = billingData.netTotalRemainingDue ?? 0;
  const isFullyPaid = netRemainingDue === 0;

  return (
    <div className="rounded-2xl border border-border/80 bg-linear-to-br from-card via-card to-primary/5 p-6 shadow-xs space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Billing Period: {billingPeriodText}
          </span>

          {isFullyPaid ? (
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-7" />
              <span className="text-2xl font-bold font-heading">
                All Dues Cleared!
              </span>
            </div>
          ) : (
            <div>
              <div className="text-3xl font-extrabold text-foreground font-heading tracking-tight">
                ৳{netRemainingDue.toLocaleString()}
              </div>
              <p className="text-xs text-rose-600 dark:text-rose-400 font-medium pt-1">
                Total outstanding balance due for settlement
              </p>
            </div>
          )}
        </div>

        {/* Stripe Payment CTA */}
        <div>
          <Button
            size="lg"
            disabled={isFullyPaid || isCheckingOut}
            onClick={onPayWithStripe}
            className="w-full sm:w-auto gap-2.5 font-semibold shadow-xs"
          >
            {isCheckingOut ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Initializing Stripe Checkout...</span>
              </>
            ) : isFullyPaid ? (
              <>
                <CheckCircle2 className="size-4" />
                <span>No Dues Pending</span>
              </>
            ) : (
              <>
                <CreditCard className="size-4" />
                <span>
                  Pay Full Settlement with Stripe (৳
                  {netRemainingDue.toLocaleString()})
                </span>
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>
          {!isFullyPaid && (
            <p className="text-[11px] text-muted-foreground text-center sm:text-right pt-1.5">
              Instant automated clearance via Visa, Mastercard, or MFS.
            </p>
          )}
        </div>
      </div>

      {/* Financial Ledger Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-border/60">
        <div className="rounded-xl border border-border/60 bg-muted/20 p-3 space-y-1">
          <span className="text-[11px] text-muted-foreground font-medium block">
            Current Month Fee
          </span>
          <span className="text-sm font-bold text-foreground">
            ৳{(billingData.totalCurrentMonthFee ?? 0).toLocaleString()}
          </span>
        </div>

        <div className="rounded-xl border border-border/60 bg-muted/20 p-3 space-y-1">
          <span className="text-[11px] text-muted-foreground font-medium block">
            Previous Debt Arrears
          </span>
          <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
            ৳{(billingData.totalPreviousDue ?? 0).toLocaleString()}
          </span>
        </div>

        <div className="rounded-xl border border-border/60 bg-muted/20 p-3 space-y-1">
          <span className="text-[11px] text-muted-foreground font-medium block">
            Net Total Payable
          </span>
          <span className="text-sm font-bold text-foreground">
            ৳{(billingData.netTotalPayable ?? 0).toLocaleString()}
          </span>
        </div>

        <div className="rounded-xl border border-border/60 bg-muted/20 p-3 space-y-1">
          <span className="text-[11px] text-muted-foreground font-medium block">
            Total Paid This Month
          </span>
          <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
            ৳{(billingData.netTotalPaid ?? 0).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
