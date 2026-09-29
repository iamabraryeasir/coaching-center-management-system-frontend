"use client";

import {
  Clock,
  Edit2,
  GraduationCap,
  MoreHorizontal,
  Trash2,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { RoutineSlot } from "@/types";

interface RoutineSlotCardProps {
  slot: RoutineSlot;
  viewMode?: "batch" | "teacher" | "all";
  onEdit?: (slot: RoutineSlot) => void;
  onDelete?: (slot: RoutineSlot) => void;
  className?: string;
  isPrint?: boolean;
}

export function RoutineSlotCard({
  slot,
  viewMode = "all",
  onEdit,
  onDelete,
  className,
  isPrint = false,
}: RoutineSlotCardProps) {
  const showTeacher = viewMode !== "teacher";
  const showBatch = viewMode !== "batch" && Boolean(slot.batch);
  const showFooter = showTeacher || showBatch;

  return (
    <div
      className={cn(
        "rounded-xl border border-border/80 bg-card shadow-2xs transition-all flex flex-col relative group text-left overflow-hidden divide-y divide-border/60",
        !isPrint && "hover:border-primary/50 hover:shadow-xs",
        "print:rounded-md print:border-neutral-300 print:bg-white print:shadow-none print:break-inside-avoid print:divide-neutral-200",
        className,
      )}
    >
      {/* Top-Right Floating Actions Menu (Appears on hover in desktop screen) */}
      {!isPrint && (onEdit || onDelete) && (
        <div className="absolute top-1.5 right-1.5 z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-150 print:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Routine slot actions"
                  className="size-6 rounded-md border border-border/70 bg-background/95 backdrop-blur-xs hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center shadow-2xs transition-colors"
                />
              }
            >
              <MoreHorizontal className="size-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              {onEdit && (
                <DropdownMenuItem
                  onClick={() => onEdit(slot)}
                  className="gap-2 text-xs cursor-pointer"
                >
                  <Edit2 className="size-3.5 text-muted-foreground" />
                  <span>Edit Slot</span>
                </DropdownMenuItem>
              )}
              {onEdit && onDelete && <DropdownMenuSeparator />}
              {onDelete && (
                <DropdownMenuItem
                  onClick={() => onDelete(slot)}
                  className="gap-2 text-xs text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                >
                  <Trash2 className="size-3.5" />
                  <span>Delete Slot</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Top Row: Time Badge */}
      <div className="px-3 py-2 flex items-center print:p-1.5">
        <span className="font-mono text-[11px] font-bold text-foreground bg-muted/80 px-2 py-0.5 rounded-md border border-border/60 inline-flex items-center gap-1.5 whitespace-nowrap print:bg-neutral-100 print:text-black print:border-neutral-300 print:text-[10px] print:px-1.5 print:py-0.5">
          <Clock className="size-3 text-primary shrink-0 print:text-neutral-600" />
          <span>
            {slot.startTime} – {slot.endTime}
          </span>
        </span>
      </div>

      {/* 1. SUBJECT */}
      <div className="px-3 py-2 print:px-1.5 print:py-1">
        <h4
          className="font-bold text-xs sm:text-sm text-foreground tracking-tight leading-snug line-clamp-2 print:text-xs print:text-black print:line-clamp-none"
          title={slot.subject || "Class Session"}
        >
          {slot.subject || "Class Session"}
        </h4>
      </div>

      {/* 2. TEACHER & 3. BATCH SECTION */}
      {showFooter && (
        <div className="px-3 py-2 flex flex-col gap-1.5 text-xs print:px-1.5 print:py-1 print:gap-1 print:text-[10px]">
          {/* 2. Teacher Name (Hide when filtering by teacher) */}
          {showTeacher && (
            <div
              className="flex items-center gap-1.5 min-w-0"
              title={`Teacher: ${slot.teacher?.name || "Unassigned"}`}
            >
              <User className="size-3.5 text-primary shrink-0 print:size-3 print:text-neutral-500" />
              <span className="font-semibold text-xs text-foreground truncate print:text-[10px] print:text-black">
                {slot.teacher?.name || "Unassigned"}
              </span>
            </div>
          )}

          {/* 3. Batch Name (Hide when filtering by batch) */}
          {showBatch && slot.batch && (
            <div
              className="flex items-center gap-1.5 min-w-0"
              title={`Batch: ${slot.batch.name}`}
            >
              <GraduationCap className="size-3.5 text-indigo-500 dark:text-indigo-400 shrink-0 print:size-3 print:text-neutral-500" />
              <span className="font-medium text-xs text-foreground/80 truncate print:text-[10px] print:text-black">
                {slot.batch.name}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
