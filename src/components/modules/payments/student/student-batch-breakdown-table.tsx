"use client";

import { Layers } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { StudentBillingBatchItem } from "@/types";
import { BillStatusBadge } from "../shared/payment-status-badge";

interface StudentBatchBreakdownTableProps {
  batches: StudentBillingBatchItem[];
}

export function StudentBatchBreakdownTable({
  batches,
}: StudentBatchBreakdownTableProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-base font-semibold text-foreground font-heading">
        Itemized Batch Breakdown
      </h2>

      <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-2xs">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="text-xs font-semibold">
                Academic Batch
              </TableHead>
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {!batches || batches.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-28 text-center">
                  <div className="flex flex-col items-center justify-center gap-1 text-muted-foreground">
                    <Layers className="size-5 text-muted-foreground/60" />
                    <p className="text-xs font-medium">
                      No active enrolled batches found for this billing period.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              batches.map((item) => (
                <TableRow
                  key={item.enrollmentId || item.batchId}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="font-medium text-xs text-foreground">
                    <div className="flex items-center gap-1.5">
                      <Layers className="size-3.5 text-primary shrink-0" />
                      <span>{item.batchName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-xs">
                    ৳{item.monthlyFee.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right text-xs">
                    {item.previousDue > 0 ? (
                      <span className="text-amber-600 dark:text-amber-400 font-semibold">
                        ৳{item.previousDue.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">৳0</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right text-xs font-semibold text-foreground">
                    ৳{item.totalPayable.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    ৳{item.paidAmount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right text-xs">
                    {item.dueAmount > 0 ? (
                      <span className="text-rose-600 dark:text-rose-400 font-bold">
                        ৳{item.dueAmount.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        ৳0
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <BillStatusBadge status={item.status} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
