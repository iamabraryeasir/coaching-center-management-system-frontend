"use client";

import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  GraduationCap,
  ShieldCheck,
  UserCheck,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth, useTeacherDashboard } from "@/hooks";
import { cn } from "@/lib/utils";
import type { TeacherPermission } from "@/types";

export function TeacherPermissionsCard() {
  const { data } = useTeacherDashboard();
  const { hasPermission } = useAuth();

  const permissionsList = data?.permissions;

  const permissions = [
    {
      key: "MANAGE_ATTENDANCE" as TeacherPermission,
      title: "Attendance Management",
      description: "Take and modify daily student attendance sheets",
      icon: UserCheck,
      href: "/dashboard/teacher/attendance",
      isGranted:
        Boolean(permissionsList?.includes("MANAGE_ATTENDANCE")) ||
        hasPermission("MANAGE_ATTENDANCE"),
    },
    {
      key: "MANAGE_EXAMS" as TeacherPermission,
      title: "Exams & Marks Entry",
      description: "Create exams, enter bulk marks & publish gradebooks",
      icon: GraduationCap,
      href: "/dashboard/teacher/exams",
      isGranted:
        Boolean(permissionsList?.includes("MANAGE_EXAMS")) ||
        hasPermission("MANAGE_EXAMS"),
    },
    {
      key: "MANAGE_ROUTINES" as TeacherPermission,
      title: "Routine Modification",
      description: "Create, edit and adjust weekly timetable slots",
      icon: CalendarDays,
      href: "/dashboard/teacher/routines",
      isGranted:
        Boolean(permissionsList?.includes("MANAGE_ROUTINES")) ||
        hasPermission("MANAGE_ROUTINES"),
    },
  ];

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            Administrative Authorizations
          </CardTitle>
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="size-3.5" />
            <span>Teacher Portal</span>
          </div>
        </div>
        <CardDescription>
          Delegated academic capabilities granted by institution administration
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 space-y-3">
        {permissions.map((perm) => (
          <div
            key={perm.key}
            className={cn(
              "flex items-start justify-between rounded-lg border p-3.5 transition-all",
              perm.isGranted
                ? "border-border/80 bg-card hover:border-primary/40 hover:bg-muted/30"
                : "border-border/40 bg-muted/10 opacity-60",
            )}
          >
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-lg mt-0.5",
                  perm.isGranted
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground",
                )}
              >
                <perm.icon className="size-4" />
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm text-foreground">
                    {perm.title}
                  </p>
                  {perm.isGranted ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="size-3.5" />
                      <span>Authorized</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                      <XCircle className="size-3.5" />
                      <span>Standard View Only</span>
                    </span>
                  )}
                </div>

                <p className="text-xs text-muted-foreground">
                  {perm.description}
                </p>
              </div>
            </div>

            {perm.isGranted && (
              <Link
                href={perm.href}
                className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                title={`Go to ${perm.title}`}
              >
                <ArrowUpRight className="size-4" />
              </Link>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
