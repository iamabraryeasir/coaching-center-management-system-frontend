import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function DashboardNotFound() {
  return (
    <div className="flex min-h-[75vh] w-full flex-1 flex-col items-center justify-center p-6 text-center">
      <p className="font-mono text-sm font-semibold tracking-widest text-primary uppercase">
        404 error
      </p>

      <h1 className="mt-3 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
        Dashboard resource not found
      </h1>

      <p className="mt-3 max-w-md text-balance text-sm text-muted-foreground">
        The dashboard view, student record, or administrative resource you
        requested does not exist or has been moved.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/dashboard"
          className={cn(
            buttonVariants({ variant: "default", size: "default" }),
            "px-4 font-medium shadow-sm",
          )}
        >
          Back to dashboard
        </Link>

        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "outline", size: "default" }),
            "px-4 font-medium",
          )}
        >
          Home page
        </Link>
      </div>
    </div>
  );
}
