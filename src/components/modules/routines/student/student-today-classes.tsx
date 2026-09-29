"use client";

import { BookOpen, Clock, MapPin, Sparkles, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { RoutineSlot } from "@/types";

interface StudentTodayClassesProps {
  slots: RoutineSlot[];
  dayName: string;
  dateFormatted: string;
}

type SlotStatus = "live" | "upcoming" | "completed";

function getSlotStatus(startTime: string, endTime: string): SlotStatus {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [startH, startM] = startTime.split(":").map(Number);
  const [endH, endM] = endTime.split(":").map(Number);

  const startMinutes = startH * 60 + (startM || 0);
  const endMinutes = endH * 60 + (endM || 0);

  if (currentMinutes >= startMinutes && currentMinutes <= endMinutes) {
    return "live";
  }
  if (currentMinutes < startMinutes) {
    return "upcoming";
  }
  return "completed";
}

function formatSlotTime(timeStr: string): string {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const displayHours = h % 12 || 12;
  const displayMinutes = m ? String(m).padStart(2, "0") : "00";
  return `${displayHours}:${displayMinutes} ${period}`;
}

export function StudentTodayClasses({
  slots,
  dayName,
  dateFormatted,
}: StudentTodayClassesProps) {
  // Sort slots chronologically
  const sortedSlots = [...slots].sort((a, b) =>
    a.startTime.localeCompare(b.startTime),
  );

  if (sortedSlots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-card p-12 text-center">
        <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
          <Sparkles className="size-6 text-amber-500" />
        </div>
        <h3 className="font-heading font-semibold text-lg text-foreground mb-1">
          No Classes Scheduled for Today
        </h3>
        <p className="text-sm text-muted-foreground max-w-md">
          You have no lectures scheduled for {dayName} ({dateFormatted}). Take
          this time to review your notes, complete coursework, or rest!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-border/60">
        <div>
          <h3 className="font-heading font-semibold text-base text-foreground">
            Today&apos;s Class Schedule
          </h3>
          <p className="text-xs text-muted-foreground">
            {dayName} · {dateFormatted} · {sortedSlots.length} lecture
            {sortedSlots.length > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedSlots.map((slot) => {
          const status = getSlotStatus(slot.startTime, slot.endTime);
          const startFormatted = formatSlotTime(slot.startTime);
          const endFormatted = formatSlotTime(slot.endTime);

          return (
            <div
              key={slot.id}
              className={cn(
                "rounded-xl border bg-card p-5 space-y-3.5 transition-all shadow-2xs relative overflow-hidden",
                status === "live"
                  ? "border-emerald-500/60 ring-2 ring-emerald-500/20 shadow-sm"
                  : "border-border/80 hover:border-primary/40",
              )}
            >
              {/* Top Row: Subject & Status */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {slot.batch && (
                      <Badge
                        variant="secondary"
                        className="text-[10px] font-semibold py-0 px-2 bg-primary/10 text-primary border-primary/20"
                      >
                        {slot.batch.name}
                      </Badge>
                    )}
                    {status === "live" && (
                      <Badge
                        variant="outline"
                        className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold text-[10px] gap-1.5"
                      >
                        <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Live Now
                      </Badge>
                    )}
                    {status === "upcoming" && (
                      <Badge
                        variant="outline"
                        className="border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-400 font-medium text-[10px]"
                      >
                        Upcoming
                      </Badge>
                    )}
                    {status === "completed" && (
                      <Badge
                        variant="outline"
                        className="border-muted-foreground/30 bg-muted/60 text-muted-foreground font-medium text-[10px]"
                      >
                        Completed
                      </Badge>
                    )}
                  </div>

                  <h4 className="font-heading font-semibold text-lg text-foreground pt-0.5">
                    {slot.subject || "General Class Session"}
                  </h4>
                </div>

                <div className="size-9 rounded-lg bg-muted text-muted-foreground flex items-center justify-center shrink-0">
                  <BookOpen className="size-4" />
                </div>
              </div>

              {/* Time & Room Details */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50 text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="size-3.5 text-primary shrink-0" />
                  <span className="font-medium text-foreground">
                    {startFormatted} – {endFormatted}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground justify-end">
                  <MapPin className="size-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span className="font-medium text-foreground">
                    {slot.room ? `Room ${slot.room}` : "Room TBA"}
                  </span>
                </div>
              </div>

              {/* Teacher Info */}
              {slot.teacher && (
                <div className="flex items-center gap-2 pt-2 border-t border-border/50 text-xs text-muted-foreground">
                  <User className="size-3.5 text-indigo-500 shrink-0" />
                  <span className="truncate">
                    Instructor:{" "}
                    <strong className="text-foreground font-semibold">
                      {slot.teacher.name}
                    </strong>
                    {slot.teacher.designation && (
                      <span className="text-muted-foreground">
                        {" "}
                        ({slot.teacher.designation})
                      </span>
                    )}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
