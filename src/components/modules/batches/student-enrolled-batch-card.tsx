"use client";

import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  Layers,
  RotateCcw,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { EnrollmentStatus, StudentEnrolledBatch } from "@/types";
import { BatchStatusBadge } from "./batch-status-badge";

interface StudentEnrolledBatchCardProps {
  enrollment: StudentEnrolledBatch;
  onReapply?: (batchId: string) => void;
}

export function StudentEnrolledBatchCard({
  enrollment,
  onReapply,
}: StudentEnrolledBatchCardProps) {
  const batchName =
    enrollment.batch?.name || enrollment.batchName || "Enrolled Batch";
  const batchFee = enrollment.batch?.fee ?? enrollment.batchFee ?? 0;
  const batchStatus = enrollment.batch?.status;

  const enrollmentDate = enrollment.enrolledAt || enrollment.createdAt;
  const formattedDate = enrollmentDate
    ? new Date(enrollmentDate).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  const isEnrolled =
    enrollment.status === "ENROLLED" || enrollment.status === "APPROVED";
  const isPending = enrollment.status === "PENDING";
  const isRejected = enrollment.status === "REJECTED";

  return (
    <Card className="flex flex-col justify-between overflow-hidden border-border/80 bg-card transition-all duration-200 hover:shadow-md hover:border-primary/30">
      <CardHeader className="p-5 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <EnrollmentStatusBadge status={enrollment.status} />
              {batchStatus && (
                <BatchStatusBadge
                  status={batchStatus}
                  className="text-[10px] px-1.5 py-0"
                />
              )}
            </div>
            <h3 className="font-heading font-semibold text-lg text-foreground mt-1.5 line-clamp-1">
              {batchName}
            </h3>
          </div>
          <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Layers className="size-4" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-0 space-y-3.5 flex-1">
        {/* Fee & Date Row */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50 text-xs">
          <div>
            <span className="text-muted-foreground block">Monthly Tuition</span>
            <span className="font-semibold text-sm text-foreground">
              ৳ {batchFee.toLocaleString("en-BD")}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground block">
              {isEnrolled ? "Enrolled Date" : "Applied Date"}
            </span>
            <span className="font-medium text-foreground">
              {formattedDate || "—"}
            </span>
          </div>
        </div>

        {/* State Notice / Callout */}
        {isPending && (
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 flex gap-2.5 text-xs text-amber-700 dark:text-amber-400">
            <Clock className="size-4 shrink-0 mt-0.5" />
            <p>
              Your enrollment request is pending review by admin staff. You will
              be notified once approved.
            </p>
          </div>
        )}

        {isRejected && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 space-y-1 text-xs text-destructive">
            <div className="flex items-center gap-1.5 font-medium">
              <XCircle className="size-4 shrink-0" />
              <span>Application Not Approved</span>
            </div>
            {enrollment.rejectionReason && (
              <p className="text-muted-foreground pl-5.5">
                Reason: {enrollment.rejectionReason}
              </p>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-5 pt-3 border-t border-border/60 bg-muted/20 flex flex-wrap gap-2">
        {isEnrolled ? (
          <>
            <Link
              href="/dashboard/student/routines"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "flex-1 gap-1.5 text-xs",
              )}
            >
              <Calendar className="size-3.5" />
              Routines
            </Link>
            <Link
              href="/dashboard/student/payments"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "flex-1 gap-1.5 text-xs",
              )}
            >
              <CreditCard className="size-3.5" />
              Payments
            </Link>
          </>
        ) : isRejected && onReapply ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onReapply(enrollment.batchId)}
            className="w-full gap-1.5 text-xs"
          >
            <RotateCcw className="size-3.5" />
            Re-apply for this Batch
          </Button>
        ) : (
          <div className="w-full flex items-center justify-center py-1 text-xs text-muted-foreground">
            <Clock className="size-3.5 mr-1.5 text-amber-500" />
            Awaiting administrative confirmation
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

function EnrollmentStatusBadge({ status }: { status: EnrollmentStatus }) {
  switch (status) {
    case "ENROLLED":
    case "APPROVED":
      return (
        <Badge
          variant="outline"
          className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-medium text-xs gap-1"
        >
          <CheckCircle2 className="size-3" />
          Enrolled
        </Badge>
      );
    case "PENDING":
      return (
        <Badge
          variant="outline"
          className="border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400 font-medium text-xs gap-1"
        >
          <Clock className="size-3" />
          Pending Approval
        </Badge>
      );
    case "REJECTED":
      return (
        <Badge variant="destructive" className="font-medium text-xs gap-1">
          <AlertCircle className="size-3" />
          Rejected
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="font-medium text-xs">
          {status}
        </Badge>
      );
  }
}
