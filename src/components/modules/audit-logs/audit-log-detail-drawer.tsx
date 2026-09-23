"use client";

import {
  Calendar,
  Check,
  Code2,
  Copy,
  Globe,
  HardDrive,
  Laptop,
  ShieldCheck,
  User,
} from "lucide-react";
import { Suspense, useState } from "react";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuditLogDetail } from "@/hooks";
import type { AuditLog } from "@/types";
import {
  AuditActionBadge,
  AuditEntityBadge,
  AuditStatusBadge,
} from "./audit-log-badge";

export function AuditLogDetailSkeleton() {
  return (
    <div className="p-6 space-y-4">
      <Card size="sm">
        <CardHeader className="gap-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-9 w-full rounded-md" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 rounded" />
            <Skeleton className="h-6 w-20 rounded" />
            <Skeleton className="h-6 w-20 rounded" />
          </div>
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader>
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader>
          <Skeleton className="h-5 w-36" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-28 w-full rounded-md" />
        </CardContent>
      </Card>
    </div>
  );
}

interface AuditLogDetailContentProps {
  logId?: string | null;
  initialLog?: AuditLog | null;
  onClose: () => void;
}

function AuditLogDetailContent({
  logId,
  initialLog,
  onClose,
}: AuditLogDetailContentProps) {
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  const { data: detailResponse } = useAuditLogDetail(logId ?? undefined);
  const log = detailResponse?.data || initialLog;

  const handleCopyId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setCopiedId(true);
      toast.success("Event ID copied to clipboard!");
      setTimeout(() => setCopiedId(false), 2000);
    } catch {
      toast.error("Failed to copy ID");
    }
  };

  const handleCopyPayload = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedPayload(true);
      toast.success("JSON Payload copied to clipboard!");
      setTimeout(() => setCopiedPayload(false), 2000);
    } catch {
      toast.error("Failed to copy payload");
    }
  };

  if (!log) {
    return (
      <div className="p-8 text-center text-muted-foreground text-sm">
        Audit record not found.
      </div>
    );
  }

  const payloadData = log.payload || log.details || log.metadata;
  const payloadJson = payloadData
    ? typeof payloadData === "string"
      ? payloadData
      : JSON.stringify(payloadData, null, 2)
    : null;

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      {/* Event Header Banner with Badges */}
      <div className="p-6 pb-4 bg-muted/20 border-b border-border/70 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground font-medium">
            Event Identifier
          </span>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs gap-1.5"
            onClick={() => handleCopyId(log.id)}
          >
            {copiedId ? (
              <Check className="size-3.5 text-emerald-500" />
            ) : (
              <Copy className="size-3.5" />
            )}
            {copiedId ? "Copied" : "Copy ID"}
          </Button>
        </div>

        <div className="font-mono text-xs text-foreground font-semibold break-all bg-background/80 p-2.5 rounded-lg border border-border/60 select-all shadow-2xs">
          {log.id}
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <AuditActionBadge action={log.action} />
          <AuditStatusBadge status={log.status || "SUCCESS"} />
          <AuditEntityBadge entity={log.entity} />
        </div>
      </div>

      {/* Accessible Tabs Interface */}
      <Tabs defaultValue="overview" className="flex flex-col flex-1">
        <div className="px-6 pt-3 border-b border-border/60 bg-muted/10">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="text-xs">
              Overview
            </TabsTrigger>
            <TabsTrigger value="operator" className="text-xs">
              Operator & Device
            </TabsTrigger>
            <TabsTrigger value="payload" className="text-xs">
              Payload & Diffs
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Overview */}
        <TabsContent
          value="overview"
          className="p-6 space-y-4 focus-visible:outline-none"
        >
          <Card size="sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Calendar className="size-4 text-primary" />
                Execution Timestamp
              </CardTitle>
              <CardDescription>
                System clock recording of when this transaction was logged
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1 p-2.5 rounded-lg bg-muted/30 border border-border/40">
                  <span className="text-muted-foreground block text-[11px]">
                    Formatted Date
                  </span>
                  <span className="font-semibold text-foreground block">
                    {new Date(log.createdAt).toLocaleDateString(undefined, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="space-y-1 p-2.5 rounded-lg bg-muted/30 border border-border/40">
                  <span className="text-muted-foreground block text-[11px]">
                    Time (24h/12h)
                  </span>
                  <span className="font-mono font-semibold text-foreground block">
                    {new Date(log.createdAt).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card size="sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <HardDrive className="size-4 text-primary" />
                Target Entity Details
              </CardTitle>
              <CardDescription>
                Resource or record modified by this operation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30 border border-border/40">
                <span className="text-muted-foreground">Domain Entity:</span>
                <AuditEntityBadge entity={log.entity} />
              </div>
              <div className="space-y-1 p-2.5 rounded-lg bg-muted/30 border border-border/40">
                <span className="text-muted-foreground text-[11px] block">
                  Target Entity ID:
                </span>
                <span className="font-mono text-xs font-semibold text-foreground break-all select-all">
                  {log.entityId || "N/A (Global / Aggregate Operation)"}
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Operator & Device */}
        <TabsContent
          value="operator"
          className="p-6 space-y-4 focus-visible:outline-none"
        >
          <Card size="sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <User className="size-4 text-primary" />
                Operator Profile
              </CardTitle>
              <CardDescription>
                Authenticated user account responsible for this action
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/40">
                <div className="size-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs shrink-0 ring-1 ring-primary/20">
                  {log.user?.name
                    ? log.user.name.slice(0, 2).toUpperCase()
                    : "SYS"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {log.user?.name || log.userId || "System Daemon"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {log.user?.email || "internal@system.daemon"}
                  </p>
                </div>
                {log.user?.role && (
                  <Badge
                    variant="outline"
                    className="text-[11px] uppercase tracking-wider font-semibold"
                  >
                    {log.user.role}
                  </Badge>
                )}
              </div>
              <div className="p-2.5 rounded-lg bg-muted/30 border border-border/40 text-xs">
                <span className="text-muted-foreground text-[11px] block mb-1">
                  Internal User ID:
                </span>
                <span className="font-mono text-xs text-foreground select-all break-all">
                  {log.userId || "SYSTEM"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card size="sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Laptop className="size-4 text-primary" />
                Client & Network Environment
              </CardTitle>
              <CardDescription>
                Network origin and client telemetry at request time
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30 border border-border/40">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Globe className="size-3.5" />
                  Client IP Address
                </span>
                <span className="font-mono font-medium text-foreground bg-background px-2 py-0.5 rounded border border-border/60">
                  {log.ipAddress || "127.0.0.1 (Loopback)"}
                </span>
              </div>

              <div className="space-y-1.5 p-2.5 rounded-lg bg-muted/30 border border-border/40">
                <span className="text-muted-foreground text-[11px] block">
                  HTTP User-Agent:
                </span>
                <div className="font-mono text-[11px] text-muted-foreground break-all bg-background/80 p-2.5 rounded border border-border/40 leading-relaxed">
                  {log.userAgent || "Internal Service / Background Worker"}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Payload & Diffs */}
        <TabsContent
          value="payload"
          className="p-6 space-y-4 focus-visible:outline-none"
        >
          <Card size="sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Code2 className="size-4 text-primary" />
                Raw Execution Payload
              </CardTitle>
              <CardDescription>
                JSON request payload and modification state
              </CardDescription>
              {payloadJson && (
                <CardAction>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs gap-1.5"
                    onClick={() => handleCopyPayload(payloadJson)}
                  >
                    {copiedPayload ? (
                      <Check className="size-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                    {copiedPayload ? "Copied" : "Copy JSON"}
                  </Button>
                </CardAction>
              )}
            </CardHeader>
            <CardContent>
              {payloadJson ? (
                <pre className="font-mono text-xs text-foreground bg-muted/60 p-4 rounded-lg overflow-x-auto max-h-96 border border-border/50 whitespace-pre-wrap break-all leading-relaxed shadow-inner">
                  {payloadJson}
                </pre>
              ) : (
                <div className="p-8 text-center text-xs text-muted-foreground bg-muted/20 rounded-lg border border-dashed border-border/60">
                  No additional JSON payload diff recorded for this operation.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Accessible Sheet Footer */}
      <SheetFooter className="p-4 border-t border-border/80 bg-muted/20 flex flex-row items-center justify-between">
        <span className="text-[11px] text-muted-foreground font-mono">
          Security Audit Trail
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={onClose}
          className="text-xs"
        >
          Close Inspector
        </Button>
      </SheetFooter>
    </div>
  );
}

interface AuditLogDetailDrawerProps {
  logId?: string | null;
  initialLog?: AuditLog | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AuditLogDetailDrawer({
  logId,
  initialLog,
  isOpen,
  onClose,
}: AuditLogDetailDrawerProps) {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl p-0 flex flex-col gap-0 border-l border-border bg-background shadow-xl"
      >
        <SheetHeader className="p-6 border-b border-border/80 bg-muted/30">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-primary" />
            <SheetTitle className="text-lg font-bold">
              Audit Event Inspection
            </SheetTitle>
          </div>
          <SheetDescription className="text-xs text-muted-foreground">
            Immutable system audit log details and raw execution payload
          </SheetDescription>
        </SheetHeader>

        {isOpen && (
          <Suspense fallback={<AuditLogDetailSkeleton />}>
            <AuditLogDetailContent
              logId={logId}
              initialLog={initialLog}
              onClose={onClose}
            />
          </Suspense>
        )}
      </SheetContent>
    </Sheet>
  );
}
