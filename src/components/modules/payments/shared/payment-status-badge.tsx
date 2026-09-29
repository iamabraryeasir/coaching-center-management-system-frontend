import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { BillStatus, PaymentStatus } from "@/types";

interface BillStatusBadgeProps {
  status: BillStatus;
  className?: string;
}

export function BillStatusBadge({ status, className }: BillStatusBadgeProps) {
  switch (status) {
    case "PAID":
      return (
        <Badge
          variant="outline"
          className={cn(
            "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400 font-semibold px-2 py-0.5 text-xs",
            className,
          )}
        >
          PAID
        </Badge>
      );
    case "PARTIAL":
      return (
        <Badge
          variant="outline"
          className={cn(
            "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400 font-semibold px-2 py-0.5 text-xs",
            className,
          )}
        >
          PARTIAL
        </Badge>
      );
    default:
      return (
        <Badge
          variant="outline"
          className={cn(
            "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400 font-semibold px-2 py-0.5 text-xs",
            className,
          )}
        >
          UNPAID
        </Badge>
      );
  }
}

interface TransactionStatusBadgeProps {
  status: PaymentStatus;
  className?: string;
}

export function TransactionStatusBadge({
  status,
  className,
}: TransactionStatusBadgeProps) {
  switch (status) {
    case "COMPLETED":
      return (
        <Badge
          variant="outline"
          className={cn(
            "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400 font-medium px-2 py-0.5 text-xs",
            className,
          )}
        >
          Completed
        </Badge>
      );
    case "PENDING":
      return (
        <Badge
          variant="outline"
          className={cn(
            "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400 font-medium px-2 py-0.5 text-xs",
            className,
          )}
        >
          Pending
        </Badge>
      );
    case "FAILED":
      return (
        <Badge
          variant="outline"
          className={cn(
            "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400 font-medium px-2 py-0.5 text-xs",
            className,
          )}
        >
          Failed
        </Badge>
      );
    case "REFUNDED":
      return (
        <Badge
          variant="outline"
          className={cn(
            "bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400 font-medium px-2 py-0.5 text-xs",
            className,
          )}
        >
          Refunded
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className={cn("text-xs", className)}>
          {status}
        </Badge>
      );
  }
}
