import Link from "next/link";
import Header from "@/components/layouts/public/header";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Homepage Shared Navigation Bar */}
      <Header />

      {/* Centered content */}
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-6 py-16 text-center sm:py-24 lg:px-8">
        <p className="font-mono text-sm font-semibold tracking-widest text-primary uppercase">
          404 error
        </p>

        <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
          Page not found
        </h1>

        <p className="mt-4 max-w-md text-balance text-sm text-muted-foreground sm:text-base">
          Sorry, we couldn’t find the page you’re looking for. It may have been
          moved, deleted, or the URL might be incorrect.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "default", size: "default" }),
              "px-4 font-medium shadow-sm",
            )}
          >
            Back to home
          </Link>
          <a
            href={`mailto:${siteConfig.supportEmail}`}
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
