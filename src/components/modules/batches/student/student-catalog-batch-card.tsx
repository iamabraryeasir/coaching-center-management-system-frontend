"use client";

import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  UserPlus,
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
import type { Batch, EnrollmentStatus } from "@/types";
import { BatchStatusBadge } from "../shared/batch-status-badge";

interface StudentCatalogBatchCardProps {
  batch: Batch;
  enrollmentStatus?: EnrollmentStatus | null;
  onRequestEnroll: (batch: Batch) => void;
}

export function StudentCatalogBatchCard({
  batch,
  enrollmentStatus,
  onRequestEnroll,
}: StudentCatalogBatchCardProps) {
  const isEnrolled =
    enrollmentStatus === "ENROLLED" || enrollmentStatus === "APPROVED";
  const isPending = enrollmentStatus === "PENDING";
  const isRejected = enrollmentStatus === "REJECTED";
  const isClosed = batch.status === "COMPLETED" || batch.status === "CANCELLED";

  const routineCount = batch.routineCount ?? batch._count?.routines ?? 0;

  return (
    <Card className="flex flex-col justify-between overflow-hidden border-border/80 bg-card transition-all duration-200 hover:shadow-md hover:border-primary/30">
      <CardHeader className="p-5 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <BatchStatusBadge status={batch.status} />
              {isEnrolled && (
                <Badge
                  variant="outline"
                  className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-medium text-xs gap-1"
                >
                  <CheckCircle2 className="size-3" />
                  Enrolled
                </Badge>
              )}
              {isPending && (
                <Badge
                  variant="outline"
                  className="border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400 font-medium text-xs gap-1"
                >
                  <Clock className="size-3" />
                  Pending
                </Badge>
              )}
            </div>
            <h3 className="font-heading font-semibold text-lg text-foreground line-clamp-1">
              {batch.name}
            </h3>
          </div>
          <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <BookOpen className="size-4" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-0 space-y-3 flex-1">
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50 text-xs">
          <div>
            <span className="text-muted-foreground block">Monthly Tuition</span>
            <span className="font-semibold text-sm text-foreground">
              ৳ {batch.fee.toLocaleString("en-BD")}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground block">Weekly Classes</span>
            <span className="font-medium text-foreground">
              {routineCount > 0 ? `${routineCount} slots/week` : "Schedule TBA"}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-3 border-t border-border/60 bg-muted/20">
        {isEnrolled ? (
          <Link
            href="/dashboard/student/routines"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "w-full gap-1.5 text-xs",
            )}
          >
            <Calendar className="size-3.5" />
            View Routine Schedule
            <ArrowRight className="size-3 ml-auto" />
          </Link>
        ) : isPending ? (
          <Button
            variant="outline"
            size="sm"
            disabled
            className="w-full gap-1.5 text-xs text-amber-700 dark:text-amber-400"
          >
            <Clock className="size-3.5" />
            Application Pending Review
          </Button>
        ) : isClosed ? (
          <Button
            variant="outline"
            size="sm"
            disabled
            className="w-full text-xs text-muted-foreground"
          >
            Enrollment Closed
          </Button>
        ) : (
          <Button
            type="button"
            size="sm"
            onClick={() => onRequestEnroll(batch)}
            className="w-full gap-1.5 text-xs"
          >
            <UserPlus className="size-3.5" />
            {isRejected ? "Re-apply for Batch" : "Request Enrollment"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
