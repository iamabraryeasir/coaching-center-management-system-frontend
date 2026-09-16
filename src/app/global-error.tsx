"use client";

import AppLogo from "@/assets/svg/logo";
import { siteConfig } from "@/config/site";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
        {/* Minimal brand header */}
        <header className="mx-auto flex w-full max-w-7xl items-center justify-between p-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <AppLogo size={0.65} priority />
            <span className="font-heading text-sm font-semibold tracking-tight">
              {siteConfig.name}
            </span>
          </div>
        </header>

        {/* Centered content */}
        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-6 py-16 text-center sm:py-24 lg:px-8">
          <p className="font-mono text-sm font-semibold tracking-widest text-destructive uppercase">
            Critical error
          </p>

          <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-5xl">
            Application failed to load
          </h1>

          <p className="mt-4 max-w-md text-balance text-sm text-muted-foreground sm:text-base">
            A critical system error occurred during layout initialization.
            Please refresh the page or return home.
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
            <button
              type="button"
              onClick={() => reset()}
              className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              Reload application
            </button>

            <button
              type="button"
              onClick={() => {
                window.location.href = "/";
              }}
              className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted"
            >
              Back to home
            </button>
          </div>
        </main>

        {/* Subtle footer */}
        <footer className="mx-auto w-full max-w-7xl px-6 py-6 text-center text-xs text-muted-foreground lg:px-8">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights
            reserved.
          </p>
        </footer>
      </body>
    </html>
  );
}
