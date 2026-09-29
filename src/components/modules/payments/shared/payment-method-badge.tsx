import {
  Building2,
  CreditCard,
  DollarSign,
  Smartphone,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PaymentMethod } from "@/types";

interface PaymentMethodBadgeProps {
  method: PaymentMethod;
  className?: string;
}

export function PaymentMethodBadge({
  method,
  className,
}: PaymentMethodBadgeProps) {
  switch (method) {
    case "STRIPE":
      return (
        <Badge
          variant="outline"
          className={cn(
            "bg-indigo-500/10 text-indigo-600 border-indigo-500/20 dark:text-indigo-400 gap-1 text-xs font-medium",
            className,
          )}
        >
          <CreditCard className="size-3" />
          <span>Stripe</span>
        </Badge>
      );
    case "BKASH":
      return (
        <Badge
          variant="outline"
          className={cn(
            "bg-pink-500/10 text-pink-600 border-pink-500/20 dark:text-pink-400 gap-1 text-xs font-medium",
            className,
          )}
        >
          <Smartphone className="size-3" />
          <span>bKash</span>
        </Badge>
      );
    case "NAGAD":
      return (
        <Badge
          variant="outline"
          className={cn(
            "bg-orange-500/10 text-orange-600 border-orange-500/20 dark:text-orange-400 gap-1 text-xs font-medium",
            className,
          )}
        >
          <Smartphone className="size-3" />
          <span>Nagad</span>
        </Badge>
      );
    case "ROCKET":
      return (
        <Badge
          variant="outline"
          className={cn(
            "bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400 gap-1 text-xs font-medium",
            className,
          )}
        >
          <Wallet className="size-3" />
          <span>Rocket</span>
        </Badge>
      );
    case "BANK_TRANSFER":
      return (
        <Badge
          variant="outline"
          className={cn(
            "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400 gap-1 text-xs font-medium",
            className,
          )}
        >
          <Building2 className="size-3" />
          <span>Bank</span>
        </Badge>
      );
    default:
      return (
        <Badge
          variant="outline"
          className={cn(
            "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400 gap-1 text-xs font-medium",
            className,
          )}
        >
          <DollarSign className="size-3" />
          <span>Cash</span>
        </Badge>
      );
  }
}
