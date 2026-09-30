"use client";

import { Download, ExternalLink, FileText, Search } from "lucide-react";
import { useState } from "react";
import { getPaymentReceiptPdfUrl } from "@/api";
import { StudentPagination } from "@/components/modules/students";
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
import { useDebounce, usePaymentTransactions } from "@/hooks";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import type { PaymentMethod, PaymentStatus } from "@/types";
import { PaymentMethodBadge } from "./payment-method-badge";
import { PaymentTransactionsTableSkeleton } from "./payment-skeletons";
import { TransactionStatusBadge } from "./payment-status-badge";

interface PaymentTransactionsTableProps {
  studentId?: string; // If provided, filters to this student (e.g. for student portal)
  hideStudentColumn?: boolean;
}

export function PaymentTransactionsTable({
  studentId,
  hideStudentColumn = false,
}: PaymentTransactionsTableProps) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | "ALL">(
    "ALL",
  );
  const [selectedStatus, setSelectedStatus] = useState<PaymentStatus | "ALL">(
    "ALL",
  );

  const debouncedSearch = useDebounce(searchTerm, 400);

  const { data: transactionsResponse, isLoading } = usePaymentTransactions({
    studentId,
    page,
    limit,
    search: debouncedSearch || undefined,
    paymentMethod: selectedMethod !== "ALL" ? selectedMethod : undefined,
    status: selectedStatus !== "ALL" ? selectedStatus : undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  if (isLoading) {
    return (
      <PaymentTransactionsTableSkeleton hideStudentColumn={hideStudentColumn} />
    );
  }

  const transactions = transactionsResponse?.data || [];
  const meta = transactionsResponse?.meta;

  const handleDownloadReceipt = (transactionId: string) => {
    const url = getPaymentReceiptPdfUrl(transactionId, true);
    window.open(url, "_blank");
  };

  const handlePreviewReceipt = (transactionId: string) => {
    const url = getPaymentReceiptPdfUrl(transactionId, false);
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-4">
      {/* 1. Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border/80 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search */}
          <div className="relative min-w-55 sm:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              placeholder="Search receipt #, notes..."
              className="pl-8 h-9 text-xs"
            />
          </div>

          {/* Payment Method Filter */}
          <div className="min-w-40">
            <Select
              value={selectedMethod}
              onValueChange={(val) => {
                setSelectedMethod((val as PaymentMethod | "ALL") || "ALL");
                setPage(1);
              }}
            >
              <SelectTrigger className="h-9 w-full min-w-40 text-xs px-3">
                <SelectValue placeholder="All Channels">
                  {(val: string | null) => {
                    if (!val || val === "ALL") return "All Channels";
                    if (val === "STRIPE") return "Channel: Stripe";
                    if (val === "CASH") return "Channel: Cash";
                    if (val === "BKASH") return "Channel: bKash";
                    if (val === "NAGAD") return "Channel: Nagad";
                    if (val === "ROCKET") return "Channel: Rocket";
                    if (val === "BANK_TRANSFER") return "Channel: Bank";
                    return `Channel: ${val}`;
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Channels</SelectItem>
                <SelectItem value="STRIPE">Stripe (Online)</SelectItem>
                <SelectItem value="CASH">Cash</SelectItem>
                <SelectItem value="BKASH">bKash</SelectItem>
                <SelectItem value="NAGAD">Nagad</SelectItem>
                <SelectItem value="ROCKET">Rocket</SelectItem>
                <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="min-w-36">
            <Select
              value={selectedStatus}
              onValueChange={(val) => {
                setSelectedStatus((val as PaymentStatus | "ALL") || "ALL");
                setPage(1);
              }}
            >
              <SelectTrigger className="h-9 w-full min-w-36 text-xs px-3">
                <SelectValue placeholder="All Statuses">
                  {(val: string | null) => {
                    if (!val || val === "ALL") return "All Statuses";
                    if (val === "COMPLETED") return "Status: Completed";
                    if (val === "PENDING") return "Status: Pending";
                    if (val === "FAILED") return "Status: Failed";
                    return `Status: ${val}`;
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {meta && (
          <div className="text-xs text-muted-foreground whitespace-nowrap self-center">
            Total Transactions:{" "}
            <span className="font-semibold text-foreground">{meta.total}</span>
          </div>
        )}
      </div>

      {/* 2. Transactions Table */}
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
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={hideStudentColumn ? 7 : 8}
                  className="h-32 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-1 text-muted-foreground">
                    <FileText className="size-6 text-muted-foreground/60" />
                    <p className="text-sm font-medium">
                      No payment transactions recorded.
                    </p>
                    <p className="text-xs">
                      Transactions will automatically appear here upon online or
                      manual collection.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((trx) => {
                const formattedDate = formatDateTime(
                  trx.paidAt || trx.createdAt,
                );

                const studentName =
                  trx.studentName || trx.student?.name || "Student";
                const rollNumber = trx.student?.studentProfile?.rollNumber;
                const batchName =
                  trx.batchName || trx.enrollment?.batch?.name || "—";

                return (
                  <TableRow
                    key={trx.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    {/* Receipt Number */}
                    <TableCell className="font-mono text-xs font-semibold text-foreground">
                      <div className="flex items-center gap-1.5">
                        <FileText className="size-3.5 text-primary shrink-0" />
                        <span>
                          {trx.receiptNumber || `TRX-${trx.id.slice(0, 8)}`}
                        </span>
                      </div>
                    </TableCell>

                    {/* Date */}
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {formattedDate}
                    </TableCell>

                    {/* Student */}
                    {!hideStudentColumn && (
                      <TableCell>
                        <div className="text-xs font-medium text-foreground">
                          {studentName}
                        </div>
                        {rollNumber && (
                          <div className="text-[11px] text-muted-foreground font-mono">
                            Roll: {rollNumber}
                          </div>
                        )}
                      </TableCell>
                    )}

                    {/* Batch */}
                    <TableCell className="text-xs text-muted-foreground">
                      {batchName}
                    </TableCell>

                    {/* Amount */}
                    <TableCell className="text-right text-xs font-bold text-foreground">
                      {formatCurrency(trx.amount)}
                    </TableCell>

                    {/* Payment Channel */}
                    <TableCell className="text-center">
                      <PaymentMethodBadge method={trx.paymentMethod} />
                    </TableCell>

                    {/* Status */}
                    <TableCell className="text-center">
                      <TransactionStatusBadge status={trx.status} />
                    </TableCell>

                    {/* Action PDF */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="icon-xs"
                          variant="ghost"
                          title="Preview Receipt PDF"
                          onClick={() => handlePreviewReceipt(trx.id)}
                        >
                          <ExternalLink className="size-3.5 text-muted-foreground hover:text-foreground" />
                        </Button>
                        <Button
                          size="xs"
                          variant="outline"
                          className="gap-1 text-xs font-medium"
                          onClick={() => handleDownloadReceipt(trx.id)}
                        >
                          <Download className="size-3" />
                          <span>PDF</span>
                        </Button>
                      </div>
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
            itemLabel="transactions"
          />
        )}
      </div>
    </div>
  );
}
