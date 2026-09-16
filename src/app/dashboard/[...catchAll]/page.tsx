import { notFound } from "next/navigation";

/**
 * Dashboard Catch-All Route
 *
 * In Next.js App Router, unmatched sub-paths (e.g. `/dashboard/unknown-page`)
 * would otherwise bypass the dashboard hierarchy and fall back to the root `app/not-found.tsx`.
 *
 * By defining this catch-all segment that triggers `notFound()`, Next.js correctly
 * scopes the 404 resolution to `src/app/dashboard/not-found.tsx` within the dashboard shell.
 */
export default function DashboardCatchAll() {
  notFound();
}
