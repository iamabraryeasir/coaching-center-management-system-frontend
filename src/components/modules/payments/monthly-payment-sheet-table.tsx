"use client";

import {
  CreditCard,
  Layers,
  PlusCircle,
  Search,
  User as UserIcon,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useBatches, useDebounce, useMonthlyPaymentSheet } from "@/hooks";
import type { BillStatus, MonthlyFeeBill } from "@/types";
import { StudentPagination } from "../students/student-pagination";
import { ManualCollectDialog } from "./manual-collect-dialog";
import { MonthlyPaymentSheetTableSkeleton } from "./payment-skeletons";
import { BillStatusBadge } from "./payment-status-badge";

interface MonthlyPaymentSheetTableProps {
  month: number;
  year: number;
}

export function MonthlyPaymentSheetTable({
  month,
  year,
}: MonthlyPaymentSheetTableProps) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBatchId, setSelectedBatchId] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<BillStatus | "ALL">(
    "ALL",
  );

  const [collectingBill, setCollectingBill] = useState<MonthlyFeeBill | null>(
    null,
  );
  const [isCollectOpen, setIsCollectOpen] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 400);

  // Fetch batches for filter dropdown
  const { data: batchesResponse } = useBatches({ limit: 100 });
  const batches = batchesResponse?.data || [];

  // Fetch Monthly Payment Sheet
  const { data: sheetResponse, isLoading } = useMonthlyPaymentSheet({
    month,
    year,
    page,
    limit,
    search: debouncedSearch || undefined,
    batchId: selectedBatchId !== "ALL" ? selectedBatchId : undefined,
    status: selectedStatus !== "ALL" ? selectedStatus : undefined,
  });

  if (isLoading) {
    return <MonthlyPaymentSheetTableSkeleton />;
  }

  const bills = sheetResponse?.data || [];
  const meta = sheetResponse?.meta;

  const handleOpenCollect = (bill: MonthlyFeeBill) => {
    setCollectingBill(bill);
    setIsCollectOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* 1. Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border/80 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search Input */}
          <div className="relative min-w-55 sm:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              placeholder="Search student, roll, phone..."
              className="pl-8 h-9 text-xs"
            />
          </div>

          {/* Batch Filter */}
          <div className="min-w-48">
            <Select
              value={selectedBatchId}
              onValueChange={(val) => {
                setSelectedBatchId(val || "ALL");
                setPage(1);
              }}
            >
              <SelectTrigger className="h-9 w-full min-w-48 text-xs px-3">
                <SelectValue placeholder="All Batches">
                  {(val: string | null) => {
                    if (!val || val === "ALL") return "All Academic Batches";
                    const found = batches.find((b) => b.id === val);
                    return found ? `Batch: ${found.name}` : "Selected Batch";
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Academic Batches</SelectItem>
                {batches.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="min-w-36">
            <Select
              value={selectedStatus}
              onValueChange={(val) => {
                setSelectedStatus((val as BillStatus | "ALL") || "ALL");
                setPage(1);
              }}
            >
              <SelectTrigger className="h-9 w-full min-w-36 text-xs px-3">
                <SelectValue placeholder="All Statuses">
                  {(val: string | null) => {
                    if (!val || val === "ALL") return "All Statuses";
                    if (val === "UNPAID") return "Status: Unpaid";
                    if (val === "PARTIAL") return "Status: Partial";
                    if (val === "PAID") return "Status: Paid";
                    return `Status: ${val}`;
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="UNPAID">Unpaid Only</SelectItem>
                <SelectItem value="PARTIAL">Partial Only</SelectItem>
                <SelectItem value="PAID">Paid Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Record Counter */}
        {meta && (
          <div className="text-xs text-muted-foreground whitespace-nowrap self-center">
            Total Bills:{" "}
            <span className="font-semibold text-foreground">{meta.total}</span>
          </div>
        )}
      </div>

      {/* 2. Roster Table */}
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
            {bills.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center gap-1 text-muted-foreground">
                    <CreditCard className="size-6 text-muted-foreground/60" />
                    <p className="text-sm font-medium">
                      No billing records found for this period.
                    </p>
                    <p className="text-xs">
                      Try adjusting the search query or month/batch filter.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              bills.map((bill) => {
                const student = bill.student || bill.enrollment?.student;
                const batch = bill.batch || bill.enrollment?.batch;
                const rollNumber =
                  student?.rollNumber || student?.studentProfile?.rollNumber;
                const classLevel =
                  student?.classLevel || student?.studentProfile?.classLevel;
                const canCollect = bill.dueAmount > 0 || bill.status !== "PAID";

                return (
                  <TableRow
                    key={bill.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    {/* Student Info */}
                    <TableCell>
                      <div className="space-y-0.5">
                        <div className="font-medium text-sm text-foreground flex items-center gap-1.5">
                          <UserIcon className="size-3.5 text-primary" />
                          <span>{student?.name || "Student"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {rollNumber && (
                            <span className="font-mono text-foreground font-semibold">
                              Roll #{rollNumber}
                            </span>
                          )}
                          {classLevel && <span>• {classLevel}</span>}
                        </div>
                      </div>
                    </TableCell>

                    {/* Batch */}
                    <TableCell>
                      <div className="inline-flex items-center gap-1 text-xs font-medium text-foreground bg-secondary/60 px-2 py-1 rounded-md">
                        <Layers className="size-3 text-muted-foreground" />
                        <span>{batch?.name || "—"}</span>
                      </div>
                    </TableCell>

                    {/* Monthly Fee */}
                    <TableCell className="text-right text-xs font-medium">
                      ৳{bill.monthlyFee.toLocaleString()}
                    </TableCell>

                    {/* Previous Due */}
                    <TableCell className="text-right text-xs">
                      {bill.previousDue > 0 ? (
                        <span className="text-amber-600 dark:text-amber-400 font-semibold">
                          ৳{bill.previousDue.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">৳0</span>
                      )}
                    </TableCell>

                    {/* Total Payable */}
                    <TableCell className="text-right text-xs font-bold text-foreground">
                      ৳{bill.totalPayable.toLocaleString()}
                    </TableCell>

                    {/* Paid Amount */}
                    <TableCell className="text-right text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      ৳{bill.paidAmount.toLocaleString()}
                    </TableCell>

                    {/* Due Amount */}
                    <TableCell className="text-right text-xs">
                      {bill.dueAmount > 0 ? (
                        <span className="text-rose-600 dark:text-rose-400 font-bold">
                          ৳{bill.dueAmount.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          ৳0
                        </span>
                      )}
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell className="text-center">
                      <BillStatusBadge status={bill.status} />
                    </TableCell>

                    {/* Action Button */}
                    <TableCell className="text-right">
                      {canCollect ? (
                        <Button
                          size="xs"
                          variant="outline"
                          className="gap-1 text-xs font-medium border-primary/30 text-primary hover:bg-primary/10"
                          onClick={() => handleOpenCollect(bill)}
                        >
                          <PlusCircle className="size-3.5" />
                          <span>Collect</span>
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground/80 italic pr-2">
                          Cleared
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {/* Pagination Footer */}
        {meta && (
          <StudentPagination
            meta={meta}
            onPageChange={setPage}
            onLimitChange={(lim) => {
              setLimit(lim);
              setPage(1);
            }}
            itemLabel="student bills"
          />
        )}
      </div>

      {/* Manual Collect Dialog */}
      <ManualCollectDialog
        bill={collectingBill}
        open={isCollectOpen}
        onOpenChange={setIsCollectOpen}
        billingMonth={month}
        billingYear={year}
      />
    </div>
  );
}
