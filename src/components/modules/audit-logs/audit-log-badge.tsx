import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AuditActionBadgeProps {
  action: string;
  className?: string;
}

export function AuditActionBadge({ action, className }: AuditActionBadgeProps) {
  const upper = action.toUpperCase();

  let colorClasses = "bg-muted/80 text-muted-foreground border-border/50";

  if (
    upper.includes("CREATE") ||
    upper.includes("REGISTER") ||
    upper.includes("ADD") ||
    upper.includes("ENROLL")
  ) {
    colorClasses =
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20";
  } else if (
    upper.includes("UPDATE") ||
    upper.includes("EDIT") ||
    upper.includes("PATCH") ||
    upper.includes("CHANGE")
  ) {
    colorClasses =
      "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20";
  } else if (
    upper.includes("DELETE") ||
    upper.includes("REMOVE") ||
    upper.includes("REJECT") ||
    upper.includes("UNPUBLISH") ||
    upper.includes("BLOCK")
  ) {
    colorClasses =
      "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20";
  } else if (
    upper.includes("LOGIN") ||
    upper.includes("LOGOUT") ||
    upper.includes("AUTH") ||
    upper.includes("SESSION")
  ) {
    colorClasses =
      "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20";
  } else if (
    upper.includes("PUBLISH") ||
    upper.includes("APPROVE") ||
    upper.includes("MARKS")
  ) {
    colorClasses =
      "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20";
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-mono text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5",
        colorClasses,
        className,
      )}
    >
      {action}
    </Badge>
  );
}

interface AuditStatusBadgeProps {
  status?: string | null;
  className?: string;
}

export function AuditStatusBadge({ status, className }: AuditStatusBadgeProps) {
  if (!status) return null;

  const upper = status.toUpperCase();

  let colorClasses = "bg-muted/80 text-muted-foreground border-border/50";

  if (upper === "SUCCESS" || upper === "OK" || upper === "200") {
    colorClasses =
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20";
  } else if (
    upper === "FAILED" ||
    upper === "ERROR" ||
    upper === "FAILURE" ||
    upper.startsWith("4") ||
    upper.startsWith("5")
  ) {
    colorClasses =
      "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20";
  } else if (upper === "PENDING") {
    colorClasses =
      "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20";
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        "text-[10px] font-semibold uppercase px-1.5 py-0.5",
        colorClasses,
        className,
      )}
    >
      {status}
    </Badge>
  );
}

interface AuditEntityBadgeProps {
  entity?: string | null;
  className?: string;
}

export function AuditEntityBadge({ entity, className }: AuditEntityBadgeProps) {
  if (!entity) {
    return <span className="text-muted-foreground text-xs">—</span>;
  }

  return (
    <span
      className={cn(
        "inline-flex items-center text-xs font-medium text-foreground bg-muted/60 px-2 py-0.5 rounded border border-border/40",
        className,
      )}
    >
      {entity}
    </span>
  );
}
