"use client";

import {
  CheckCircle2,
  Clock,
  Loader2,
  MapPin,
  MessageSquare,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  useMyTeacherAttendanceSummary,
  useTeacherCheckInMutation,
} from "@/hooks";
import { cn } from "@/lib/utils";
import type { TeacherAttendanceRecord } from "@/types";

interface TeacherSelfCheckInCardProps {
  className?: string;
}

function getLocalDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isDateToday(dateInput?: string | null): boolean {
  if (!dateInput) return false;
  const now = new Date();
  const localToday = getLocalDateString();
  const utcToday = now.toISOString().split("T")[0];

  if (dateInput.startsWith(localToday) || dateInput.startsWith(utcToday)) {
    return true;
  }

  try {
    const d = new Date(dateInput);
    if (!Number.isNaN(d.getTime())) {
      return (
        d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth() &&
        d.getDate() === now.getDate()
      );
    }
  } catch {
    // Ignore date parse errors
  }

  return false;
}

function formatCheckInTime(timeInput?: string | null): string {
  if (!timeInput) return "";
  const trimmed = timeInput.trim();

  // Already nicely formatted like "10:53 AM" or "4:53 PM"
  if (/^\d{1,2}:\d{2}\s*(AM|PM)$/i.test(trimmed)) {
    return trimmed;
  }

  // 24h format like "16:53" or "09:30"
  if (/^\d{1,2}:\d{2}$/.test(trimmed)) {
    const [h, m] = trimmed.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const hour = h % 12 || 12;
    return `${hour}:${String(m).padStart(2, "0")} ${period}`;
  }

  // ISO timestamp or parseable date string (e.g. "2026-09-27T10:53:10.847Z")
  try {
    const d = new Date(trimmed);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    }
  } catch {
    // Ignore parse error
  }

  return trimmed;
}

