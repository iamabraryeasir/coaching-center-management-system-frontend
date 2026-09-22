"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
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
    <div className="flex min-h-[75vh] w-full flex-1 flex-col items-center justify-center p-6 text-center">
      <p className="font-mono text-sm font-semibold tracking-widest text-destructive uppercase">
        Dashboard error
      </p>

      <h1 className="mt-3 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
        Unable to load dashboard
      </h1>

      <p className="mt-3 max-w-md text-balance text-sm text-muted-foreground">
        We encountered an issue retrieving your coaching management data. Your
        session remains active.
      </p>

      {error.digest && (
        <p className="mt-3 font-mono text-xs text-muted-foreground">
          Incident ID:{" "}
          <span className="font-semibold text-foreground select-all">
            {error.digest}
          </span>
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={() => reset()} className="px-4 font-medium shadow-sm">
          Try again
        </Button>

        <Link
          href="/dashboard"
          className={cn(
            buttonVariants({ variant: "outline", size: "default" }),
            "px-4 font-medium",
          )}
        >
          Back to dashboard
        </Link>

        <a
          href={`mailto:${siteConfig.supportEmail}?subject=Dashboard Error Report ${error.digest ? `(${error.digest})` : ""}`}
          className="inline-flex items-center gap-1 px-2 py-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <span>Contact support</span>
          <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
    </div>
  );
}
