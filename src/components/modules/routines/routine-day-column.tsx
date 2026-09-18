"use client";

import { Calendar, Plus } from "lucide-react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DayOfWeek, RoutineSlot } from "@/types";
import { RoutineSlotCard } from "./routine-slot-card";

interface RoutineDayColumnProps {
  dayOfWeek: DayOfWeek;
  slots: RoutineSlot[];
  viewMode?: "batch" | "teacher" | "all";
  onAddSlot?: (dayOfWeek: DayOfWeek) => void;
  onEditSlot?: (slot: RoutineSlot) => void;
  onDeleteSlot?: (slot: RoutineSlot) => void;
  className?: string;
}

const DAY_LABELS: Record<DayOfWeek, { full: string; short: string }> = {
  SATURDAY: { full: "Saturday", short: "Sat" },
  SUNDAY: { full: "Sunday", short: "Sun" },
  MONDAY: { full: "Monday", short: "Mon" },
  TUESDAY: { full: "Tuesday", short: "Tue" },
  WEDNESDAY: { full: "Wednesday", short: "Wed" },
  THURSDAY: { full: "Thursday", short: "Thu" },
  FRIDAY: { full: "Friday", short: "Fri" },
};

export function RoutineDayColumn({
  dayOfWeek,
  slots,
  viewMode = "batch",
  onAddSlot,
  onEditSlot,
  onDeleteSlot,
  className,
}: RoutineDayColumnProps) {
  // Determine if this day is today
  const isToday = useMemo(() => {
    const daysMap: Record<number, DayOfWeek> = {
      0: "SUNDAY",
      1: "MONDAY",
      2: "TUESDAY",
      3: "WEDNESDAY",
      4: "THURSDAY",
      5: "FRIDAY",
      6: "SATURDAY",
    };
    return daysMap[new Date().getDay()] === dayOfWeek;
  }, [dayOfWeek]);

  // Sort slots chronologically by startTime
  const sortedSlots = useMemo(() => {
    return [...slots].sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [slots]);

  const label = DAY_LABELS[dayOfWeek];

  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border border-border/70 bg-card/60 overflow-hidden shadow-2xs transition-all",
        "print:rounded-md print:border-neutral-300 print:bg-white print:shadow-none print:break-inside-avoid",
        className,
      )}
    >
      {/* Day Header */}
      <div
        className={cn(
          "px-3 py-2 border-b border-border/70 flex items-center justify-between gap-1.5",
          "print:bg-neutral-100 print:border-neutral-300 print:px-2 print:py-1.5",
          isToday ? "bg-muted/60" : "bg-muted/40",
        )}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="font-heading font-bold text-sm text-foreground truncate print:text-black print:text-xs">
            {label.full}
          </span>
          {isToday && (
            <span className="text-[9px] font-bold uppercase tracking-wider bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full shrink-0 print:hidden">
              Today
            </span>
          )}
        </div>

        <span className="text-[11px] font-medium text-muted-foreground shrink-0 print:text-[10px] print:text-neutral-600">
          {slots.length > 0
            ? `${slots.length} ${slots.length === 1 ? "Class" : "Classes"}`
            : "Off Day"}
        </span>
      </div>

      {/* Slots List Body */}
      <div className="p-2.5 flex-1 flex flex-col gap-2 min-h-48 print:p-1.5 print:gap-1.5 print:min-h-0">
        {sortedSlots.length > 0 ? (
          sortedSlots.map((slot) => (
            <RoutineSlotCard
              key={slot.id}
              slot={slot}
              viewMode={viewMode}
              onEdit={onEditSlot}
              onDelete={onDeleteSlot}
            />
          ))
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-4 text-center rounded-lg border border-dashed border-border/70 bg-muted/10 text-muted-foreground print:p-2 print:border-neutral-200 print:bg-neutral-50/50 print:min-h-16">
            <Calendar className="size-6 text-muted-foreground/40 mb-1.5 print:hidden" />
            <p className="text-xs font-medium text-foreground/70 print:text-[10px] print:text-neutral-400 print:italic">
              No classes
            </p>
            <p className="text-[11px] text-muted-foreground print:hidden">
              Weekly schedule is open
            </p>
            {onAddSlot && (
              <Button
                variant="ghost"
                size="xs"
                onClick={() => onAddSlot(dayOfWeek)}
                className="mt-2 text-xs gap-1 text-primary hover:text-primary hover:bg-primary/10 print:hidden"
              >
                <Plus className="size-3" />
                <span>Add Class</span>
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Quick Add Footer if slots exist */}
      {onAddSlot && sortedSlots.length > 0 && (
        <div className="p-2 border-t border-border/50 bg-card/40 print:hidden">
          <Button
            variant="ghost"
            size="xs"
            onClick={() => onAddSlot(dayOfWeek)}
            className="w-full text-xs gap-1 text-muted-foreground hover:text-primary hover:bg-primary/5 font-medium justify-center h-7"
          >
            <Plus className="size-3" />
            <span>Add Slot</span>
          </Button>
        </div>
      )}
    </div>
  );
}
