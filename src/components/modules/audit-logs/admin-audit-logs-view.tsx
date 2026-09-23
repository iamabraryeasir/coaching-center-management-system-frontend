"use client";

import { ScrollText, ShieldAlert } from "lucide-react";
import { Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import {
  AuditLogStatsCards,
  AuditLogStatsCardsSkeleton,
} from "./audit-log-stats-cards";
import { AuditLogsTable } from "./audit-logs-table";

export function AdminAuditLogsView() {
  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <ScrollText className="size-4" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground font-heading">
              System Audit Logs
            </h1>
            <Badge
              variant="outline"
              className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 text-xs hidden sm:inline-flex items-center gap-1 font-medium"
            >
              <ShieldAlert className="size-3" /> Immutable Audit Trail
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Explore system-wide operational activity logs, track administrative
            actions, and inspect security events.
          </p>
        </div>
      </div>

      {/* Declarative Suspense Boundary for Metrics */}
      <Suspense fallback={<AuditLogStatsCardsSkeleton />}>
        <AuditLogStatsCards />
      </Suspense>

      {/* Main Filterable Logs Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground font-heading">
            Activity Trail Explorer
          </h2>
        </div>
        <AuditLogsTable />
      </div>
    </div>
  );
}
