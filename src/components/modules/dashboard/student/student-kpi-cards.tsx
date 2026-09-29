"use client";

import { CalendarCheck, CreditCard, GraduationCap, Layers } from "lucide-react";
import Link from "next/link";
import { useStudentDashboard } from "@/hooks";
import { cn } from "@/lib/utils";

export function StudentKpiCards() {
  const { data: dashboard } = useStudentDashboard();
  const kpis = dashboard.kpis;
  const billing = dashboard.billing;

  const enrolledBatchesCount = kpis?.enrolledBatchesCount ?? 0;
  const attendanceRate =
    kpis?.attendanceRate !== undefined && kpis?.attendanceRate !== null
      ? Number(kpis.attendanceRate)
      : 100;
  const averageGpa =
    kpis?.averageGpa !== undefined && kpis?.averageGpa !== null
      ? Number(kpis.averageGpa)
      : 0;
  const totalExamsEvaluated = kpis?.totalExamsEvaluated ?? 0;

  const totalDue = billing?.totalDue ?? kpis?.totalDue ?? 0;
  const isPaid = totalDue === 0;

  const cards = [
    {
      title: "Enrolled Batches",
      value: enrolledBatchesCount,
      subtext: `${enrolledBatchesCount} Active Cohort${enrolledBatchesCount === 1 ? "" : "s"}`,
      icon: Layers,
      colorClass: "bg-primary/10 text-primary",
      href: "/dashboard/student/batches",
    },
    {
      title: "Attendance Standing",
      value: `${attendanceRate.toFixed(1)}%`,
      subtext:
        kpis?.totalClassesMarked !== undefined
          ? `${kpis.presentCount ?? 0} of ${kpis.totalClassesMarked} classes present`
          : "Verified presence standing",
      icon: CalendarCheck,
      colorClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      href: "/dashboard/student/attendance",
    },
    {
      title: "Cumulative GPA",
      value: totalExamsEvaluated > 0 ? averageGpa.toFixed(2) : "N/A",
      subtext:
        totalExamsEvaluated > 0
          ? `Across ${totalExamsEvaluated} evaluated exam${totalExamsEvaluated === 1 ? "" : "s"}`
          : "No published test results",
      icon: GraduationCap,
      colorClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
      href: "/dashboard/student/exams",
    },
    {
      title: "Tuition Status",
      value: isPaid ? "PAID" : `৳ ${Number(totalDue).toLocaleString()}`,
      subtext: isPaid ? "No pending payments" : "Outstanding monthly dues",
      icon: CreditCard,
      colorClass: isPaid
        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        : "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      href: "/dashboard/student/payments",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Link
            key={card.title}
            href={card.href}
            className="group rounded-xl border border-border/80 bg-card p-4 sm:p-5 shadow-2xs space-y-2.5 transition-all hover:border-primary/40 hover:shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors truncate">
                {card.title}
              </span>
              <div
                className={cn(
                  "size-8 rounded-lg flex items-center justify-center shrink-0",
                  card.colorClass,
                )}
              >
                <Icon className="size-4" />
              </div>
            </div>

            <p className="font-heading text-xl sm:text-2xl font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">
              {card.value}
            </p>

            <p className="text-xs text-muted-foreground truncate">
              {card.subtext}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
