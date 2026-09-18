import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { BatchStatus } from "@/types";

interface BatchStatusBadgeProps {
  status: BatchStatus;
  className?: string;
}

export function BatchStatusBadge({ status, className }: BatchStatusBadgeProps) {
  switch (status) {
    case "ONGOING":
      return (
        <Badge
          variant="outline"
          className={cn(
            "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-medium",
            className,
          )}
        >
          Ongoing
        </Badge>
      );
    case "UPCOMING":
      return (
        <Badge
          variant="outline"
          className={cn(
            "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-400 font-medium",
            className,
          )}
        >
          Upcoming
        </Badge>
      );
    case "COMPLETED":
      return (
        <Badge
          variant="outline"
          className={cn(
            "border-muted-foreground/30 bg-muted/60 text-muted-foreground font-medium",
            className,
          )}
        >
          Completed
        </Badge>
      );
    case "CANCELLED":
      return (
        <Badge variant="destructive" className={cn("font-medium", className)}>
          Cancelled
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
