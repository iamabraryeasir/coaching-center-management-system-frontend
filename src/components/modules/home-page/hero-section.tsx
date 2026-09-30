"use client";

import {
  ArrowRight,
  Award,
  CalendarCheck,
  CalendarDays,
  CreditCard,
  KeyRound,
  LayoutDashboard,
  LogIn,
  ShieldCheck,
  Sparkles,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/hooks";
import { cn } from "@/lib/utils";

const CORE_FEATURE_CARDS = [
  {
    icon: KeyRound,
    title: "Student Google Auth & Onboarding Flow",
    badge: "Auth Rule",
    description:
      "Google OAuth is strictly reserved for students. First-time Google sign-in automatically routes the student into onboarding, creating a Pending Student profile for administrative review and approval.",
    tagline: "Student-only OAuth • Pending Review Queue",
  },
  {
    icon: ShieldCheck,
    title: "Role-Based Portals & Permission Delegation",
    badge: "Access Control",
    description:
      "Dedicated portals for Admins, Teachers, and Students. Scoped teacher permissions (Manage Attendance, Manage Exams, Manage Routines) allow faculty to take classroom and fellow staff attendance safely.",
    tagline: "3 Dedicated Portals • Faculty Delegation",
  },
  {
    icon: CalendarCheck,
    title: "Daily Attendance & Once-Per-Day Lock",
    badge: "Tamper-Proof",
    description:
      "Batch student sheets and faculty attendance with 5 status markers and duty remarks. A strict once-per-day lock secures records after submission, locking subsequent views into read-only audit mode.",
    tagline: "Single Daily Submission • Locked Audit View",
  },
  {
    icon: Award,
    title: "Automated Exams, GPA & Email Delivery",
    badge: "Grading Engine",
    description:
      "Bulk exam marks entry automatically calculates Letter Grades (A+ to F), GPA (5.00 to 0.00), and class rankings, with integrated server-side email report dispatch and branded PDF downloads.",
    tagline: "Instant GPA Math • Automated Email Dispatch",
  },
  {
    icon: CreditCard,
    title: "Stripe Online Checkout & MFS Ledger",
    badge: "Financial Billing",
    description:
      "Students pay tuition online via Stripe hosted checkout, while administrators manage an offline Cash/MFS ledger, calculate opening arrears, and generate signed PDF transaction receipts.",
    tagline: "Stripe Webhooks • Offline Cash/MFS Receipts",
  },
  {
    icon: CalendarDays,
    title: "Weekly Routines & Conflict-Free Timetable",
    badge: "Smart Scheduling",
    description:
      "Organized Saturday–Friday weekly schedule grid preventing room overlaps and teacher double-booking, with instant batch, teacher, and student printable PDF routine exports.",
    tagline: "7-Day Sat–Fri Cycle • Conflict Prevention",
  },
];

export default function HeroSection() {
  const { isAuthenticated, user, isLoading } = useAuth();

  return (
    <div className="relative isolate overflow-hidden bg-background">
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-32 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-72"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%-12rem)] aspect-1155/678 w-2xl -translate-x-1/2 rotate-30 bg-linear-to-tr from-primary/25 via-primary/10 to-transparent opacity-60 sm:left-[calc(50%-24rem)] sm:w-6xl"
        />
      </div>

      {/* Hero Header Area */}
      <div className="mx-auto max-w-5xl px-4 pt-12 pb-16 sm:pt-20 sm:pb-20 lg:pt-24 lg:pb-24 text-center">
        {/* Status Pill Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary shadow-2xs backdrop-blur-xs mb-6">
          <Sparkles className="size-3.5" />
          <span>Coaching Center Management System</span>
          <span className="text-muted-foreground/60">•</span>
          <span className="text-muted-foreground font-normal">
            Intelligent Platform
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1] text-balance mb-6">
          Unified Operations &amp; Academic Platform for{" "}
          <span className="bg-linear-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
            Modern Coaching
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto text-balance mb-8">
          Manage student admissions, daily attendance with once-per-day locks,
          automated GPA merit lists, class routines, and Stripe tuition payments
          with role-based precision.
        </p>

        {/* Call to Actions (CTAs) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {isLoading ? (
            <div className="h-11 w-44 animate-pulse rounded-xl bg-muted" />
          ) : isAuthenticated && user ? (
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <Link
                href="/dashboard"
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" }),
                  "w-full sm:w-auto rounded-xl gap-2 font-semibold shadow-md shadow-primary/20 px-7 h-11 transition-transform active:scale-98",
                )}
              >
                <LayoutDashboard className="size-4" />
                <span>Go to Dashboard</span>
                <ArrowRight className="size-4" />
              </Link>

              <Link
                href="/onboard-student"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "w-full sm:w-auto rounded-xl gap-2 font-semibold border-border/80 px-6 h-11",
                )}
              >
                <UserPlus className="size-4 text-primary" />
                <span>New Student Onboarding</span>
              </Link>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" }),
                  "w-full sm:w-auto rounded-xl gap-2 font-semibold shadow-md shadow-primary/20 px-7 h-11 transition-transform active:scale-98",
                )}
              >
                <LogIn className="size-4" />
                <span>Sign In to Portal</span>
              </Link>

              <Link
                href="/onboard-student"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "w-full sm:w-auto rounded-xl gap-2 font-semibold border-border/80 px-6 h-11",
                )}
              >
                <UserPlus className="size-4 text-primary" />
                <span>Student Self-Onboarding</span>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Feature & Business Logic Cards Section */}
      <div className="border-t border-border/60 bg-muted/20 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-12 sm:mb-16 space-y-3">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground text-balance">
              Engineered Features &amp; Custom Business Logic
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed text-balance">
              Every workflow is enforced by backend state machines, strict
              validation rules, and role-based permissions.
            </p>
          </div>

          {/* 6 Feature / Business Logic Cards Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {CORE_FEATURE_CARDS.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.title}
                  className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-6 shadow-2xs transition-all duration-200 hover:-translate-y-1 hover:border-border hover:shadow-md"
                >
                  <div className="space-y-3.5">
                    {/* Icon & Badge */}
                    <div className="flex items-center justify-between">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-2xs group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Icon className="size-5" />
                      </div>

                      <span className="rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                        {card.badge}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-heading text-base font-bold text-foreground">
                      {card.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {card.description}
                    </p>
                  </div>

                  {/* Footer Tagline */}
                  <div className="mt-5 pt-3 border-t border-border/60 text-[11px] font-medium text-primary">
                    {card.tagline}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
