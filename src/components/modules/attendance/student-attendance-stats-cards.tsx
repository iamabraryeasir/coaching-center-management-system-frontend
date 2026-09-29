"use client";

import {
  CalendarDays,
  CheckCircle2,
  Clock,
  FileText,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StudentAttendanceStatsCardsProps {
  totalSessions: number;
  presentCount: number;
  lateCount: number;
  absentCount: number;
  excusedCount?: number;
  leaveCount?: number;
}

export function StudentAttendanceStatsCards({
  totalSessions,
  presentCount,
  lateCount,
  absentCount,
  excusedCount = 0,
  leaveCount = 0,
}: StudentAttendanceStatsCardsProps) {
  const leavesTotal = excusedCount + leaveCount;

  const calculatePct = (count: number) => {
    if (totalSessions <= 0) return "0%";
    return `${Math.round((count / totalSessions) * 100)}%`;
  };

  const cards = [
    {
      title: "Total Classes",
      value: totalSessions,
      subtext: "Conducted to date",
      icon: CalendarDays,
      badgeText: "100%",
      badgeColor: "bg-primary/10 text-primary border-primary/20",
      iconColor: "bg-primary/10 text-primary",
    },
    {
      title: "Present",
      value: presentCount,
      subtext: `${calculatePct(presentCount)} of lectures`,
      icon: CheckCircle2,
      badgeText: calculatePct(presentCount),
      badgeColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      iconColor: "bg-emerald-500/10 text-emerald-600",
    },
    {
      title: "Late Arrivals",
      value: lateCount,
      subtext: `${calculatePct(lateCount)} of lectures`,
      icon: Clock,
      badgeText: calculatePct(lateCount),
      badgeColor: "bg-amber-500/10 text-amber-600 border-amber-500/20",
      iconColor: "bg-amber-500/10 text-amber-600",
    },
    {
      title: "Absent",
      value: absentCount,
      subtext: `${calculatePct(absentCount)} missed`,
      icon: XCircle,
      badgeText: calculatePct(absentCount),
      badgeColor: "bg-rose-500/10 text-rose-600 border-rose-500/20",
      iconColor: "bg-rose-500/10 text-rose-600",
    },
    {
      title: "Leaves / Excused",
      value: leavesTotal,
      subtext: `${excusedCount} excused · ${leaveCount} leaves`,
      icon: FileText,
      badgeText: calculatePct(leavesTotal),
      badgeColor: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      iconColor: "bg-blue-500/10 text-blue-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={cn(
              "rounded-xl border border-border/70 bg-card p-3.5 sm:p-4 shadow-2xs transition-all hover:border-border hover:shadow-xs space-y-2 sm:space-y-2.5",
              index === 4 && "col-span-2 sm:col-span-1 md:col-span-1",
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground truncate">
                {card.title}
              </span>
              <div
                className={cn(
                  "size-7 sm:size-8 rounded-lg flex items-center justify-center shrink-0",
                  card.iconColor,
                )}
              >
                <Icon className="size-3.5 sm:size-4" />
              </div>
            </div>

            <div className="flex items-baseline justify-between gap-1">
              <span className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {card.value}
              </span>
              <span
                className={cn(
                  "rounded-full border px-1.5 py-0.5 text-[10px] font-semibold tabular-nums",
                  card.badgeColor,
                )}
              >
                {card.badgeText}
              </span>
            </div>

            <p className="text-[11px] text-muted-foreground truncate">
              {card.subtext}
            </p>
          </div>
        );
      })}
    </div>
  );
}
