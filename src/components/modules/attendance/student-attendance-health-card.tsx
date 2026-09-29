"use client";

interface StudentAttendanceHealthCardProps {
  attendanceRate: number;
  totalSessions: number;
  presentCount: number;
}

export function StudentAttendanceHealthCard({
  attendanceRate,
  totalSessions,
  presentCount,
}: StudentAttendanceHealthCardProps) {
  const roundedRate = Math.round(attendanceRate * 10) / 10;

  return (
    <div className="rounded-xl border border-border/80 bg-card p-4 sm:p-5 shadow-2xs">
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h3 className="font-heading text-base sm:text-lg font-semibold text-foreground">
            Overall Attendance
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {totalSessions > 0 ? (
              <>
                Attended{" "}
                <span className="font-medium text-foreground">
                  {presentCount}
                </span>{" "}
                of{" "}
                <span className="font-medium text-foreground">
                  {totalSessions}
                </span>{" "}
                conducted lecture sessions.
              </>
            ) : (
              "No lecture attendance sessions recorded yet."
            )}
          </p>
        </div>

        <div className="flex items-baseline gap-1.5 self-start sm:self-auto shrink-0">
          <span className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {roundedRate}%
          </span>
          <span className="text-xs text-muted-foreground">attendance rate</span>
        </div>
      </div>

      {/* Minimal subtle progress bar */}
      <div className="mt-3.5 sm:mt-4">
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${Math.min(100, Math.max(0, roundedRate))}%` }}
          />
        </div>
      </div>
    </div>
  );
}
