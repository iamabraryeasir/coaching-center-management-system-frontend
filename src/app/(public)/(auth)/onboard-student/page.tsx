import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import AppLogo from "@/assets/svg/logo";
import { StudentOnboardingForm } from "@/components/forms/student-onboarding-form";
import { Skeleton } from "@/components/ui/skeleton";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Student Admission & Onboarding | ${siteConfig.name}`,
  description: `Apply for student enrollment at ${siteConfig.name} via verified Google OAuth.`,
};

function OnboardingSkeleton() {
  return (
    <div className="w-full max-w-xl rounded-xl border border-border/80 bg-card p-6 shadow-sm space-y-6 animate-pulse">
      <div className="space-y-2">
        <Skeleton className="h-4 w-32 rounded-full" />
        <Skeleton className="h-7 w-64 rounded-lg" />
        <Skeleton className="h-4 w-80 rounded-md" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-10 w-full rounded-lg" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </div>
  );
}

export default function OnboardStudentPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted/40 p-4 sm:p-6 md:p-10">
      <div className="flex w-full flex-col items-center gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-medium text-foreground transition-opacity hover:opacity-85"
        >
          <AppLogo size={0.5} />
          <span className="font-heading font-bold text-lg">
            {siteConfig.name}
          </span>
        </Link>

        <Suspense fallback={<OnboardingSkeleton />}>
          <StudentOnboardingForm />
        </Suspense>
      </div>
    </div>
  );
}
