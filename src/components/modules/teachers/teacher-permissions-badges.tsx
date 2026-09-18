import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TeacherPermission } from "@/types";

interface TeacherPermissionsBadgesProps {
  permissions?: (TeacherPermission | string)[] | null;
  className?: string;
}

export function TeacherPermissionsBadges({
  permissions,
  className,
}: TeacherPermissionsBadgesProps) {
  if (!permissions || permissions.length === 0) {
    return (
      <span className="text-xs text-muted-foreground italic">
        None Assigned
      </span>
    );
  }

  const normalized = permissions.map((p) => String(p).toUpperCase().trim());

  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {normalized.includes("MANAGE_ATTENDANCE") && (
        <Badge
          variant="outline"
          className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[11px] font-medium px-2 py-0"
        >
          Attendance
        </Badge>
      )}
      {normalized.includes("MANAGE_EXAMS") && (
        <Badge
          variant="outline"
          className="border-indigo-500/30 bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 text-[11px] font-medium px-2 py-0"
        >
          Exams & Marks
        </Badge>
      )}
      {normalized.includes("MANAGE_ROUTINES") && (
        <Badge
          variant="outline"
          className="border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-400 text-[11px] font-medium px-2 py-0"
        >
          Routines
        </Badge>
      )}
      {normalized
        .filter(
          (p) =>
            !["MANAGE_ATTENDANCE", "MANAGE_EXAMS", "MANAGE_ROUTINES"].includes(
              p,
            ),
        )
        .map((p) => (
          <Badge
            key={p}
            variant="outline"
            className="border-border text-foreground text-[11px] font-medium px-2 py-0"
          >
            {p.replace(/_/g, " ")}
          </Badge>
        ))}
    </div>
  );
}
