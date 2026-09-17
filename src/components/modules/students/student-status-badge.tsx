import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { UserStatus } from "@/types";

interface StudentStatusBadgeProps {
  status: UserStatus;
  className?: string;
}

export function StudentStatusBadge({
  status,
  className,
}: StudentStatusBadgeProps) {
  switch (status) {
    case "ACTIVE":
      return (
        <Badge
          variant="outline"
          className={cn(
            "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
            className,
          )}
        >
          Active
        </Badge>
      );
    case "PENDING_ACTIVATION":
      return (
        <Badge
          variant="outline"
          className={cn(
            "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
            className,
          )}
        >
          Pending
        </Badge>
      );
    case "INACTIVE":
      return (
        <Badge
          variant="outline"
          className={cn(
            "border-muted-foreground/30 bg-muted/60 text-muted-foreground",
            className,
          )}
        >
          Inactive
        </Badge>
      );
    case "BLOCKED":
      return (
        <Badge variant="destructive" className={className}>
          Blocked
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className={className}>
          {status}
        </Badge>
      );
  }
}
