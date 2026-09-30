"use client";

import {
  Calendar,
  Clock,
  Compass,
  Download,
  Layers,
  Printer,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { getBatchRoutinePdfUrl } from "@/api";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSidebar } from "@/components/ui/sidebar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMyEnrolledBatches, useSuspenseMyStudentSchedule } from "@/hooks";
import { cn } from "@/lib/utils";
import {
  ACADEMIC_DAYS_ORDER,
  type DayOfWeek,
  type DayTimetableGroup,
  type RoutineSlot,
} from "@/types";
import { RoutinePrintModal } from "../shared/routine-print-modal";
import { WeeklyTimetableGrid } from "../shared/weekly-timetable-grid";
import { StudentTodayClasses } from "./student-today-classes";

const DAYS_MAP: Record<number, DayOfWeek> = {
  0: "SUNDAY",
  1: "MONDAY",
  2: "TUESDAY",
  3: "WEDNESDAY",
  4: "THURSDAY",
  5: "FRIDAY",
  6: "SATURDAY",
};

export function StudentRoutinesView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [_isPending, startTransition] = useTransition();
  const { setOpen } = useSidebar();

  // Collapse sidebar by default on the routine route to provide maximum screen real estate for the 7-day grid,
  // and restore when navigating away to other dashboard pages.
  useEffect(() => {
    setOpen(false);
    return () => {
      setOpen(true);
    };
  }, [setOpen]);

  const { data: scheduleData } = useSuspenseMyStudentSchedule();
  const { data: enrolledBatches } = useMyEnrolledBatches();

  const [selectedBatchId, setSelectedBatchId] = useState<string>("ALL");
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const activeView = searchParams.get("view") === "today" ? "today" : "week";

  const handleViewChange = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val === "today") {
      params.set("view", "today");
    } else {
      params.delete("view");
    }
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  // Determine current day of week
  const todayDayOfWeek = DAYS_MAP[new Date().getDay()] || "SATURDAY";
  const todayDayName = new Date().toLocaleDateString(undefined, {
    weekday: "long",
  });
  const todayDateFormatted = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Filter schedule by selected batch
  const baseSchedule = scheduleData.schedule || [];
  const filteredSchedule: DayTimetableGroup[] = ACADEMIC_DAYS_ORDER.map(
    (day) => {
      const match = baseSchedule.find((g) => g.dayOfWeek === day);
      if (!match) return { dayOfWeek: day, slots: [] };
      if (selectedBatchId === "ALL") return match;
      return {
        dayOfWeek: day,
        slots: match.slots.filter((s) => s.batchId === selectedBatchId),
      };
    },
  );

  // Extract slots for today from filtered schedule
  const todayGroup = filteredSchedule.find(
    (g) => g.dayOfWeek === todayDayOfWeek,
  );
  const todaySlots: RoutineSlot[] = todayGroup?.slots || [];

  // Total slots across the active schedule
  const totalWeeklySlots = filteredSchedule.reduce(
    (acc, d) => acc + (d.slots?.length || 0),
    0,
  );

  // Next class calculation
  const nextClassInfo = (() => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const upcomingToday = todaySlots
      .map((s) => {
        const [h, m] = s.endTime.split(":").map(Number);
        return { slot: s, endMinutes: h * 60 + (m || 0) };
      })
      .filter((item) => item.endMinutes > currentMinutes)
      .sort((a, b) => a.slot.startTime.localeCompare(b.slot.startTime));

    if (upcomingToday.length > 0) {
      const nextSlot = upcomingToday[0].slot;
      const [h, m] = nextSlot.startTime.split(":").map(Number);
      const period = h >= 12 ? "PM" : "AM";
      const displayH = h % 12 || 12;
      const displayM = m ? String(m).padStart(2, "0") : "00";
      return `${displayH}:${displayM} ${period} (${nextSlot.subject || "Class"})`;
    }

    if (todaySlots.length > 0) {
      return "All completed today";
    }

    return "No classes today";
  })();

  // Batch name for print/PDF
  const selectedBatchName = (() => {
    if (selectedBatchId === "ALL") return undefined;
    const found = enrolledBatches.find((b) => b.batchId === selectedBatchId);
    return found?.batch?.name || found?.batchName || "Academic Batch";
  })();

  // If student is not enrolled in any batch at all
  if (enrolledBatches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-card p-12 text-center">
        <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
          <Calendar className="size-6 text-primary" />
        </div>
        <h3 className="font-heading font-semibold text-lg text-foreground mb-1">
          No Batches Enrolled Yet
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm mb-6">
          Your personal class timetable will appear here once you enroll in
          coaching batches and your application is approved.
        </p>
        <Link
          href="/dashboard/student/batches?tab=catalog"
          className={cn(buttonVariants(), "gap-2")}
        >
          <Compass className="size-4" />
          Explore Available Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Class Routine & Timetable
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Your combined weekly lecture schedule, classrooms, and instructor
            assignments.
          </p>
        </div>
      </div>

      {/* KPI Stats Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Today's Classes */}
        <div className="rounded-xl border border-border/80 bg-card p-4 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Today&apos;s Lectures
            </span>
            <div className="size-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Clock className="size-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-heading text-foreground">
            {todaySlots.length}
          </p>
          <p className="text-[11px] text-muted-foreground">{todayDayName}</p>
        </div>

        {/* Card 2: Total Weekly Slots */}
        <div className="rounded-xl border border-border/80 bg-card p-4 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Weekly Classes
            </span>
            <div className="size-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Calendar className="size-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-heading text-foreground">
            {totalWeeklySlots}
          </p>
          <p className="text-[11px] text-muted-foreground">
            Slots across 7 academic days
          </p>
        </div>

        {/* Card 3: Enrolled Batches */}
        <div className="rounded-xl border border-border/80 bg-card p-4 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Active Batches
            </span>
            <div className="size-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Layers className="size-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-heading text-foreground">
            {enrolledBatches.length}
          </p>
          <p className="text-[11px] text-muted-foreground">
            Courses in your schedule
          </p>
        </div>

        {/* Card 4: Next Scheduled Lecture */}
        <div className="rounded-xl border border-border/80 bg-card p-4 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Next Up
            </span>
            <div className="size-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Sparkles className="size-4" />
            </div>
          </div>
          <p className="text-sm font-bold font-heading text-foreground truncate">
            {nextClassInfo}
          </p>
          <p className="text-[11px] text-muted-foreground">
            {todayDateFormatted}
          </p>
        </div>
      </div>

      {/* Toolbar Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border border-border/80 bg-card shadow-2xs">
        {/* View Switcher Tabs */}
        <Tabs
          value={activeView}
          onValueChange={handleViewChange}
          className="w-full sm:w-auto"
        >
          <TabsList className="w-full sm:w-auto h-9 bg-muted/60 p-0.5">
            <TabsTrigger
              value="week"
              className="gap-1.5 text-xs font-medium px-3"
            >
              <Calendar className="size-3.5" />
              <span>Weekly Timetable</span>
            </TabsTrigger>
            <TabsTrigger
              value="today"
              className="gap-1.5 text-xs font-medium px-3"
            >
              <Clock className="size-3.5" />
              <span>Today&apos;s Agenda</span>
              {todaySlots.length > 0 && (
                <span className="ml-1 rounded-full bg-primary/20 text-primary px-1.5 py-0.2 text-[10px] font-bold">
                  {todaySlots.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Batch Filter & PDF Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Batch Selector */}
          <Select
            value={selectedBatchId}
            onValueChange={(val) => val && setSelectedBatchId(val)}
          >
            <SelectTrigger className="w-45 h-9 text-xs">
              <SelectValue placeholder="All My Batches" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All My Batches</SelectItem>
              {enrolledBatches.map((b) => (
                <SelectItem key={b.batchId} value={b.batchId}>
                  {b.batch?.name || b.batchName || "Batch"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* If specific batch selected: Direct PDF Download */}
          {selectedBatchId !== "ALL" && (
            <a
              href={getBatchRoutinePdfUrl(selectedBatchId, true)}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "gap-1.5 text-xs h-9",
              )}
            >
              <Download className="size-3.5 text-primary" />
              <span>Batch PDF</span>
            </a>
          )}

          {/* Print / Printable Layout Modal */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsPrintModalOpen(true)}
            className="gap-1.5 text-xs h-9"
          >
            <Printer className="size-3.5 text-muted-foreground" />
            <span>Print</span>
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeView === "today" ? (
        <StudentTodayClasses
          slots={todaySlots}
          dayName={todayDayName}
          dateFormatted={todayDateFormatted}
        />
      ) : (
        <div className="space-y-4">
          <WeeklyTimetableGrid
            schedule={filteredSchedule}
            isLoading={false}
            viewMode="all"
            emptyTitle="No Classes Scheduled"
            emptyDescription="There are no classes scheduled for the selected batch filter."
          />
        </div>
      )}

      {/* Routine Print Modal */}
      <RoutinePrintModal
        open={isPrintModalOpen}
        onOpenChange={setIsPrintModalOpen}
        viewMode={selectedBatchId === "ALL" ? "all" : "batch"}
        batchName={selectedBatchName}
        schedule={filteredSchedule}
      />
    </div>
  );
}
