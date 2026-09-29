"use client";

import { Award, BookOpen, CheckCircle2, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

interface StudentExamsStatsRibbonProps {
  totalExams: number;
  gpaAverage: number;
  overallPassRate: number;
  passedCount: number;
  bestRank?: number | null;
}

export function StudentExamsStatsRibbon({
  totalExams,
  gpaAverage,
  overallPassRate,
  passedCount,
  bestRank,
}: StudentExamsStatsRibbonProps) {
  const formattedGpa = gpaAverage > 0 ? `${gpaAverage.toFixed(2)} / 5.00` : "—";
  const passRateText = totalExams > 0 ? `${Math.round(overallPassRate)}%` : "—";
  const rankText = bestRank && bestRank > 0 ? `#${bestRank}` : "—";

  const cards = [
    {
      title: "Average GPA",
      value: formattedGpa,
      subtext: gpaAverage >= 4.0 ? "Excellent standing" : "Academic score",
      icon: GraduationCap,
      badgeText:
        gpaAverage >= 4.0 ? "A+" : gpaAverage >= 3.0 ? "Good" : "Normal",
      badgeColor: "bg-primary/10 text-primary border-primary/20",
      iconColor: "bg-primary/10 text-primary",
    },
    {
      title: "Total Exams",
      value: totalExams,
      subtext: `${totalExams} evaluated terms`,
      icon: BookOpen,
      badgeText: "Conducted",
      badgeColor: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      iconColor: "bg-blue-500/10 text-blue-600",
    },
    {
      title: "Pass Rate",
      value: passRateText,
      subtext: `${passedCount} of ${totalExams} passed`,
      icon: CheckCircle2,
      badgeText: passRateText,
      badgeColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      iconColor: "bg-emerald-500/10 text-emerald-600",
    },
    {
      title: "Top Batch Rank",
      value: rankText,
      subtext: bestRank ? "Best position achieved" : "Awaiting ranking",
      icon: Award,
      badgeText: bestRank === 1 ? "Topper" : rankText,
      badgeColor: "bg-amber-500/10 text-amber-600 border-amber-500/20",
      iconColor: "bg-amber-500/10 text-amber-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="rounded-xl border border-border/70 bg-card p-3.5 sm:p-4 shadow-2xs transition-all hover:border-border hover:shadow-xs space-y-2 sm:space-y-2.5"
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
