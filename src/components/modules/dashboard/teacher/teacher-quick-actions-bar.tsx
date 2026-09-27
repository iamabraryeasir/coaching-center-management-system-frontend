"use client";

import { CalendarDays, GraduationCap, Layers, UserCheck } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/hooks";
import { cn } from "@/lib/utils";

export function TeacherQuickActionsBar() {
  const { hasPermission } = useAuth();

  return (
    <div className="flex flex-wrap items-center gap-2">
      {hasPermission("MANAGE_ATTENDANCE") && (
        <Link
          href="/dashboard/teacher/attendance"
          className={cn(
            buttonVariants({ variant: "default", size: "sm" }),
            "gap-1.5 shadow-2xs font-medium",
          )}
        >
          <UserCheck className="size-3.5" />
          <span>Take Attendance</span>
        </Link>
      )}

      {hasPermission("MANAGE_EXAMS") && (
        <Link
          href="/dashboard/teacher/exams"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "gap-1.5 shadow-2xs font-medium",
          )}
        >
          <GraduationCap className="size-3.5" />
          <span>Grade Exams</span>
        </Link>
      )}

      <Link
        href="/dashboard/teacher/batches"
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "gap-1.5 shadow-2xs font-medium",
        )}
      >
        <Layers className="size-3.5" />
        <span>My Batches</span>
      </Link>

      <Link
        href="/dashboard/teacher/routines"
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "gap-1.5 shadow-2xs font-medium",
        )}
      >
        <CalendarDays className="size-3.5" />
        <span>My Timetable</span>
      </Link>
    </div>
  );
}
