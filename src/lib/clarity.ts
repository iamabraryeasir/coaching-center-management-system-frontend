import Clarity from "@microsoft/clarity";

interface ClarityIdentifyParams {
  id: string;
  name?: string;
  role?: string;
}

/**
 * Initialize Microsoft Clarity analytics with the configured Project ID.
 */
export function initClarity(projectId: string): void {
  if (typeof window === "undefined" || !projectId) {
    return;
  }

  try {
    Clarity.init(projectId);
  } catch {
    // Non-blocking analytics fail-safe
  }
}

/**
 * Identify authenticated user session in Microsoft Clarity.
 * Allows filtering heatmaps and session recordings by user and role (ADMIN, TEACHER, STUDENT).
 */
export function identifyClarityUser(params: ClarityIdentifyParams): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    Clarity.identify(params.id, undefined, undefined, params.name);

    if (params.role) {
      Clarity.setTag("role", params.role);
    }
  } catch {
    // Non-blocking analytics fail-safe
  }
}

/**
 * Set custom dimensional tag in Microsoft Clarity (e.g. batchId, currentTab, pageType)
 */
export function setClarityTag(key: string, value: string): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    Clarity.setTag(key, value);
  } catch {
    // Non-blocking analytics fail-safe
  }
}

/**
 * Trigger custom milestone event in Microsoft Clarity (e.g. payment_completed, exam_published)
 */
export function trackClarityEvent(eventName: string): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    Clarity.event(eventName);
  } catch {
    // Non-blocking analytics fail-safe
  }
}
