"use client";

import Link from "next/link";
import Header from "@/components/layouts/public/header";
import { Button, buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface RootErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function RootError({ error, reset }: RootErrorProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Homepage Shared Navigation Bar */}
      <Header />

      {/* Centered content */}
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-6 py-16 text-center sm:py-24 lg:px-8">
        <p className="font-mono text-sm font-semibold tracking-widest text-destructive uppercase">
          500 error
        </p>

        <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
          Something went wrong
        </h1>

        <p className="mt-4 max-w-md text-balance text-sm text-muted-foreground sm:text-base">
          An unexpected error occurred while processing your request. Our
          engineering team has been notified and is working to resolve it.
        </p>

        {error.digest && (
          <p className="mt-3 font-mono text-xs text-muted-foreground">
            Incident ID:{" "}
            <span className="font-semibold text-foreground select-all">
              {error.digest}
            </span>
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            onClick={() => reset()}
            className="px-4 font-medium shadow-sm"
          >
            Try again
          </Button>

          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "outline", size: "default" }),
              "px-4 font-medium",
            )}
          >
            Back to home
          </Link>

          <a
            href={`mailto:${siteConfig.supportEmail}?subject=Application Error Report ${error.digest ? `(${error.digest})` : ""}`}
            className="inline-flex items-center gap-1 px-2 py-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <span>Contact support</span>
            <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </main>

      {/* Subtle bottom footer */}
      <footer className="mx-auto w-full max-w-7xl px-6 py-6 text-center text-xs text-muted-foreground lg:px-8">
        <p>
          &copy; {new Date().getFullYear()} {siteConfig.name}. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}
