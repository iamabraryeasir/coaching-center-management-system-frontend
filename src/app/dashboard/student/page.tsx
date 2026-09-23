"use client";

import {
  ArrowRight,
  CalendarDays,
  CreditCard,
  GraduationCap,
  Layers,
  Sparkles,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export default function StudentDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* 1. Welcome Hero Banner */}
      <div className="rounded-2xl border border-border/80 bg-linear-to-br from-card via-card to-primary/5 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
              <Sparkles className="size-3" />
              <span>Student Workspace</span>
            </div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
              Welcome back, {user?.name || "Student"}!
            </h2>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground pt-0.5">
              {user?.studentProfile?.rollNumber && (
                <span className="font-mono font-medium text-foreground">
                  Roll: {user.studentProfile.rollNumber}
                </span>
              )}
              {user?.studentProfile?.classLevel && (
                <>
                  <span>•</span>
                  <span>{user.studentProfile.classLevel}</span>
                </>
              )}
              {user?.studentProfile?.institutionName && (
                <>
                  <span>•</span>
                  <span>{user.studentProfile.institutionName}</span>
                </>
              )}
            </div>
          </div>

          {/* Quick Schedule CTA Button */}
          <Link href="/dashboard/student/routines">
            <Button size="sm" className="gap-2 shadow-2xs font-medium">
              <CalendarDays className="size-4" />
              <span>View Class Timetable</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Academic & Billing Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {/* Enrolled Batches */}
        <Link
          href="/dashboard/student/batches"
          className="group rounded-xl border border-border/80 bg-card p-4 shadow-2xs space-y-2 transition-all hover:border-primary/40 hover:shadow-xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">
              My Batches
            </span>
            <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Layers className="size-4" />
            </div>
          </div>
          <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
            Enrolled Classes
          </p>
          <span className="text-[11px] text-muted-foreground flex items-center gap-1 pt-1">
            <span>Explore course materials</span>
            <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>

        {/* Class Routines */}
        <Link
          href="/dashboard/student/routines"
          className="group rounded-xl border border-border/80 bg-card p-4 shadow-2xs space-y-2 transition-all hover:border-primary/40 hover:shadow-xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">
              Class Routines
            </span>
            <div className="size-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <CalendarDays className="size-4" />
            </div>
          </div>
          <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
            Weekly Schedule
          </p>
          <span className="text-[11px] text-muted-foreground flex items-center gap-1 pt-1">
            <span>View timetable slots</span>
            <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>

        {/* Attendance Summary */}
        <Link
          href="/dashboard/student/attendance"
          className="group rounded-xl border border-border/80 bg-card p-4 shadow-2xs space-y-2 transition-all hover:border-primary/40 hover:shadow-xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">
              My Attendance
            </span>
            <div className="size-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <UserCheck className="size-4" />
            </div>
          </div>
          <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
            Attendance Log
          </p>
          <span className="text-[11px] text-muted-foreground flex items-center gap-1 pt-1">
            <span>Track presence records</span>
            <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>

        {/* Exams & Results */}
        <Link
          href="/dashboard/student/exams"
          className="group rounded-xl border border-border/80 bg-card p-4 shadow-2xs space-y-2 transition-all hover:border-primary/40 hover:shadow-xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">
              Exams & Results
            </span>
            <div className="size-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <GraduationCap className="size-4" />
            </div>
          </div>
          <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
            Report Cards
          </p>
          <span className="text-[11px] text-muted-foreground flex items-center gap-1 pt-1">
            <span>View grades & ranks</span>
            <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>

        {/* Fees & Payments */}
        <Link
          href="/dashboard/student/payments"
          className="group rounded-xl border border-border/80 bg-card p-4 shadow-2xs space-y-2 transition-all hover:border-primary/40 hover:shadow-xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">
              Fees & Payments
            </span>
            <div className="size-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <CreditCard className="size-4" />
            </div>
          </div>
          <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
            Tuition & Receipts
          </p>
          <span className="text-[11px] text-muted-foreground flex items-center gap-1 pt-1">
            <span>Online Stripe Checkout</span>
            <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>
      </div>
    </div>
  );
}
