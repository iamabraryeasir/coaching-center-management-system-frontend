"use client";

import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  LogIn,
  ShieldCheck,
  UserCheck,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { useAuth } from "@/hooks";
import { cn } from "@/lib/utils";

const CORE_CAPABILITIES = [
  {
    icon: ShieldCheck,
    title: "Role-Based Portals",
    description:
      "Dedicated portals for Admins, Teachers, and Students with granular delegation.",
  },
  {
    icon: CalendarCheck,
    title: "Daily Attendance Sheets",
    description:
      "Batch-wise student tracking and verified once-per-day staff attendance.",
  },
  {
    icon: GraduationCap,
    title: "Exams & Merit Lists",
    description:
      "Automated letter grading, GPA evaluation, batch rankings, and PDF report cards.",
  },
  {
    icon: CreditCard,
    title: "Tuition & Payment Ledger",
    description:
      "Stripe online checkout, manual cash/MFS collection, and automated fee sheets.",
  },
];

const PORTAL_PREVIEWS = [
  {
    id: "admin",
    role: "Admin Control",
    badge: "Full Access",
    tagline: "Total institutional visibility & financial oversight",
    icon: ShieldCheck,
    features: [
      "Batch Lifecycle & Schedule Management",
      "Teacher Permissions Delegation",
      "Monthly Fee Sheets & Stripe Transactions",
      "Student Admissions & Status Control",
    ],
    metric: { value: "100%", label: "System Automation" },
  },
  {
    id: "teacher",
    role: "Teacher Workspace",
    badge: "Faculty Suite",
    tagline: "Classroom instruction, attendance & grading tools",
    icon: UserCheck,
    features: [
      "Daily Batch Student Attendance Sheets",
      "Bulk Exam Marks & Grade Evaluation",
      "Weekly Routine & Subject Scheduling",
      "Staff Daily Attendance Check-In",
    ],
    metric: { value: "Zero", label: "Paper Attendance" },
  },
  {
    id: "student",
    role: "Student Portal",
    badge: "Self-Service",
    tagline: "Academic progress, schedules & instant fee clearance",
    icon: GraduationCap,
    features: [
      "Enrolled Batches & Routine Schedules",
      "Historical Attendance Analytics",
      "Exam Merit Rank & Report Cards (PDF)",
      "Instant Tuition Payment via Stripe",
    ],
    metric: { value: "24/7", label: "Mobile Access" },
  },
];

export default function HeroSection() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const activePortal = PORTAL_PREVIEWS[activeTab];
  const ActiveIcon = activePortal.icon;

  return (
    <section className="relative isolate overflow-hidden bg-background pt-10 pb-20 sm:pt-16 sm:pb-28 lg:pt-20 lg:pb-32">
      {/* Ambient gradient glow */}
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

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Main Hero Header */}
        <div className="mx-auto max-w-3xl text-center space-y-6">
          {/* Top Session Pill Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary shadow-2xs backdrop-blur-xs">
            <span className="flex size-2 rounded-full bg-primary animate-pulse" />
            <span>Academic Session {siteConfig.academicYear}</span>
            <span className="text-muted-foreground/60">•</span>
            <span className="text-muted-foreground font-normal">
              Admissions Open
            </span>
          </div>

          {/* Punchy, Elegantly Styled Headline */}
          <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.08] text-balance">
            Intelligent Academic Platform for{" "}
            <span className="bg-linear-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
              Modern Coaching
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto text-balance">
            From student admissions and daily attendance verification to
            automated grading, timetable routines, and tuition billing —
            everything unified in one responsive portal.
          </p>

          {/* Call to Actions (CTAs) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
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
                  <span>New Student Admission</span>
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
                  <span>Apply for Admission</span>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Interactive Showcase Preview Window */}
        <div className="mt-14 sm:mt-20 mx-auto max-w-4xl">
          <div className="overflow-hidden rounded-2xl border border-border/80 bg-card/70 shadow-xl backdrop-blur-md">
            {/* Top Mock Window Header */}
            <div className="flex items-center justify-between border-b border-border/70 bg-muted/40 px-4 py-3">
              <div className="flex items-center gap-1.5">
                <div className="size-2.5 rounded-full bg-destructive/60" />
                <div className="size-2.5 rounded-full bg-amber-500/60" />
                <div className="size-2.5 rounded-full bg-emerald-500/60" />
              </div>

              {/* Portal Selector Tabs */}
              <div className="flex items-center gap-1 rounded-lg bg-background/80 p-0.5 border border-border/70 shadow-2xs">
                {PORTAL_PREVIEWS.map((portal, idx) => (
                  <button
                    key={portal.id}
                    type="button"
                    onClick={() => setActiveTab(idx)}
                    className={cn(
                      "px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer",
                      activeTab === idx
                        ? "bg-primary text-primary-foreground shadow-2xs"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {portal.role}
                  </button>
                ))}
              </div>

              <div className="hidden sm:flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
                <span>https://portal.cms</span>
              </div>
            </div>

            {/* Window Interior Body */}
            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Left Description & Features */}
                <div className="md:col-span-8 space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <ActiveIcon className="size-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-heading font-bold text-base sm:text-lg text-foreground">
                          {activePortal.role}
                        </h3>
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                          {activePortal.badge}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {activePortal.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Feature Checklist */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                    {activePortal.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-start gap-2 text-xs text-foreground/90 bg-background/60 p-2 rounded-lg border border-border/60"
                      >
                        <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Mini Stat Card */}
                <div className="md:col-span-4 rounded-xl border border-border/80 bg-linear-to-b from-primary/5 to-transparent p-5 text-center flex flex-col items-center justify-center space-y-1 shadow-2xs">
                  <span className="font-heading text-3xl sm:text-4xl font-extrabold text-primary">
                    {activePortal.metric.value}
                  </span>
                  <span className="text-xs font-semibold text-foreground">
                    {activePortal.metric.label}
                  </span>
                  <p className="text-[11px] text-muted-foreground pt-1">
                    Optimized for rapid workflows
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Minimal Capabilities Grid */}
        <div className="mt-14 sm:mt-20 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CORE_CAPABILITIES.map((cap) => {
            const Icon = cap.icon;
            return (
              <div
                key={cap.title}
                className="group relative rounded-2xl border border-border/70 bg-card/60 p-5 shadow-2xs backdrop-blur-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:shadow-xs"
              >
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-2xs mb-3.5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Icon className="size-5" />
                </div>
                <h3 className="font-heading font-semibold text-sm text-foreground mb-1.5">
                  {cap.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {cap.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
