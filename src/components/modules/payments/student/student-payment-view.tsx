"use client";

import { ChevronLeft, ChevronRight, CreditCard, History } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useCreateCheckoutSessionMutation,
  useStudentBillingSummary,
} from "@/hooks";
import { StudentBillingOverviewSkeleton } from "../shared/payment-skeletons";
import { PaymentTransactionsTable } from "../shared/payment-transactions-table";
import { StudentBatchBreakdownTable } from "./student-batch-breakdown-table";
import { StudentPaymentFeedbackBanner } from "./student-payment-feedback-banner";
import { StudentSettlementCard } from "./student-settlement-card";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function StudentPaymentView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [_isPending, startTransition] = useTransition();

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  // Strictly no future years
  const availableYears = [
    currentYear - 3,
    currentYear - 2,
    currentYear - 1,
    currentYear,
  ];

  const [selectedMonth, setSelectedMonth] = useState<number>(() => {
    const m = Number(searchParams.get("month"));
    const y = Number(searchParams.get("year")) || currentYear;
    if (y > currentYear) return currentMonth;
    if (y === currentYear && m > currentMonth) return currentMonth;
    return m >= 1 && m <= 12 ? m : currentMonth;
  });

  const [selectedYear, setSelectedYear] = useState<number>(() => {
    const y = Number(searchParams.get("year"));
    if (y > currentYear) return currentYear;
    return y >= 2020 && y <= currentYear ? y : currentYear;
  });

  const activeTab = searchParams.get("tab") || "overview";

  const isAtCurrentPeriod =
    selectedYear >= currentYear && selectedMonth >= currentMonth;

  // Stripe Checkout return feedback
  const paymentSuccess = searchParams.get("payment_success") === "true";
  const paymentCanceled = searchParams.get("payment_canceled") === "true";
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [showCanceledBanner, setShowCanceledBanner] = useState(false);

  // Fetch Student Billing Summary
  const {
    data: billingResponse,
    isLoading,
    refetch,
  } = useStudentBillingSummary({
    month: selectedMonth,
    year: selectedYear,
  });

  const billingData = billingResponse?.data;
  const checkoutMutation = useCreateCheckoutSessionMutation();
  const isCheckingOut = checkoutMutation.isPending;

  useEffect(() => {
    if (paymentSuccess) {
      setShowSuccessBanner(true);
      toast.success(
        "Payment completed successfully via Stripe! Refreshing balance...",
        {
          id: "stripe-payment-success",
        },
      );
      refetch();
      // Remove payment_success from URL query so refresh doesn't re-trigger the popup
      const params = new URLSearchParams(searchParams.toString());
      params.delete("payment_success");
      const cleanUrl = params.toString()
        ? `${pathname}?${params.toString()}`
        : pathname;
      window.history.replaceState(null, "", cleanUrl);
    } else if (paymentCanceled) {
      setShowCanceledBanner(true);
      toast.error("Stripe checkout was canceled. No charges were made.", {
        id: "stripe-payment-canceled",
      });
      // Remove payment_canceled from URL query
      const params = new URLSearchParams(searchParams.toString());
      params.delete("payment_canceled");
      const cleanUrl = params.toString()
        ? `${pathname}?${params.toString()}`
        : pathname;
      window.history.replaceState(null, "", cleanUrl);
    }
  }, [paymentSuccess, paymentCanceled, refetch, pathname, searchParams]);

  const handleMonthChange = (monthVal: string | null) => {
    if (!monthVal) return;
    const m = Number(monthVal);
    if (selectedYear === currentYear && m > currentMonth) return;
    setSelectedMonth(m);
    const params = new URLSearchParams(searchParams.toString());
    params.set("month", String(m));
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  const handleYearChange = (yearVal: string | null) => {
    if (!yearVal) return;
    const y = Number(yearVal);
    if (y > currentYear) return;
    let m = selectedMonth;
    if (y === currentYear && m > currentMonth) {
      m = currentMonth;
      setSelectedMonth(m);
    }
    setSelectedYear(y);
    const params = new URLSearchParams(searchParams.toString());
    params.set("year", String(y));
    params.set("month", String(m));
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  const handleJumpToCurrent = () => {
    setSelectedMonth(currentMonth);
    setSelectedYear(currentYear);
    const params = new URLSearchParams(searchParams.toString());
    params.set("month", String(currentMonth));
    params.set("year", String(currentYear));
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  const handlePrevMonth = () => {
    let nextM = selectedMonth - 1;
    let nextY = selectedYear;
    if (nextM < 1) {
      nextM = 12;
      nextY -= 1;
    }
    setSelectedMonth(nextM);
    setSelectedYear(nextY);
    const params = new URLSearchParams(searchParams.toString());
    params.set("month", String(nextM));
    params.set("year", String(nextY));
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  const handleNextMonth = () => {
    if (isAtCurrentPeriod) return;
    let nextM = selectedMonth + 1;
    let nextY = selectedYear;
    if (nextM > 12) {
      nextM = 1;
      nextY += 1;
    }
    if (
      nextY > currentYear ||
      (nextY === currentYear && nextM > currentMonth)
    ) {
      return;
    }
    setSelectedMonth(nextM);
    setSelectedYear(nextY);
    const params = new URLSearchParams(searchParams.toString());
    params.set("month", String(nextM));
    params.set("year", String(nextY));
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  const handleTabChange = (tab: "overview" | "transactions") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  const handleStripeCheckout = async () => {
    if (!billingData || billingData.netTotalRemainingDue <= 0) {
      toast.error("No outstanding balance due for online payment.");
      return;
    }

    const toastId = toast.loading("Connecting to secure Stripe Checkout...");

    try {
      const origin =
        typeof window !== "undefined"
          ? window.location.origin
          : "http://localhost:3000";

      const successUrl = `${origin}/dashboard/student/payments?payment_success=true&month=${selectedMonth}&year=${selectedYear}`;
      const cancelUrl = `${origin}/dashboard/student/payments?payment_canceled=true&month=${selectedMonth}&year=${selectedYear}`;

      const response = await checkoutMutation.mutateAsync({
        billingMonth: selectedMonth,
        billingYear: selectedYear,
        successUrl,
        cancelUrl,
      });

      const checkoutUrl = response.data?.url;
      if (checkoutUrl) {
        toast.success("Redirecting to Stripe...", { id: toastId });
        window.location.href = checkoutUrl;
      } else {
        toast.error("Failed to obtain checkout session URL.", { id: toastId });
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to initialize Stripe payment.";
      toast.error(message, { id: toastId });
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Stripe Return Feedback Alert Banners */}
      <StudentPaymentFeedbackBanner
        showSuccess={showSuccessBanner}
        showCanceled={showCanceledBanner}
        onDismissSuccess={() => setShowSuccessBanner(false)}
        onDismissCanceled={() => setShowCanceledBanner(false)}
      />

      {/* 2. Navigation View Switcher (Tabs) with Aligned Period Controls */}
      <Tabs
        value={activeTab}
        onValueChange={(val) =>
          handleTabChange(val as "overview" | "transactions")
        }
        className="space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-3">
          {/* Tabs Navigation */}
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="overview" className="gap-2 text-xs font-medium">
              <CreditCard className="size-4" />
              <span>Billing Overview & Online Pay</span>
            </TabsTrigger>
            <TabsTrigger
              value="transactions"
              className="gap-2 text-xs font-medium"
            >
              <History className="size-4" />
              <span>Payment History & Receipts</span>
            </TabsTrigger>
          </TabsList>

          {/* Aligned Period Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Quick Nav Prev/Next */}
            <div className="flex items-center gap-1 border border-border rounded-lg p-0.5 bg-muted/40">
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={handlePrevMonth}
                title="Previous Month"
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="xs"
                className="text-xs font-medium px-2 h-7"
                onClick={handleJumpToCurrent}
              >
                Current
              </Button>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={handleNextMonth}
                disabled={isAtCurrentPeriod}
                title={
                  isAtCurrentPeriod
                    ? "Future months cannot be selected"
                    : "Next Month"
                }
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>

            {/* Month Selector */}
            <div className="w-36">
              <Select
                value={String(selectedMonth)}
                onValueChange={handleMonthChange}
              >
                <SelectTrigger className="h-9 w-full text-xs px-3 font-medium">
                  <SelectValue placeholder="Month">
                    {(val: string | null) =>
                      val ? MONTH_NAMES[Number(val) - 1] : "Select Month"
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {MONTH_NAMES.map((name, i) => {
                    const monthNumber = i + 1;
                    const isFutureMonth =
                      selectedYear === currentYear &&
                      monthNumber > currentMonth;
                    return (
                      <SelectItem
                        key={name}
                        value={String(monthNumber)}
                        disabled={isFutureMonth}
                      >
                        {name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Year Selector */}
            <div className="w-24">
              <Select
                value={String(selectedYear)}
                onValueChange={handleYearChange}
              >
                <SelectTrigger className="h-9 w-full text-xs px-3 font-medium">
                  <SelectValue placeholder="Year">
                    {(val: string | null) => val || String(currentYear)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {availableYears.map((y) => (
                    <SelectItem key={y} value={String(y)}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* 3. Tab Content */}
        <TabsContent value="overview" className="space-y-6">
          {isLoading || !billingData ? (
            <StudentBillingOverviewSkeleton />
          ) : (
            <>
              <StudentSettlementCard
                billingData={billingData}
                billingPeriodText={`${MONTH_NAMES[selectedMonth - 1]} ${selectedYear}`}
                isCheckingOut={isCheckingOut}
                onPayWithStripe={handleStripeCheckout}
              />

              <StudentBatchBreakdownTable batches={billingData.batches} />
            </>
          )}
        </TabsContent>

        <TabsContent value="transactions" className="space-y-3">
          <h2 className="text-base font-semibold text-foreground font-heading">
            My Past Payment Receipts & Transactions
          </h2>
          <PaymentTransactionsTable hideStudentColumn={true} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
