"use client";

import { Calendar, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ACADEMIC_DAYS_ORDER,
  type DayOfWeek,
  type DayTimetableGroup,
  type RoutineSlot,
} from "@/types";
import { RoutineDayColumn } from "./routine-day-column";

const DAY_TITLES: Record<DayOfWeek, string> = {
  SATURDAY: "Saturday",
  SUNDAY: "Sunday",
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
};

interface WeeklyTimetableGridProps {
  schedule?: DayTimetableGroup[];
  isLoading: boolean;
  viewMode?: "batch" | "teacher" | "all";
  onAddSlot?: (dayOfWeek?: DayOfWeek) => void;
  onEditSlot?: (slot: RoutineSlot) => void;
  onDeleteSlot?: (slot: RoutineSlot) => void;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function WeeklyTimetableGrid({
  schedule,
  isLoading,
  viewMode = "batch",
  onAddSlot,
  onEditSlot,
  onDeleteSlot,
  emptyTitle = "No Routine Slots Scheduled",
  emptyDescription = "Select a batch or teacher to view and configure weekly class routines.",
}: WeeklyTimetableGridProps) {
  const [mobileDayTab, setMobileDayTab] = useState<string>("ALL");

  // Ensure all 7 academic days exist in correct order (SATURDAY -> FRIDAY)
  const normalizedSchedule: DayTimetableGroup[] = ACADEMIC_DAYS_ORDER.map(
    (day) => {
      const match = schedule?.find((s) => s.dayOfWeek === day);
      return match || { dayOfWeek: day, slots: [] };
    },
  );

  const totalSlotsCount = normalizedSchedule.reduce(
    (acc, day) => acc + (day.slots?.length || 0),
    0,
  );

  // Loading skeleton state (7 columns)
  if (isLoading) {
    return (
      <div className="overflow-x-auto pb-4">
        <div className="min-w-330 2xl:min-w-full">
          <div className="grid grid-cols-7 gap-3">
            {ACADEMIC_DAYS_ORDER.map((day) => (
              <div
                key={day}
                className="rounded-xl border border-border/70 bg-card/50 overflow-hidden shadow-2xs flex flex-col gap-2"
              >
                <div className="px-3.5 py-2.5 bg-muted/40 border-b border-border/70 flex justify-between items-center">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-12 rounded-full" />
                </div>
                <div className="p-2.5 space-y-2 min-h-56">
                  <Skeleton className="h-24 w-full rounded-lg" />
                  <Skeleton className="h-24 w-full rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Completely empty schedule state
  if (!schedule || totalSlotsCount === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border/80 bg-card/60 p-12 text-center shadow-xs flex flex-col items-center justify-center max-w-lg mx-auto">
        <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary mb-3">
          <Calendar className="size-7" />
        </div>
        <h3 className="font-heading font-semibold text-lg text-foreground">
          {emptyTitle}
        </h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm leading-relaxed">
          {emptyDescription}
        </p>
        {onAddSlot && (
          <Button
            size="sm"
            onClick={() => onAddSlot()}
            className="mt-5 gap-1.5 font-medium shadow-sm"
          >
            <Plus className="size-4" />
            <span>Schedule First Class</span>
          </Button>
        )}
      </div>
    );
  }

  // Mobile Single Day Filtered View (if mobileDayTab !== "ALL")
  const displayedSchedule: DayTimetableGroup[] =
    mobileDayTab === "ALL"
      ? normalizedSchedule
      : normalizedSchedule.filter((d) => d.dayOfWeek === mobileDayTab);

  return (
    <div className="space-y-3">
      {/* Mobile Day Switcher (Select Component for mobile screens, hidden in print) */}
      <div className="lg:hidden print:hidden w-full max-w-xs">
        <Select
          value={mobileDayTab}
          onValueChange={(val) => val && setMobileDayTab(val)}
        >
          <SelectTrigger className="h-9 text-xs w-full bg-background font-medium">
            <SelectValue placeholder="Filter by Day">
              {(val: string | null) => {
                if (!val || val === "ALL") {
                  return (
                    <div className="flex items-center justify-between w-full pr-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="size-3.5 text-muted-foreground" />
                        <span>All 7 Days</span>
                      </div>
                      <span className="text-[10px] bg-primary/15 text-primary rounded-full px-1.5 py-0.5 font-bold">
                        {totalSlotsCount}
                      </span>
                    </div>
                  );
                }
                const dayGroup = normalizedSchedule.find(
                  (s) => s.dayOfWeek === val,
                );
                const count = dayGroup?.slots.length || 0;
                const title = DAY_TITLES[val as DayOfWeek] || val;
                return (
                  <div className="flex items-center justify-between w-full pr-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="size-3.5 text-muted-foreground" />
                      <span>{title}</span>
                    </div>
                    {count > 0 && (
                      <span className="text-[10px] bg-primary/15 text-primary rounded-full px-1.5 py-0.5 font-bold">
                        {count}
                      </span>
                    )}
                  </div>
                );
              }}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="w-full max-w-xs">
            <SelectItem value="ALL" className="text-xs py-2">
              <div className="flex items-center justify-between w-full gap-4">
                <span>All 7 Days</span>
                <span className="text-[10px] bg-primary/15 text-primary rounded-full px-1.5 font-bold">
                  {totalSlotsCount}
                </span>
              </div>
            </SelectItem>
            {ACADEMIC_DAYS_ORDER.map((day) => {
              const count =
                normalizedSchedule.find((s) => s.dayOfWeek === day)?.slots
                  .length || 0;
              const title = DAY_TITLES[day] || day;
              return (
                <SelectItem key={day} value={day} className="text-xs py-2">
                  <div className="flex items-center justify-between w-full gap-4">
                    <span>{title}</span>
                    {count > 0 ? (
                      <span className="text-[10px] bg-primary/15 text-primary rounded-full px-1.5 font-bold">
                        {count} {count === 1 ? "Class" : "Classes"}
                      </span>
                    ) : (
                      <span className="text-[10px] text-muted-foreground">
                        Off Day
                      </span>
                    )}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Mobile/Tablet View (Selected Day Tab or Stacked, hidden in print) */}
      <div className="lg:hidden print:hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
          {displayedSchedule.map((group: DayTimetableGroup) => (
            <RoutineDayColumn
              key={group.dayOfWeek}
              dayOfWeek={group.dayOfWeek}
              slots={group.slots}
              viewMode={viewMode}
              onAddSlot={onAddSlot}
              onEditSlot={onEditSlot}
              onDeleteSlot={onDeleteSlot}
            />
          ))}
        </div>
      </div>

      {/* 7-Day Timetable Grid (Desktop & A4 Print) */}
      <div className="hidden lg:block print:block overflow-x-auto pb-4 print:overflow-visible print:p-0 print:m-0">
        <div className="min-w-330 2xl:min-w-full print:min-w-0 print:w-full">
          <div className="grid grid-cols-7 gap-3 items-start print:grid-cols-7 print:gap-1.5 print:w-full">
            {normalizedSchedule.map((group: DayTimetableGroup) => (
              <RoutineDayColumn
                key={group.dayOfWeek}
                dayOfWeek={group.dayOfWeek}
                slots={group.slots}
                viewMode={viewMode}
                onAddSlot={onAddSlot}
                onEditSlot={onEditSlot}
                onDeleteSlot={onDeleteSlot}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
