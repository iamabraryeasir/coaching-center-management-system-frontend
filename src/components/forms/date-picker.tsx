"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface DatePickerProps {
  /** Value as a Date or YYYY-MM-DD string */
  value?: Date | string | null;
  /** Callback returning the YYYY-MM-DD string or Date */
  onChange?: (dateString: string, dateObj?: Date) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Custom trigger button className */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Custom date format string for display (defaults to "PPP") */
  dateFormat?: string;
  /** Min selectable date */
  fromDate?: Date;
  /** Max selectable date */
  toDate?: Date;
}

/**
 * Safely parse a date string or Date instance without UTC timezone shifting
 */
function parseDateValue(val?: Date | string | null): Date | undefined {
  if (!val) return undefined;
  if (val instanceof Date) {
    return Number.isNaN(val.getTime()) ? undefined : val;
  }
  if (typeof val === "string") {
    const parts = val.split("-");
    if (parts.length === 3) {
      const year = Number.parseInt(parts[0], 10);
      const month = Number.parseInt(parts[1], 10) - 1;
      const day = Number.parseInt(parts[2], 10);
      const d = new Date(year, month, day);
      return Number.isNaN(d.getTime()) ? undefined : d;
    }
    const d = new Date(val);
    return Number.isNaN(d.getTime()) ? undefined : d;
  }
  return undefined;
}

/**
 * Format a Date instance to a local YYYY-MM-DD string
 */
function toLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  className,
  disabled = false,
  dateFormat = "PPP",
  fromDate,
  toDate,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const selectedDate = React.useMemo(() => parseDateValue(value), [value]);

  const handleSelect = (day?: Date) => {
    if (day) {
      const formattedIso = toLocalDateString(day);
      onChange?.(formattedIso, day);
      setOpen(false);
    }
  };

  const isDateDisabled = React.useCallback(
    (date: Date) => {
      if (fromDate && date < fromDate) return true;
      if (toDate && date > toDate) return true;
      return false;
    },
    [fromDate, toDate],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn(
              "h-9 justify-start text-left font-normal text-xs bg-background shadow-2xs gap-2 px-3 min-w-36",
              !selectedDate && "text-muted-foreground",
              className,
            )}
          >
            <CalendarIcon className="size-3.5 text-muted-foreground shrink-0" />
            <span className="truncate">
              {selectedDate ? format(selectedDate, dateFormat) : placeholder}
            </span>
          </Button>
        }
      />
      <PopoverContent
        className="w-auto p-0 z-50 border border-border/80 shadow-lg"
        align="start"
      >
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          disabled={fromDate || toDate ? isDateDisabled : undefined}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}
