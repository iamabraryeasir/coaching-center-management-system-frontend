"use client";

import {
  ArrowLeft,
  Calendar,
  CreditCard,
  Edit2,
  Layers,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useBatch, useBatchStudents } from "@/hooks";
import { cn } from "@/lib/utils";
import { BatchStatusBadge } from "./batch-status-badge";
import { BatchStudentRoster } from "./batch-student-roster";
import { CreateBatchDialog } from "./create-batch-dialog";

interface BatchDetailViewProps {
  batchId: string;
}

export function BatchDetailView({ batchId }: BatchDetailViewProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  const { data: batchResponse, isLoading: isBatchLoading } = useBatch(batchId);
  const { data: studentsResponse } = useBatchStudents(batchId, { limit: 1 });

  const batch = batchResponse?.data;
  const enrolledCount = studentsResponse?.meta?.total ?? 0;

  const formattedDate = batch?.createdAt
    ? new Date(batch.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

  if (isBatchLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-24" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-8 w-72" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: Loading skeleton
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="py-16 text-center space-y-4">
        <div className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground mx-auto">
          <Layers className="size-7" />
        </div>
        <h2 className="font-heading text-lg font-bold text-foreground">
          Batch Not Found
        </h2>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          The requested batch does not exist or may have been archived.
        </p>
        <Link
          href="/dashboard/admin/batches"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "gap-1.5 text-xs inline-flex items-center",
          )}
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to All Batches</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation and Top Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Link
            href="/dashboard/admin/batches"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "h-8 -ml-2 text-xs text-muted-foreground hover:text-foreground gap-1.5 mb-1 inline-flex items-center",
            )}
          >
            <ArrowLeft className="size-3.5" />
            <span>Batches Directory</span>
          </Link>

          <div className="flex items-center gap-3">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {batch.name}
            </h2>
            <BatchStatusBadge status={batch.status} />
          </div>
          <p className="text-xs text-muted-foreground font-mono">
            Batch ID: {batch.id}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditOpen(true)}
            className="gap-1.5 text-xs"
          >
            <Edit2 className="size-3.5" />
            <span>Edit Parameters</span>
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <Card className="border-border/80 bg-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Users className="size-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Enrolled Students</p>
              <p className="font-heading text-xl font-bold text-foreground">
                {enrolledCount}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Course Fee */}
        <Card className="border-border/80 bg-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="size-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <CreditCard className="size-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Course Fee</p>
              <p className="font-heading text-xl font-bold text-foreground">
                ৳ {batch.fee.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Status */}
        <Card className="border-border/80 bg-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="size-10 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <Layers className="size-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Current Status</p>
              <p className="font-heading text-base font-semibold text-foreground">
                {batch.status}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Created Date */}
        <Card className="border-border/80 bg-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="size-10 rounded-lg bg-muted text-muted-foreground flex items-center justify-center font-bold">
              <Calendar className="size-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Created On</p>
              <p className="font-heading text-base font-semibold text-foreground">
                {formattedDate}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student Roster */}
      <BatchStudentRoster batchId={batch.id} batchName={batch.name} />

      {/* Edit Batch Dialog */}
      <CreateBatchDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        batchToEdit={batch}
      />
    </div>
  );
}
