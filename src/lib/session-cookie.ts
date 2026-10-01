/**
 * Client Session Flag Utility
 *
 * For cross-origin deployments (e.g. Frontend on Vercel, Backend on Railway/Render):
 * Backend HttpOnly cookies (accessToken, refreshToken) are stored under the backend's domain
 * and are transmitted with `credentials: "include"`.
 *
 * Browsers do not attach cross-origin cookies to Next.js page requests (e.g. /dashboard).
 * A lightweight same-origin flag cookie (`cms_session=1`) allows Next.js server-side edge
 * proxy (src/proxy.ts) to identify active sessions without falsely redirecting.
 *
 * Actual cryptographic authorization is always verified by the backend via /users/me.
 */

export function setClientSessionFlag(): void {
  if (typeof document === "undefined") return;
  const isSecure = window.location.protocol === "https:";
  // biome-ignore lint/suspicious/noDocumentCookie: client-side session cookie flag for Next.js edge proxy
  document.cookie = `cms_session=1; path=/; max-age=2592000; SameSite=Lax${isSecure ? "; Secure" : ""}`;
}

export function clearClientSessionFlag(): void {
  if (typeof document === "undefined") return;
  // biome-ignore lint/suspicious/noDocumentCookie: client-side session cookie flag for Next.js edge proxy
  document.cookie =
    "cms_session=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
}
