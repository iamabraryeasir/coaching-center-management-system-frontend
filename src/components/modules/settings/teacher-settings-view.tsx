"use client";

import {
  Building2,
  CalendarCheck,
  CalendarDays,
  KeyRound,
  Layers,
  Settings,
  User as UserIcon,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { AdminAvatarCard } from "@/components/modules/media";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useMyTeacherAttendanceSummary,
  useTeacherDashboardBatches,
  useTeacherDashboardSchedule,
} from "@/hooks";

import { ActiveSessionsCard } from "./active-sessions-card";
import { ChangePasswordCard } from "./change-password-card";
import { TeacherAttendanceHistoryCard } from "./teacher-attendance-history-card";
import { TeacherInstitutionCard } from "./teacher-institution-card";
import { TeacherProfileCard } from "./teacher-profile-card";

interface TeacherSettingsViewProps {
  defaultTab?: "profile" | "attendance" | "security" | "institution";
}

export function TeacherSettingsView({
  defaultTab = "profile",
}: TeacherSettingsViewProps = {}) {
  const searchParams = useSearchParams();
  const queryTab = searchParams.get("tab") as
    | "profile"
    | "attendance"
    | "security"
    | "institution"
    | null;

  const [activeTab, setActiveTab] = useState<string>(queryTab || defaultTab);

  // Operational metrics for Teacher Ribbon
  const { data: batches = [], isLoading: isBatchesLoading } =
    useTeacherDashboardBatches();
  const { data: scheduleData, isLoading: isScheduleLoading } =
    useTeacherDashboardSchedule();
  const { data: attendanceResponse, isLoading: isAttendanceLoading } =
    useMyTeacherAttendanceSummary();

  const rawAttendance = attendanceResponse?.data;
  const attendancePayload =
    (rawAttendance as { data?: unknown })?.data || rawAttendance;
  const attendanceObj = attendancePayload as
    | Record<string, unknown>
    | undefined;
  const rawStats =
    (attendanceObj?.stats as Record<string, unknown> | undefined) ||
    attendanceObj ||
    {};
  const attendanceRate =
    rawStats.attendanceRate !== undefined && rawStats.attendanceRate !== null
      ? Number(rawStats.attendanceRate)
      : 100;

  const dayOfWeekNames = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ] as const;
  const currentDayName = dayOfWeekNames[new Date().getDay()];
  const todayClassesCount =
    scheduleData?.schedule?.find((g) => g.dayOfWeek === currentDayName)?.slots
      ?.length ?? 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
            <Settings className="size-3" />
            <span>Faculty Settings & Account</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-heading">
            Teacher Settings
          </h1>
          <p className="text-xs text-muted-foreground">
            Manage your faculty credentials, personal details, attendance
            records, and active sessions.
          </p>
        </div>
      </div>

      {/* 2. Operational Statistics Ribbon */}
      <div className="grid grid-cols-3 gap-3.5">
        <div className="rounded-xl border border-border/80 bg-card p-3.5 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-medium">Assigned Batches</span>
            <Layers className="size-4 text-primary" />
          </div>
          <p className="text-lg font-bold text-foreground font-heading">
            {isBatchesLoading ? "..." : batches.length}
          </p>
        </div>

        <div className="rounded-xl border border-border/80 bg-card p-3.5 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-medium">Classes Today</span>
            <CalendarDays className="size-4 text-primary" />
          </div>
          <p className="text-lg font-bold text-foreground font-heading">
            {isScheduleLoading ? "..." : todayClassesCount}
          </p>
        </div>

        <div className="rounded-xl border border-border/80 bg-card p-3.5 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-medium">Attendance Rate</span>
            <CalendarCheck className="size-4 text-primary" />
          </div>
          <p className="text-lg font-bold text-foreground font-heading">
            {isAttendanceLoading ? "..." : `${attendanceRate.toFixed(1)}%`}
          </p>
        </div>
      </div>

      {/* 3. Settings Navigation Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4 max-w-lg">
          <TabsTrigger value="profile" className="gap-1.5 text-xs">
            <UserIcon className="size-3.5" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="attendance" className="gap-1.5 text-xs">
            <CalendarCheck className="size-3.5" />
            <span>Attendance</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-1.5 text-xs">
            <KeyRound className="size-3.5" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="institution" className="gap-1.5 text-xs">
            <Building2 className="size-3.5" />
            <span>Campus</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Faculty Profile & Credentials */}
        <TabsContent value="profile" className="space-y-6">
          <AdminAvatarCard />
          <TeacherProfileCard />
        </TabsContent>

        {/* Tab 2: Attendance History & Stats */}
        <TabsContent value="attendance" className="space-y-6">
          <TeacherAttendanceHistoryCard />
        </TabsContent>

        {/* Tab 3: Security & Active Sessions */}
        <TabsContent value="security" className="space-y-6">
          <ChangePasswordCard />
          <ActiveSessionsCard />
        </TabsContent>

        {/* Tab 4: Campus & Institution Information */}
        <TabsContent value="institution" className="space-y-6">
          <TeacherInstitutionCard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