export function TeacherSelfCheckInCard({
  className,
}: TeacherSelfCheckInCardProps) {
  const [remarks, setRemarks] = useState("");
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [localCheckIn, setLocalCheckIn] =
    useState<TeacherAttendanceRecord | null>(null);

  const localDateStr = getLocalDateString();
  const storageKey = `teacher_checkin_${localDateStr}`;

  // Check localStorage on mount for today's recorded check-in
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setLocalCheckIn(JSON.parse(stored));
      }
    } catch {
      // Ignore storage read error
    }
  }, [storageKey]);

  const {
    data: summaryResponse,
    isLoading,
    refetch,
  } = useMyTeacherAttendanceSummary({
    limit: 10,
  });
  const checkInMutation = useTeacherCheckInMutation();

  // Find attendance record array from any potential API response structure
  const rawData =
    (summaryResponse as { data?: unknown })?.data ?? summaryResponse;
  const rawObj = rawData as Record<string, unknown> | null;

  const historyList: unknown[] =
    (Array.isArray(rawData) && rawData) ||
    (Array.isArray(rawObj?.history) && (rawObj?.history as unknown[])) ||
    (Array.isArray(rawObj?.records) && (rawObj?.records as unknown[])) ||
    (Array.isArray(rawObj?.data) && (rawObj?.data as unknown[])) ||
    (Array.isArray(rawObj?.items) && (rawObj?.items as unknown[])) ||
    [];

  const serverTodayRecord = historyList.find((item: unknown) => {
    const h = item as Record<string, unknown>;
    return (
      isDateToday(typeof h?.date === "string" ? h.date : null) ||
      isDateToday(typeof h?.createdAt === "string" ? h.createdAt : null)
    );
  }) as TeacherAttendanceRecord | undefined;

  const activeRecord = localCheckIn || serverTodayRecord;
  const isCheckedInToday = Boolean(activeRecord);

  // Sync server record to localStorage if found
  useEffect(() => {
    if (serverTodayRecord && !localCheckIn) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(serverTodayRecord));
      } catch {
        // Ignore storage write error
      }
    }
  }, [serverTodayRecord, localCheckIn, storageKey]);

  const recordCheckInLocally = (record?: Partial<TeacherAttendanceRecord>) => {
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    const fullRecord: TeacherAttendanceRecord = {
      id: record?.id || `local-${Date.now()}`,
      teacherId: record?.teacherId || "",
      date: record?.date || now.toISOString(),
      status: record?.status || "PRESENT",
      checkInTime: record?.checkInTime || timeFormatted,
      remarks: record?.remarks || remarks || undefined,
    };

    setLocalCheckIn(fullRecord);
    try {
      localStorage.setItem(storageKey, JSON.stringify(fullRecord));
    } catch {
      // Ignore storage write error
    }
  };

  const handleCheckInWithNote = async () => {
    try {
      const trimmed = remarks.trim();
      const res = await checkInMutation.mutateAsync({
        remarks: trimmed || undefined,
      });
      recordCheckInLocally(res?.data || { remarks: trimmed });
      setRemarks("");
      setIsNoteDialogOpen(false);
      refetch();
    } catch (err: unknown) {
      const e = err as {
        data?: { message?: string };
        response?: { _data?: { message?: string } };
        message?: string;
        status?: number;
      };
      const msg =
        e?.data?.message || e?.response?._data?.message || e?.message || "";
      if (
        msg.toLowerCase().includes("already") ||
        e?.status === 400 ||
        e?.status === 409
      ) {
        recordCheckInLocally({ remarks: "Already checked in" });
        setIsNoteDialogOpen(false);
      }
    }
  };

  const handleQuickCheckIn = async () => {
    try {
      const res = await checkInMutation.mutateAsync({});
      recordCheckInLocally(res?.data);
      refetch();
    } catch (err: unknown) {
      const e = err as {
        data?: { message?: string };
        response?: { _data?: { message?: string } };
        message?: string;
        status?: number;
      };
      const msg =
        e?.data?.message || e?.response?._data?.message || e?.message || "";
      if (
        msg.toLowerCase().includes("already") ||
        e?.status === 400 ||
        e?.status === 409
      ) {
        recordCheckInLocally();
      }
    }
  };

  const todayFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  // If already checked in today, render the subtle green confirmation banner
  if (isCheckedInToday) {
    const displayStatus = (activeRecord?.status || "PRESENT").toUpperCase();
    const statusLabel = displayStatus === "LATE" ? "Late" : "On Time";
    const formattedTime = formatCheckInTime(
      activeRecord?.checkInTime || activeRecord?.createdAt,
    );
    const displayRemarks = activeRecord?.remarks;

    // Filter out generic backend boilerplate remarks like "Teacher self check-in"
    const hasCustomRemarks =
      displayRemarks &&
      !displayRemarks.toLowerCase().includes("teacher self check-in") &&
      !displayRemarks.toLowerCase().includes("checked in");

    return (
      <div
        className={cn(
          "flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-2.5 shadow-2xs transition-all",
          className,
        )}
      >
        <div className="flex items-center gap-2.5">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-4" />
          </div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
            <span className="font-semibold text-emerald-700 dark:text-emerald-300">
              Checked In for Today
            </span>
            {formattedTime && (
              <>
                <span className="text-muted-foreground/50">•</span>
                <span className="text-muted-foreground">
                  Arrived at{" "}
                  <strong className="font-medium text-foreground">
                    {formattedTime}
                  </strong>{" "}
                  <span className="text-muted-foreground/80 font-normal">
                    ({statusLabel})
                  </span>
                </span>
              </>
            )}
            {hasCustomRemarks && (
              <>
                <span className="text-muted-foreground/50">•</span>
                <span className="text-muted-foreground italic">
                  "{displayRemarks}"
                </span>
              </>
            )}
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          On Campus
        </span>
      </div>
    );
  }

  // When check-in is pending, render the action banner
  return (
    <>
      <div
        className={cn(
          "flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 shadow-2xs transition-all",
          className,
        )}
      >
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-300">
            <MapPin className="size-4" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">
                Daily Campus Check-In
              </span>
              <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wide">
                Pending
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Record your on-campus presence for today’s academic schedule (
              {todayFormatted}).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsNoteDialogOpen(true)}
            disabled={checkInMutation.isPending || isLoading}
            className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <MessageSquare className="size-3.5" />
            <span>Add Note</span>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleQuickCheckIn}
            disabled={checkInMutation.isPending || isLoading}
            className="h-8 gap-1.5 font-medium shadow-2xs bg-primary"
          >
            {checkInMutation.isPending ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Checking In...</span>
              </>
            ) : (
              <>
                <Clock className="size-3.5" />
                <span>Check In Now</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Optional Note / Remarks Dialog */}
      <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg">
              Daily Campus Check-In
            </DialogTitle>
            <DialogDescription className="text-xs">
              Log your campus arrival with optional room, branch, or activity
              notes.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <label
                htmlFor="remarks"
                className="text-xs font-medium text-foreground"
              >
                Check-in Remarks (Optional)
              </label>
              <Input
                id="remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="e.g. Arrived for 10 AM physics lecture at Lab 2..."
                className="h-9 text-xs"
                disabled={checkInMutation.isPending}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !checkInMutation.isPending) {
                    handleCheckInWithNote();
                  }
                }}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsNoteDialogOpen(false)}
              disabled={checkInMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleCheckInWithNote}
              disabled={checkInMutation.isPending}
              className="gap-1.5 shadow-2xs"
            >
              {checkInMutation.isPending ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Logging...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-3.5" />
                  <span>Confirm Check-In</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
