import AppLogo from "@/assets/svg/logo";
import { siteConfig } from "@/config/site";

/**
 * Root Suspense Loading Fallback
 *
 * In Next.js 16 App Router, this file automatically wraps route segments in a
 * React <Suspense> boundary. It renders during initial page loads or transitions
 * across segments that do not provide their own scoped `loading.tsx`.
 *
 * Enterprise Considerations:
 * - Uses `motion-safe` utilities so users with vestibular motion sensitivities (prefers-reduced-motion) are protected.
 * - Single screen-reader announcement prevents double-readout voiceover bugs.
 * - Refined, subtle pulse animation prevents off-center spinner wobbles over the logo.
 * - Uses semantic OKLCH tokens (`--background`, `--foreground`, `--muted-foreground`).
 */
export default function RootLoading() {
  return (
    <output
      aria-live="polite"
      className="flex min-h-[60vh] w-full flex-1 flex-col items-center justify-center p-6"
    >
      <div className="flex flex-col items-center gap-4">
        {/* Brand Icon with refined pulse beacon */}
        <div className="relative flex items-center justify-center">
          <div className="size-12 rounded-2xl bg-primary/10 motion-safe:animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <AppLogo size={0.65} priority />
          </div>
        </div>

        {/* Brand Label & Subtle Progress Tracker */}
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="font-heading text-sm font-semibold tracking-tight text-foreground">
            {siteConfig.name}
          </p>
          <p className="text-xs text-muted-foreground">Loading...</p>
        </div>

        {/* Accessible, non-duplicate screen reader announcement */}
        <span className="sr-only">Loading {siteConfig.name}, please wait</span>
      </div>
    </output>
  );
}
