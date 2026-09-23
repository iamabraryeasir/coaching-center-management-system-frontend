"use client";

import {
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  History,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMonthlyRevenueStats } from "@/hooks";
import { MonthlyPaymentSheetTable } from "./monthly-payment-sheet-table";
import { PaymentStatsRibbon } from "./payment-stats-ribbon";
import { PaymentTransactionsTable } from "./payment-transactions-table";

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

export function AdminPaymentsView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [_isPending, startTransition] = useTransition();

  const now = new Date();
  const currentMonth = now.getMonth() + 1; // 1-12
  const currentYear = now.getFullYear();

  // Available past and current years (strictly no future years)
  const availableYears = [
    currentYear - 3,
    currentYear - 2,
    currentYear - 1,
    currentYear,
  ];

  // Selected Month & Year state (bounded so initial cannot exceed current)
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

  // Tab State
  const activeTab = searchParams.get("tab") || "sheet";

  const isAtCurrentPeriod =
    selectedYear >= currentYear && selectedMonth >= currentMonth;

  const handleTabChange = (tab: "sheet" | "transactions") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  const handleMonthChange = (monthVal: string | null) => {
    if (!monthVal) return;
    const m = Number(monthVal);
    // Block if month is in the future for current year
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
    // Auto-clamp if switching to current year and selected month is in future
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
    // Block if exceeding current month and year
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

  // Fetch monthly stats for selected period
  const { data: statsResponse, isLoading: isStatsLoading } =
    useMonthlyRevenueStats({
      month: selectedMonth,
      year: selectedYear,
    });

  const stats = statsResponse?.data;

  return (
    <div className="space-y-6">
      {/* 1. Top Revenue & Collection Statistics Ribbon */}
      <PaymentStatsRibbon stats={stats} isLoading={isStatsLoading} />

      {/* 2. Tabs Switcher with Aligned Date Picker */}
      <Tabs
        value={activeTab}
        onValueChange={(val) =>
          handleTabChange(val as "sheet" | "transactions")
        }
        className="space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-3">
          {/* Tabs Navigation */}
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="sheet" className="gap-2 text-xs font-medium">
              <FileSpreadsheet className="size-4" />
              <span>Monthly Payment Sheet</span>
            </TabsTrigger>
            <TabsTrigger
              value="transactions"
              className="gap-2 text-xs font-medium"
            >
              <History className="size-4" />
              <span>Transaction Ledger & Receipts</span>
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

        {/* Tab Views */}
        <TabsContent value="sheet">
          <MonthlyPaymentSheetTable month={selectedMonth} year={selectedYear} />
        </TabsContent>

        <TabsContent value="transactions">
          <PaymentTransactionsTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
