"use client";

import { siteConfig } from "@/config/site";
import {
  ACADEMIC_DAYS_ORDER,
  type DayOfWeek,
  type DayTimetableGroup,
  type RoutineSlot,
} from "@/types";

export interface RoutinePrintProps {
  viewMode: "all" | "batch" | "teacher";
  schedule: DayTimetableGroup[];
  batchName?: string;
  teacherName?: string;
}

const DAY_TITLES: Record<DayOfWeek, string> = {
  SATURDAY: "Saturday",
  SUNDAY: "Sunday",
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
};

/**
 * Ultra-clean, production-grade academic routine sheet.
 * Strictly limited to:
 * 1. Coaching Name
 * 2. Routine Title (with Batch Name for batch view, Teacher Name for teacher view)
 * 3. 7-Day Timetable Grid
 *
 * Excludes all redundant banners, rules, reference codes, and signature lines.
 */
export function RoutinePrintSheet({
  viewMode,
  schedule,
  batchName,
  teacherName,
}: RoutinePrintProps) {
  // Normalize all 7 academic days (Saturday through Friday)
  const normalizedSchedule = ACADEMIC_DAYS_ORDER.map((day) => {
    const match = schedule.find((s) => s.dayOfWeek === day);
    return {
      dayOfWeek: day,
      slots: [...(match?.slots || [])].sort((a, b) =>
        a.startTime.localeCompare(b.startTime),
      ),
    };
  });

  // Determine clean subtitle based on view mode
  const title =
    viewMode === "batch"
      ? `Class Routine — ${batchName || "Academic Batch"}`
      : viewMode === "teacher"
        ? `Class Routine — ${teacherName || "Teacher"}`
        : "Weekly Class Routine";

  return (
    <div
      id="routine-printable-area"
      className="w-full text-black bg-white font-sans text-xs leading-normal p-6"
    >
      {/* 1. Header: Coaching Name + Mode-Specific Routine Title */}
      <div className="text-center pb-3 mb-4 border-b-2 border-black">
        <h1 className="text-2xl font-black uppercase tracking-tight text-black">
          {siteConfig.name}
        </h1>
        <h2 className="text-sm font-bold text-neutral-800 mt-1">{title}</h2>
      </div>

      {/* 2. 7-Day Timetable Grid Table */}
      <table className="w-full border-collapse border border-black text-[11px]">
        <thead>
          <tr className="bg-neutral-100 border-b border-black">
            {ACADEMIC_DAYS_ORDER.map((day) => (
              <th
                key={day}
                className="border border-black p-2 font-bold text-center w-[14.28%] text-xs text-black"
              >
                {DAY_TITLES[day]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="align-top">
            {normalizedSchedule.map((dayGroup) => (
              <td
                key={dayGroup.dayOfWeek}
                className="border border-black p-1.5 min-h-90 bg-white"
              >
                {dayGroup.slots.length > 0 ? (
                  <div className="space-y-1.5">
                    {dayGroup.slots.map((slot: RoutineSlot) => (
                      <div
                        key={slot.id}
                        className="border border-neutral-300 p-2 rounded-xs bg-neutral-50/60 leading-tight space-y-0.5"
                      >
                        {/* 1. Time Badge */}
                        <div className="font-mono font-bold text-[10px] text-black border-b border-neutral-200 pb-0.5">
                          {slot.startTime} – {slot.endTime}
                        </div>

                        {/* 2. Subject Headline */}
                        <div className="font-bold text-[11px] text-black pt-0.5 leading-snug">
                          {slot.subject || "Class Session"}
                        </div>

                        {/* 3. Teacher Name (Shown in 'all' and 'batch' modes; excluded in 'teacher' mode) */}
                        {viewMode !== "teacher" && (
                          <div
                            className="text-[10px] text-neutral-800 truncate"
                            title={slot.teacher?.name || "Unassigned"}
                          >
                            <span className="text-neutral-500">Teacher: </span>
                            <span className="font-medium">
                              {slot.teacher?.name || "Unassigned"}
                            </span>
                          </div>
                        )}

                        {/* 4. Batch Name (Shown in 'all' and 'teacher' modes; excluded in 'batch' mode) */}
                        {viewMode !== "batch" && slot.batch && (
                          <div
                            className="text-[10px] text-neutral-800 truncate"
                            title={slot.batch.name}
                          >
                            <span className="text-neutral-500">Batch: </span>
                            <span className="font-medium">
                              {slot.batch.name}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-32 flex items-center justify-center text-[10px] text-neutral-400 font-medium italic">
                    No Classes
                  </div>
                )}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
