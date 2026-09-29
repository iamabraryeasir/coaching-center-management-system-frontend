/**
 * Safe Redirect Utility
 *
 * Validates a redirect parameter to prevent open redirect attacks.
 *
 * Security rationale:
 * A naive `startsWith("/")` check can be bypassed by:
 *   - `/\evil.com`  — browsers interpret `/\` as `//` on some platforms
 *   - `/%2fevil.com` — URL-encoded slash bypasses string check
 *   - `//evil.com`  — protocol-relative URL redirect
 *
 * Using `new URL(redirectParam, base)` correctly normalizes all these
 * forms before the origin comparison, rejecting all cross-origin variants.
 *
 * @param redirectParam - Raw redirect string from URL query params (may be null/undefined)
 * @param fallback      - Default path if redirect is invalid or cross-origin
 * @returns             - Safe, same-origin path string
 */
export function getSafeRedirect(
  redirectParam: string | null | undefined,
  fallback = "/dashboard",
): string {
  if (!redirectParam) return fallback;
  try {
    // Use the current origin as the base to resolve relative paths.
    // In SSR context window is undefined — the base is only used for origin
    // comparison, so the fallback value here is inconsequential.
    const base =
      typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost:3000";
    const url = new URL(redirectParam, base);
    // Reject anything that resolves to a different origin
    if (url.origin !== base) return fallback;
    return url.pathname + url.search + url.hash;
  } catch {
    // URL parsing failed (malformed string) → use safe fallback
    return fallback;
  }
}
