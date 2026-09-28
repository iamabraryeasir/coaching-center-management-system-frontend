"use client";

import {
  AlertTriangle,
  Globe,
  Laptop,
  Loader2,
  LogOut,
  RefreshCw,
  Shield,
  Smartphone,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useActiveSessions, useLogoutAllMutation } from "@/hooks";
import type { UserSession } from "@/types";

function getDeviceIcon(session: UserSession) {
  const ua = (session.userAgent || session.device || "").toLowerCase();
  if (
    ua.includes("mobile") ||
    ua.includes("android") ||
    ua.includes("iphone") ||
    ua.includes("ipad")
  ) {
    return <Smartphone className="size-4" />;
  }
  if (
    ua.includes("macintosh") ||
    ua.includes("windows") ||
    ua.includes("linux")
  ) {
    return <Laptop className="size-4" />;
  }
  return <Globe className="size-4" />;
}

function parseBrowserDetails(session: UserSession): string {
  if (session.browser && session.os) {
    return `${session.browser} on ${session.os}`;
  }
  if (session.userAgent) {
    const ua = session.userAgent;
    let browser = "Web Browser";
    let os = "Desktop";

    if (ua.includes("Chrome") && !ua.includes("Edg")) browser = "Chrome";
    else if (ua.includes("Firefox")) browser = "Firefox";
    else if (ua.includes("Safari") && !ua.includes("Chrome"))
      browser = "Safari";
    else if (ua.includes("Edg")) browser = "Edge";

    if (ua.includes("Windows")) os = "Windows";
    else if (ua.includes("Macintosh")) os = "macOS";
    else if (ua.includes("Linux")) os = "Linux";
    else if (ua.includes("Android")) os = "Android";
    else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";

    return `${browser} on ${os}`;
  }
  return "Unknown Device";
}

export function ActiveSessionsCard() {
  const {
    data: sessions,
    isLoading,
    isFetching,
    refetch,
  } = useActiveSessions();
  const logoutAllMutation = useLogoutAllMutation();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleLogoutAll = async () => {
    setIsConfirmOpen(false);
    try {
      await logoutAllMutation.mutateAsync();
    } catch {
      // Error handled by mutation
    }
  };

  const sessionList = sessions || [];

  return (
    <>
      <Card className="border-border/80 bg-card shadow-2xs">
        <CardHeader className="border-b border-border/60 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Shield className="size-4" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold text-foreground font-heading">
                  Active Login Sessions
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Devices and locations currently authenticated to your admin
                  account.
                </CardDescription>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  refetch();
                  toast.success("Refreshed active sessions");
                }}
                disabled={isFetching}
                className="h-8 gap-1.5 text-xs font-medium"
              >
                <RefreshCw
                  className={`size-3 ${isFetching ? "animate-spin" : ""}`}
                />
                <span className="hidden sm:inline">Refresh</span>
              </Button>

              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => setIsConfirmOpen(true)}
                disabled={logoutAllMutation.isPending}
                className="h-8 gap-1.5 text-xs font-semibold"
              >
                <LogOut className="size-3" />
                <span>Log Out All Devices</span>
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-2 py-8 text-muted-foreground">
              <Loader2 className="size-6 animate-spin text-primary" />
              <p className="text-xs">Loading active login sessions...</p>
            </div>
          ) : sessionList.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-8 text-center text-muted-foreground">
              <Shield className="size-8 opacity-40 text-primary" />
              <p className="text-xs font-medium text-foreground">
                No external active sessions detected
              </p>
              <p className="text-[11px] max-w-sm">
                Only your current browser session is actively authenticated to
                this account.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {sessionList.map((session, idx) => {
                const isCurrent = session.isCurrent ?? idx === 0;
                const deviceLabel = parseBrowserDetails(session);

                return (
                  <div
                    key={session.id || idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`size-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isCurrent
                            ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                            : "bg-muted text-muted-foreground border border-border/60"
                        }`}
                      >
                        {getDeviceIcon(session)}
                      </div>

                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-xs font-semibold text-foreground truncate">
                            {deviceLabel}
                          </p>
                          {isCurrent ? (
                            <Badge
                              variant="outline"
                              className="text-[10px] font-semibold border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 py-0"
                            >
                              This Device
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="text-[10px] text-muted-foreground py-0"
                            >
                              Active
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground flex-wrap">
                          <span>
                            IP:{" "}
                            <code className="font-mono text-foreground/80">
                              {session.ipAddress || "Unknown"}
                            </code>
                          </span>
                          {session.createdAt && (
                            <>
                              <span>•</span>
                              <span>
                                Signed in{" "}
                                {new Date(session.createdAt).toLocaleDateString(
                                  undefined,
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  },
                                )}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right sm:self-center pl-12 sm:pl-0">
                      <span className="text-[11px] text-muted-foreground">
                        {session.lastActiveAt
                          ? `Last active: ${new Date(
                              session.lastActiveAt,
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}`
                          : "Active now"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="size-10 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center mb-2">
              <AlertTriangle className="size-5" />
            </div>
            <DialogTitle className="text-base font-bold text-foreground">
              Sign Out All Devices?
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              This action will immediately terminate all active authenticated
              sessions across all browsers, tablets, and mobile devices. You
              will be redirected to the login page.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsConfirmOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleLogoutAll}
              disabled={logoutAllMutation.isPending}
              className="gap-1.5 text-xs font-semibold"
            >
              {logoutAllMutation.isPending ? (
                <>
                  <Loader2 className="size-3 animate-spin" />
                  <span>Signing out...</span>
                </>
              ) : (
                <>
                  <LogOut className="size-3" />
                  <span>Confirm Sign Out</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
