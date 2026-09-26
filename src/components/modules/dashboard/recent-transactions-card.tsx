"use client";

import { format } from "date-fns";
import { Banknote, ChevronRight } from "lucide-react";
import Link from "next/link";

import { useDashboardToday } from "@/hooks";
import type { TodayRecentTransaction } from "@/types";

const METHOD_BADGE_CLASSES: Record<string, string> = {
  CASH: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
  BKASH: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-400",
  NAGAD:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400",
  ROCKET:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400",
  STRIPE: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  BANK_TRANSFER: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400",
};

function PaymentMethodBadge({ method }: { method: string }) {
  const classes =
    METHOD_BADGE_CLASSES[method] ?? "bg-muted text-muted-foreground";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${classes}`}
    >
      {method.replace("_", " ")}
    </span>
  );
}

function TransactionRow({ tx }: { tx: TodayRecentTransaction }) {
  return (
    <div className="flex items-center gap-3 py-2">
      {/* Avatar */}
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
        {tx.studentName.charAt(0).toUpperCase()}
      </div>
      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">
          {tx.studentName}
        </p>
        <p className="text-xs text-muted-foreground">{tx.batchName}</p>
      </div>
      {/* Amount + badge + time */}
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="text-sm font-semibold text-foreground">
          ৳ {tx.amount.toLocaleString("en-BD")}
        </span>
        <PaymentMethodBadge method={tx.paymentMethod} />
        <span className="text-[10px] text-muted-foreground">
          {format(new Date(tx.paidAt), "h:mm a")}
        </span>
      </div>
    </div>
  );
}

export function RecentTransactionsCard() {
  const { data: today } = useDashboardToday();
  const transactions = today.recentTransactions;

  return (
    <div className="rounded-xl border border-border/80 bg-card p-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-heading text-base font-semibold text-foreground">
          Today&apos;s Payments
        </h3>
        <Link
          href="/dashboard/admin/payments"
          className="flex items-center gap-0.5 text-xs font-medium text-primary hover:underline"
        >
          View all
          <ChevronRight className="size-3.5" />
        </Link>
      </div>

      {/* Transactions list */}
      {transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-10 text-muted-foreground">
          <Banknote className="size-8 opacity-40" />
          <p className="text-sm">No payments collected today yet.</p>
        </div>
      ) : (
        <div className="divide-y divide-border/50">
          {transactions.map((tx) => (
            <TransactionRow key={tx.id} tx={tx} />
          ))}
        </div>
      )}
    </div>
  );
}
