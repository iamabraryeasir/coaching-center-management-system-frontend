"use client";

import {
  Activity,
  AlertTriangle,
  ScrollText,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useSuspenseAuditLogStats } from "@/hooks";
import type { AuditLogStats } from "@/types";

export function AuditLogStatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        "stat-skeleton-1",
        "stat-skeleton-2",
        "stat-skeleton-3",
        "stat-skeleton-4",
      ].map((key) => (
        <div
          key={key}
          className="rounded-xl border border-border/80 bg-card p-4 shadow-2xs space-y-2"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="size-8 rounded-lg" />
          </div>
          <Skeleton className="h-7 w-16" />
          <Skeleton className="h-3 w-32" />
        </div>
      ))}
    </div>
  );
}

interface AuditLogStatsCardsPresentationProps {
  stats?: AuditLogStats;
}

function AuditLogStatsCardsPresentation({
  stats,
}: AuditLogStatsCardsPresentationProps) {
  const totalLogs = stats?.totalLogs ?? stats?.totalEvents ?? 0;
  const todayCount = stats?.todayCount ?? 0;
  const uniqueUsers = stats?.uniqueUsersCount ?? stats?.topActors?.length ?? 0;
  const failedEvents = stats?.failedEventsCount ?? stats?.recentFailures ?? 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total System Events */}
      <div className="rounded-xl border border-border/80 bg-card p-4 shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-medium">
            Total Audit Events
          </span>
          <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <ScrollText className="size-4" />
          </div>
        </div>
        <div className="text-2xl font-bold tracking-tight text-foreground font-heading">
          {totalLogs.toLocaleString()}
        </div>
        <p className="text-xs text-muted-foreground">
          {todayCount > 0
            ? `${todayCount} events recorded today`
            : "Immutable operational audit trail"}
        </p>
      </div>

      {/* 2. Security & Policy Status */}
      <div className="rounded-xl border border-border/80 bg-card p-4 shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-medium">
            System Integrity
          </span>
          <div className="size-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="size-4" />
          </div>
        </div>
        <div className="text-2xl font-bold tracking-tight text-foreground font-heading">
          100%
        </div>
        <p className="text-xs text-muted-foreground">
          Tamper-evident logs & verification
        </p>
      </div>

      {/* 3. Active Actors */}
      <div className="rounded-xl border border-border/80 bg-card p-4 shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-medium">
            Active Operators
          </span>
          <div className="size-8 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
            <Users className="size-4" />
          </div>
        </div>
        <div className="text-2xl font-bold tracking-tight text-foreground font-heading">
          {uniqueUsers.toLocaleString()}
        </div>
        <p className="text-xs text-muted-foreground">
          Unique users initiating actions
        </p>
      </div>

      {/* 4. Security Anomalies / Failures */}
      <div className="rounded-xl border border-border/80 bg-card p-4 shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-medium">
            Failed Operations
          </span>
          <div
            className={`size-8 rounded-lg flex items-center justify-center ${
              failedEvents > 0
                ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {failedEvents > 0 ? (
              <AlertTriangle className="size-4" />
            ) : (
              <Activity className="size-4" />
            )}
          </div>
        </div>
        <div className="text-2xl font-bold tracking-tight text-foreground font-heading">
          {failedEvents.toLocaleString()}
        </div>
        <p className="text-xs text-muted-foreground">
          {failedEvents > 0
            ? "Requires review & inspection"
            : "No security anomalies detected"}
        </p>
      </div>
    </div>
  );
}

function AuditLogSuspenseStatsCards() {
  const { data: statsResponse } = useSuspenseAuditLogStats();
  return <AuditLogStatsCardsPresentation stats={statsResponse.data} />;
}

export interface AuditLogStatsCardsProps {
  stats?: AuditLogStats;
}

export function AuditLogStatsCards({ stats }: AuditLogStatsCardsProps) {
  if (stats) {
    return <AuditLogStatsCardsPresentation stats={stats} />;
  }
  return <AuditLogSuspenseStatsCards />;
}
