"use client";

import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { useStudentDashboard } from "@/hooks";
import { cn } from "@/lib/utils";

export function StudentTuitionAlertCard() {
  const { data: dashboard } = useStudentDashboard();
  const billing = dashboard.billing;

  if (!billing || billing.totalDue <= 0) {
    return (
      <div className="flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 text-xs text-foreground shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="size-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="size-4" />
          </div>
          <div>
            <span className="font-semibold text-emerald-700 dark:text-emerald-400">
              All Tuition Fees Cleared!
            </span>
            <p className="text-muted-foreground text-[11px] mt-0.5">
              No outstanding dues pending on your account. Thank you!
            </p>
          </div>
        </div>
        <Link
          href="/dashboard/student/payments"
          className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 shrink-0"
        >
          <span>Payment History</span>
          <ArrowRight className="size-3" />
        </Link>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-500/40 bg-linear-to-r from-amber-500/10 via-amber-500/5 to-card p-4 sm:p-5 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="size-9 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
            <AlertTriangle className="size-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Tuition Payment Notice
              </span>
              <span className="text-[10px] font-semibold bg-amber-500/20 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full">
                {billing.paymentStatus || "UNPAID"}
              </span>
            </div>
            <p className="text-sm font-semibold text-foreground">
              Outstanding Dues:{" "}
              <span className="font-mono text-base font-bold text-amber-600 dark:text-amber-400">
                ৳ {Number(billing.totalDue).toLocaleString()}
              </span>
            </p>
            <p className="text-xs text-muted-foreground">
              {billing.arrears && billing.arrears > 0
                ? `Includes previous arrears of ৳ ${Number(billing.arrears).toLocaleString()}. `
                : ""}
              Please clear your monthly tuition fees online or at the counter.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 sm:self-center">
          <Link
            href="/dashboard/student/payments"
            className={cn(
              buttonVariants({ size: "sm" }),
              "gap-1.5 font-semibold text-xs h-9 bg-amber-600 hover:bg-amber-700 text-white shadow-xs",
            )}
          >
            <CreditCard className="size-3.5" />
            <span>Pay Now (Stripe)</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
