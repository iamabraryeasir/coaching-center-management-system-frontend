"use client";

import { AlertCircle, BookOpen, CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRequestBatchEnrollmentMutation } from "@/hooks";
import type { Batch } from "@/types";
import { BatchStatusBadge } from "./batch-status-badge";

interface RequestEnrollmentDialogProps {
  batch: Batch | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function RequestEnrollmentDialog({
  batch,
  open,
  onOpenChange,
  onSuccess,
}: RequestEnrollmentDialogProps) {
  const enrollmentMutation = useRequestBatchEnrollmentMutation();

  if (!batch) return null;

  const handleConfirm = async () => {
    try {
      await enrollmentMutation.mutateAsync(batch.id);
      onOpenChange(false);
      onSuccess?.();
    } catch {
      // Toast error handled in mutation hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <BookOpen className="size-4" />
            </div>
            <DialogTitle>Request Batch Enrollment</DialogTitle>
          </div>
          <DialogDescription>
            Confirm your application to enroll in this batch.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Batch details summary card */}
          <div className="rounded-lg border border-border/80 bg-muted/40 p-3.5 space-y-2.5">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-heading font-semibold text-base text-foreground">
                {batch.name}
              </h4>
              <BatchStatusBadge status={batch.status} />
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CreditCard className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Monthly Tuition Fee:</span>
              <span className="font-semibold text-foreground">
                ৳ {batch.fee.toLocaleString("en-BD")}
              </span>
            </div>
          </div>

          {/* Guidance Callout */}
          <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-3 flex gap-2.5 text-xs text-muted-foreground leading-relaxed">
            <AlertCircle className="size-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <p>
              Your enrollment request will be queued for administrator review.
              Once approved, you will be notified and your weekly routine and
              exam schedules will be activated.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2.5">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={enrollmentMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={enrollmentMutation.isPending}
            className="gap-2"
          >
            {enrollmentMutation.isPending && (
              <Loader2 className="size-4 animate-spin" />
            )}
            Confirm Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
