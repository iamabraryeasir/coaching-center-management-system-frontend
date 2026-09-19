"use client";

import { Lock } from "lucide-react";
import { Suspense } from "react";
import { ExamsManagementView } from "@/components/modules/exams";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks";

function TeacherExamsFallback() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      <Skeleton className="h-10 w-full rounded-xl" />
      <Skeleton className="h-96 w-full rounded-xl" />
    </div>
  );
}

export default function TeacherExamsPage() {
  const { hasPermission, isLoading } = useAuth();

  if (isLoading) {
    return <TeacherExamsFallback />;
  }

  // Verify delegated exam permission
  if (!hasPermission("MANAGE_EXAMS")) {
    return (
      <div className="rounded-xl border border-dashed border-border/80 bg-card/60 p-12 text-center shadow-xs flex flex-col items-center justify-center max-w-md mx-auto my-12">
        <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-3">
          <Lock className="size-7" />
        </div>
        <h3 className="font-heading font-semibold text-lg text-foreground">
          Exam Grading Access Restricted
        </h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm leading-relaxed">
          Your account does not have the delegated <strong>MANAGE_EXAMS</strong>{" "}
          permission authorized by institution administrators. Please contact an
          administrator to request access.
        </p>
      </div>
    );
  }

  return (
    <Suspense fallback={<TeacherExamsFallback />}>
      <ExamsManagementView portalRole="TEACHER" />
    </Suspense>
  );
}
