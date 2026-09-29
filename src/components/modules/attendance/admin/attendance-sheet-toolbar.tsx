"use client";

import {
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Layers,
  Loader2,
  Lock,
  RotateCcw,
  Save,
  Search,
  ShieldAlert,
  XCircle,
} from "lucide-react";
import { DatePicker } from "@/components/forms/date-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Batch } from "@/types";

interface AttendanceSheetToolbarProps {
  batches: Batch[];
  selectedBatchId: string;
  onSelectBatchId: (batchId: string) => void;
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (date: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onMarkAllPresent: () => void;
  onMarkAllAbsent: () => void;
  onReset: () => void;
  onSave: () => void;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  disabled?: boolean;
  isReadOnly?: boolean;
}

export function AttendanceSheetToolbar({
  batches,
  selectedBatchId,
  onSelectBatchId,
  selectedDate,
  onSelectDate,
  searchQuery,
  onSearchChange,
  onMarkAllPresent,
  onMarkAllAbsent,
  onReset,
  onSave,
  isSaving,
  hasUnsavedChanges,
  disabled = false,
  isReadOnly = false,
}: AttendanceSheetToolbarProps) {
  const todayStr = new Date().toISOString().split("T")[0];
  const isToday = selectedDate === todayStr;
  const isNextDisabled = isToday || selectedDate >= todayStr;

  // Step 1 day backwards
  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    onSelectDate(d.toISOString().split("T")[0]);
  };

  // Step 1 day forward (only if before today)
  const handleNextDay = () => {
    if (isNextDisabled) return;
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    const nextStr = d.toISOString().split("T")[0];
    if (nextStr <= todayStr) {
      onSelectDate(nextStr);
    }
  };

  // Set today
  const handleToday = () => {
    onSelectDate(todayStr);
  };

  return (
    <div className="rounded-xl border border-border/70 bg-card/60 p-3.5 shadow-2xs space-y-3.5">
      {/* Top Row: Batch Selector + Date Navigator + Primary Save Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 flex-1 min-w-0">
          {/* 1. Batch Selector */}
          <div className="w-full sm:w-56 lg:w-64 shrink-0">
            <Select
              value={selectedBatchId || null}
              onValueChange={(val) => val && onSelectBatchId(val)}
              disabled={disabled || batches.length === 0}
            >
              <SelectTrigger className="h-9 text-xs w-full bg-background font-medium">
                <SelectValue
                  placeholder={
                    batches.length === 0
                      ? "Loading batches..."
                      : "Select Batch..."
                  }
                >
                  {(val: string | null) => {
                    const selected = batches.find((b) => b.id === val);
                    return selected ? (
                      <div className="flex items-center gap-2 truncate">
                        <Layers className="size-3.5 text-primary shrink-0" />
                        <span className="truncate">{selected.name}</span>
                      </div>
                    ) : (
                      "Select Batch..."
                    );
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="w-64 max-h-60">
                {batches.map((batch) => (
                  <SelectItem
                    key={batch.id}
                    value={batch.id}
                    className="text-xs py-2"
                  >
                    <div className="flex flex-col min-w-0">
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

          {/* 2. Date Stepper & Picker (Future dates blocked) */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <div className="inline-flex items-center rounded-lg border border-border/70 bg-background p-0.5 shadow-2xs shrink-0">
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={handlePrevDay}
                aria-label="Previous day"
                className="size-7 text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft className="size-3.5" />
              </Button>

              <Button
                type="button"
                variant={isToday ? "secondary" : "ghost"}
                size="xs"
                onClick={handleToday}
                className="h-7 px-2.5 text-xs font-semibold"
              >
                Today
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={handleNextDay}
                disabled={isNextDisabled}
                aria-label="Next day"
                className="size-7 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="size-3.5" />
              </Button>
            </div>

            {/* Shadcn Date Picker (Clamped to Today Max) */}
            <DatePicker
              value={selectedDate}
              onChange={onSelectDate}
              toDate={new Date()}
              disabled={disabled}
              className="h-9 flex-1 sm:w-40 sm:flex-none"
            />
          </div>
        </div>

        {/* 3. Primary Action Button or Read-Only Status Indicator */}
        <div className="flex items-center justify-end w-full sm:w-auto shrink-0">
          {isReadOnly ? (
            <div className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-muted/60 text-muted-foreground border border-border/80 text-xs font-semibold w-full sm:w-auto">
              <Lock className="size-3.5 text-muted-foreground shrink-0" />
              <span>Historical View (Read-Only)</span>
            </div>
          ) : (
            <Button
              type="button"
              onClick={onSave}
              disabled={isSaving || disabled}
              size="sm"
              className="gap-1.5 font-medium shadow-sm w-full sm:w-auto min-w-32"
            >
              {isSaving ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="size-3.5" />
                  <span>Save Attendance</span>
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Bottom Row: Search Filter & One-Click Bulk Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 pt-2 border-t border-border/60">
        {/* Search student */}
        <div className="relative w-full sm:w-64">
          <Search className="size-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search student by name..."
            className="h-8 pl-8 text-xs bg-background"
          />
        </div>

        {/* Quick Bulk Actions (Only visible in Today edit mode) */}
        {!isReadOnly ? (
          <div className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap">
            <span className="text-[11px] text-muted-foreground font-medium mr-1 hidden md:inline">
              Quick Actions:
            </span>

            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={onMarkAllPresent}
              disabled={disabled}
              className="h-7 text-xs gap-1 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10 hover:text-emerald-800 flex-1 sm:flex-initial"
            >
              <CheckCheck className="size-3 text-emerald-600 dark:text-emerald-400" />
              <span>Mark All Present</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={onMarkAllAbsent}
              disabled={disabled}
              className="h-7 text-xs gap-1 border-destructive/30 text-destructive dark:text-rose-400 hover:bg-destructive/10 hover:text-destructive flex-1 sm:flex-initial"
            >
              <XCircle className="size-3" />
              <span>Mark All Absent</span>
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={onReset}
              disabled={disabled || !hasUnsavedChanges}
              className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground shrink-0"
            >
              <RotateCcw className="size-3" />
              <span>Reset</span>
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ShieldAlert className="size-3.5 text-amber-500 shrink-0" />
            <span>
              Past attendance records are locked for historical auditing.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
