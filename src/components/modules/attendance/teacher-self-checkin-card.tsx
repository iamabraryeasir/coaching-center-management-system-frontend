"use client";

import {
  CalendarCheck2,
  CheckCircle2,
  Loader2,
  MapPin,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  useMyTeacherAttendanceSummary,
  useTeacherCheckInMutation,
} from "@/hooks";
import { cn } from "@/lib/utils";

interface TeacherSelfCheckInCardProps {
  className?: string;
}

export function TeacherSelfCheckInCard({
  className,
}: TeacherSelfCheckInCardProps) {
  const [remarks, setRemarks] = useState("");
  const [showRemarksInput, setShowRemarksInput] = useState(false);

  const { data: summaryResponse, isLoading } = useMyTeacherAttendanceSummary({
    limit: 5,
  });
  const checkInMutation = useTeacherCheckInMutation();

  const history = summaryResponse?.data?.history || [];
  const todayStr = new Date().toISOString().split("T")[0];
  const todayRecord = history.find((h) => h.date.startsWith(todayStr));
  const isCheckedInToday = Boolean(todayRecord);

  const handleCheckIn = async () => {
    await checkInMutation.mutateAsync({
      remarks: remarks.trim() || undefined,
    });
    setRemarks("");
    setShowRemarksInput(false);
  };

  const todayFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Card
      className={cn("overflow-hidden border-border/70 shadow-2xs", className)}
    >
      <CardHeader className="pb-3 bg-muted/20 border-b border-border/60">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <CalendarCheck2 className="size-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold">
                Daily Campus Check-In
              </CardTitle>
              <CardDescription className="text-xs">
                {todayFormatted}
              </CardDescription>
            </div>
          </div>

          {isCheckedInToday && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-500/30">
              <CheckCircle2 className="size-3.5" />
              <span>Checked In</span>
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-3">
        {isCheckedInToday ? (
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3.5 flex items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <p className="font-semibold text-emerald-800 dark:text-emerald-200 flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-emerald-600" />
                Attendance Logged for Today
              </p>
              <p className="text-muted-foreground text-[11px]">
                Status:{" "}
                <strong className="text-foreground">
                  {todayRecord?.status}
                </strong>
                {todayRecord?.checkInTime && ` at ${todayRecord.checkInTime}`}
                {todayRecord?.remarks && ` (${todayRecord.remarks})`}
              </p>
            </div>
            <div className="flex size-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 shrink-0 font-bold text-xs">
              ✓
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Record your on-campus presence for today’s scheduled classroom
              lectures and academic sessions.
            </p>

            {showRemarksInput && (
              <Input
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Optional location / check-in notes..."
                className="h-8 text-xs bg-background"
                disabled={checkInMutation.isPending}
              />
            )}

            <div className="flex items-center gap-2">
              <Button
                type="button"
                onClick={handleCheckIn}
                disabled={checkInMutation.isPending || isLoading}
                size="sm"
                className="gap-1.5 font-medium shadow-sm flex-1 sm:flex-initial"
              >
                {checkInMutation.isPending ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Logging Check-In...</span>
                  </>
                ) : (
                  <>
                    <MapPin className="size-3.5" />
                    <span>Confirm Check-In Today</span>
                  </>
                )}
              </Button>

              {!showRemarksInput && (
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={() => setShowRemarksInput(true)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  + Add Note
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
