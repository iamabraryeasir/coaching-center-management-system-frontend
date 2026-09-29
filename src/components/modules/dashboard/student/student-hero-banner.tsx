"use client";

import { ArrowRight, CalendarDays, Sparkles } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/hooks";
import { cn } from "@/lib/utils";

export function StudentHeroBanner() {
  const { user } = useAuth();
  const profile = user?.studentProfile;

  return (
    <div className="rounded-2xl border border-border/80 bg-linear-to-br from-card via-card to-primary/5 p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
            <Sparkles className="size-3" />
            <span>Student Dashboard</span>
          </div>

          <h2 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Welcome back, {user?.name?.split(" ")[0] || "Student"}! 👋
          </h2>

          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground pt-0.5">
            {profile?.rollNumber && (
              <span className="font-mono font-medium text-foreground bg-muted/60 px-2 py-0.5 rounded-md">
                Roll #{profile.rollNumber}
              </span>
            )}
            {profile?.classLevel && (
              <>
                <span className="text-muted-foreground/60">•</span>
                <span className="font-medium text-foreground">
                  {profile.classLevel}
                </span>
              </>
            )}
            {profile?.institutionName && (
              <>
                <span className="text-muted-foreground/60">•</span>
                <span className="text-muted-foreground truncate max-w-xs">
                  {profile.institutionName}
                </span>
              </>
            )}
          </div>
        </div>

        <Link
          href="/dashboard/student/routines"
          className={cn(
            buttonVariants({ size: "sm" }),
            "gap-2 shadow-2xs font-semibold shrink-0 h-9",
          )}
        >
          <CalendarDays className="size-4" />
          <span>Full Timetable</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}
