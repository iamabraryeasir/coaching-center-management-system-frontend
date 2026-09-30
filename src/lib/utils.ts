export { cn } from "cn";

/**
 * Safely format an ISO date string or Date object into a readable date (e.g., "Jan 15, 2026").
 * Gracefully handles undefined, null, or invalid dates.
 */
export function formatDateSafe(
  date?: string | Date | null,
  options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  },
  fallback = "—",
): string {
  if (!date) return fallback;
  try {
    const d = typeof date === "string" ? new Date(date) : date;
    if (Number.isNaN(d.getTime())) return fallback;
    return new Intl.DateTimeFormat("en-US", options).format(d);
  } catch {
    return fallback;
  }
}

/**
 * Format date with time (e.g., "Jan 15, 2026, 03:30 PM").
 */
export function formatDateTime(
  date?: string | Date | null,
  fallback = "—",
): string {
  return formatDateSafe(
    date,
    {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    },
    fallback,
  );
}

/**
 * Format currency amount with BDT symbol (e.g., "৳1,500").
 */
export function formatCurrency(
  amount?: number | string | null,
  fallback = "৳0",
): string {
  if (amount === undefined || amount === null || amount === "") return fallback;
  const num = typeof amount === "string" ? Number(amount) : amount;
  if (Number.isNaN(num)) return fallback;
  return `৳${num.toLocaleString("en-US")}`;
}
