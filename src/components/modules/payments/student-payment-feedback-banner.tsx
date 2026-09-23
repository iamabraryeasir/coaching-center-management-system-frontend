"use client";

import { CheckCircle2, X, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StudentPaymentFeedbackBannerProps {
  showSuccess: boolean;
  showCanceled: boolean;
  onDismissSuccess: () => void;
  onDismissCanceled: () => void;
}

export function StudentPaymentFeedbackBanner({
  showSuccess,
  showCanceled,
  onDismissSuccess,
  onDismissCanceled,
}: StudentPaymentFeedbackBannerProps) {
  if (!showSuccess && !showCanceled) return null;

  return (
    <div className="space-y-3">
      {showSuccess && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-800 dark:text-emerald-300 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <div className="text-xs space-y-0.5">
              <p className="font-semibold text-sm">Payment Successful!</p>
              <p>
                Your payment via Stripe was processed and verified. Digital
                receipts are available in your Transaction History below.
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onDismissSuccess}
            className="text-emerald-700 hover:text-emerald-900 dark:text-emerald-300 dark:hover:text-emerald-100"
          >
            <X className="size-4" />
          </Button>
        </div>
      )}

      {showCanceled && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-800 dark:text-amber-300 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <XCircle className="size-5 shrink-0 text-amber-600 dark:text-amber-400" />
            <div className="text-xs space-y-0.5">
              <p className="font-semibold text-sm">Payment Canceled</p>
              <p>
                Your Stripe Checkout session was canceled. You can try again
                whenever you are ready.
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onDismissCanceled}
            className="text-amber-700 hover:text-amber-900 dark:text-amber-300 dark:hover:text-amber-100"
          >
            <X className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
