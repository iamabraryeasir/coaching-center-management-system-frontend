"use client";

import { cn } from "cn";
import { ChevronRight, ClipboardList, UserPlus } from "lucide-react";
import Link from "next/link";
import type { ElementType } from "react";

import { useDashboardToday } from "@/hooks";

interface ActionRowProps {
  href: string;
  label: string;
  description: string;
  count: number;
  icon: ElementType;
}

function ActionRow({
  href,
  label,
  description,
  count,
  icon: Icon,
}: ActionRowProps) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-lg px-1 py-3 transition-colors hover:bg-muted/40"
    >
      <div className="flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-4" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{label}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "rounded-full px-2.5 py-0.5 text-sm font-bold tabular-nums",
            count > 0
              ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
              : "bg-muted text-muted-foreground",
          )}
        >
          {count}
        </span>
        <ChevronRight className="size-4 text-muted-foreground transition-colors group-hover:text-foreground" />
      </div>
    </Link>
  );
}

export function PendingActionsCard() {
  const { data: today } = useDashboardToday();
  const { pendingActions } = today;

  return (
    <div className="rounded-xl border border-border/80 bg-card p-6">
      {/* Header */}
      <div className="mb-4">
        <h3 className="font-heading text-base font-semibold text-foreground">
          Pending Actions
        </h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Items requiring your attention
        </p>
      </div>

      {/* Action rows */}
      <div className="space-y-1">
        <ActionRow
          href="/dashboard/admin/students?tab=pending"
          label="Student Applications"
          description="Awaiting approval"
          count={pendingActions.studentApplications}
          icon={UserPlus}
        />
        <ActionRow
          href="/dashboard/admin/batches?tab=pending"
          label="Enrollment Requests"
          description="Pending review"
          count={pendingActions.enrollmentRequests}
          icon={ClipboardList}
        />
      </div>
    </div>
  );
}
