"use client";

import {
  ArrowRight,
  Calendar,
  CreditCard,
  Edit2,
  Layers,
  MoreHorizontal,
  Trash2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Batch } from "@/types";
import { BatchStatusBadge } from "./batch-status-badge";

interface BatchCardProps {
  batch: Batch;
  onEdit: (batch: Batch) => void;
  onDelete: (batch: Batch) => void;
}

export function BatchCard({ batch, onEdit, onDelete }: BatchCardProps) {
  const formattedDate = batch.createdAt
    ? new Date(batch.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

  return (
    <Card className="flex flex-col justify-between overflow-hidden transition-all duration-200 hover:shadow-md hover:border-primary/40 border-border/80 bg-card">
      <CardHeader className="p-4 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Layers className="size-4.5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-heading font-semibold text-sm text-foreground truncate">
                {batch.name}
              </h3>
              <p className="text-[11px] text-muted-foreground font-mono">
                ID: {batch.id.slice(0, 8)}
              </p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="size-7 text-muted-foreground hover:text-foreground"
                />
              }
            >
              <MoreHorizontal className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem
                render={
                  <Link
                    href={`/dashboard/admin/batches/${batch.id}`}
                    className="flex items-center gap-2 text-xs w-full"
                  />
                }
              >
                <Users className="size-3.5 text-muted-foreground" />
                <span>View Roster</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onEdit(batch)}
                className="gap-2 text-xs"
              >
                <Edit2 className="size-3.5 text-muted-foreground" />
                <span>Edit Parameters</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(batch)}
                className="gap-2 text-xs text-destructive focus:bg-destructive/10 focus:text-destructive"
              >
                <Trash2 className="size-3.5" />
                <span>Cancel / Archive</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="px-4 py-2 space-y-3">
        {/* Status and Fee badges */}
        <div className="flex items-center justify-between gap-2">
          <BatchStatusBadge status={batch.status} />
          <div className="flex items-center gap-1 text-sm font-semibold text-foreground">
            <CreditCard className="size-3.5 text-muted-foreground" />
            <span>৳ {batch.fee.toLocaleString()}</span>
          </div>
        </div>

        {/* Date and details row */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/40">
          <div className="flex items-center gap-1">
            <Calendar className="size-3 text-muted-foreground" />
            <span>Created {formattedDate}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-2 border-t border-border/50 bg-muted/20">
        <Link
          href={`/dashboard/admin/batches/${batch.id}`}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "w-full justify-between text-xs group",
          )}
        >
          <span>Manage Students</span>
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </CardFooter>
    </Card>
  );
}
