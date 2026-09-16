"use client";

import {
  AlertCircle,
  Home,
  LayoutDashboard,
  Mail,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface DashboardErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  useEffect(() => {
    console.error("[DashboardError Boundary]:", error);
  }, [error]);

  return (
    <div className="flex min-h-[80vh] w-full flex-col items-center justify-center p-4 sm:p-6 lg:p-10">
      <Card className="w-full max-w-lg border-destructive/20 shadow-md">
        <CardHeader className="flex flex-col items-center space-y-3 pb-2 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <AlertCircle className="size-7" />
          </div>

          <div className="inline-flex items-center rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-semibold text-destructive">
            Dashboard Module Error
          </div>

          <CardTitle className="font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Unable to Load Dashboard
          </CardTitle>

          <CardDescription className="max-w-sm text-sm text-muted-foreground">
            We encountered an issue retrieving your coaching management data.
            Your session remains active.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-2">
          {error.digest && (
            <div className="rounded-lg border border-border/80 bg-muted/40 p-3 text-left">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Incident Identifier
              </p>
              <code className="font-mono text-xs text-foreground select-all">
                {error.digest}
              </code>
            </div>
          )}

          <div className="flex flex-col gap-2.5 sm:flex-row sm:justify-center">
            <Button
              onClick={() => reset()}
              className="gap-2 font-medium shadow-sm"
            >
              <RefreshCw className="size-4" />
              <span>Retry Request</span>
            </Button>

            <Link
              href="/dashboard"
              className={cn(
                buttonVariants({ variant: "outline", size: "default" }),
                "gap-2 font-medium",
              )}
            >
              <LayoutDashboard className="size-4" />
              <span>Reload Dashboard</span>
            </Link>

            <Link
              href="/"
              className={cn(
                buttonVariants({ variant: "ghost", size: "default" }),
                "gap-2 font-medium",
              )}
            >
              <Home className="size-4" />
              <span>Home</span>
            </Link>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-1 border-t border-border/60 bg-muted/20 py-3 text-center text-xs text-muted-foreground">
          <p>
            Need help? Contact technical support at{" "}
            <a
              href={`mailto:${siteConfig.supportEmail}?subject=Dashboard Error ${error.digest ? `(${error.digest})` : ""}`}
              className="inline-flex items-center gap-1 font-medium text-primary underline-offset-4 hover:underline"
            >
              <Mail className="size-3" />
              {siteConfig.supportEmail}
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
