"use client";

import { Calendar, Layers, Plus, Printer, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Batch, User } from "@/types";

export type RoutineViewMode = "all" | "batch" | "teacher";

interface RoutineToolbarProps {
  viewMode: RoutineViewMode;
  onViewModeChange: (mode: RoutineViewMode) => void;
  selectedBatchId: string;
  onSelectBatchId: (id: string) => void;
  batches: Batch[];
  selectedTeacherId: string;
  onSelectTeacherId: (id: string) => void;
  teachers: User[];
  onAddSlot: () => void;
  onPrint: () => void;
}

export function RoutineToolbar({
  viewMode,
  onViewModeChange,
  selectedBatchId,
  onSelectBatchId,
  batches,
  selectedTeacherId,
  onSelectTeacherId,
  teachers,
  onAddSlot,
  onPrint,
}: RoutineToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-border/70 bg-card/60 p-3 shadow-2xs">
      {/* Left: View Mode Select & Entity Selector */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center flex-wrap">
        {/* View Mode Switcher Select */}
        <div className="w-full sm:w-44">
          <Select
            value={viewMode}
            onValueChange={(val) =>
              val && onViewModeChange(val as RoutineViewMode)
            }
          >
            <SelectTrigger className="h-9 text-xs w-full bg-background font-medium">
              <SelectValue placeholder="Select View Mode">
                {(val: string | null) => {
                  if (val === "batch") {
                    return (
                      <div className="flex items-center gap-2">
                        <Layers className="size-3.5 text-muted-foreground" />
                        <span>By Batch</span>
                      </div>
                    );
                  }
                  if (val === "teacher") {
                    return (
                      <div className="flex items-center gap-2">
                        <Users className="size-3.5 text-muted-foreground" />
                        <span>By Faculty</span>
                      </div>
                    );
                  }
                  return (
                    <div className="flex items-center gap-2">
                      <Calendar className="size-3.5 text-muted-foreground" />
                      <span>All Classes</span>
                    </div>
                  );
                }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="w-44">
              <SelectItem value="all" className="text-xs py-2">
                <div className="flex items-center gap-2">
                  <Calendar className="size-3.5 text-muted-foreground" />
                  <span>All Classes</span>
                </div>
              </SelectItem>
              <SelectItem value="batch" className="text-xs py-2">
                <div className="flex items-center gap-2">
                  <Layers className="size-3.5 text-muted-foreground" />
                  <span>By Batch</span>
                </div>
              </SelectItem>
              <SelectItem value="teacher" className="text-xs py-2">
                <div className="flex items-center gap-2">
                  <Users className="size-3.5 text-muted-foreground" />
                  <span>By Faculty</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Entity Selector or All Status Badge */}
        {viewMode === "all" ? (
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-xs font-medium text-primary">
            <Sparkles className="size-3.5 shrink-0" />
            <span>Master Schedule (All Batches & Faculty)</span>
          </div>
        ) : viewMode === "batch" ? (
          <div className="w-full sm:w-64">
            <Select
              value={selectedBatchId || null}
              onValueChange={(val) => val && onSelectBatchId(val)}
              disabled={batches.length === 0}
            >
              <SelectTrigger className="h-9 text-xs w-full bg-background">
                <SelectValue
                  placeholder={
                    batches.length === 0
                      ? "Loading batches..."
                      : "Select Academic Batch..."
                  }
                >
                  {(val: string | null) => {
                    const selected = batches.find((b) => b.id === val);
                    return (
                      selected?.name || (val ? val : "Select Academic Batch...")
                    );
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="w-64 max-h-60">
                {batches.map((batch) => (
                  <SelectItem
                    key={batch.id}
                    value={batch.id}
                    className="text-xs py-1.5"
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground truncate">
                        {batch.name}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        Fee: ৳{batch.fee.toLocaleString()}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="w-full sm:w-64">
            <Select
              value={selectedTeacherId || null}
              onValueChange={(val) => val && onSelectTeacherId(val)}
              disabled={teachers.length === 0}
            >
              <SelectTrigger className="h-9 text-xs w-full bg-background">
                <SelectValue
                  placeholder={
                    teachers.length === 0
                      ? "Loading faculty..."
                      : "Select Faculty Teacher..."
                  }
                >
                  {(val: string | null) => {
                    const selected = teachers.find((t) => t.id === val);
                    return (
                      selected?.name ||
                      (val ? val : "Select Faculty Teacher...")
                    );
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="w-64 max-h-60">
                {teachers.map((teacher) => (
                  <SelectItem
                    key={teacher.id}
                    value={teacher.id}
                    className="text-xs py-1.5"
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground truncate">
                        {teacher.name}
                      </span>
                      <span className="text-[11px] text-muted-foreground truncate">
                        {teacher.teacherProfile?.designation ||
                          "Faculty Member"}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Right: Actions (Print, Add Class) */}
      <div className="flex items-center gap-2 flex-wrap justify-end">
        {/* Print Timetable Button (A4 Browser Print) */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onPrint}
          className="gap-1.5 text-xs font-medium h-9"
          title="Print weekly routine on A4 paper"
        >
          <Printer className="size-3.5 text-muted-foreground" />
          <span>Print</span>
        </Button>

        {/* Schedule Class Slot */}
        <Button
          type="button"
          size="sm"
          onClick={onAddSlot}
          className="gap-1.5 text-xs font-medium h-9 shadow-xs"
        >
          <Plus className="size-4" />
          <span>Schedule Class</span>
        </Button>
      </div>
    </div>
  );
}
