import { type FetchOptions, ofetch } from "ofetch";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

interface QueuedRequest {
  resolve: () => void;
  reject: (error: unknown) => void;
}

let isRefreshing = false;
let failedQueue: QueuedRequest[] = [];
let lastSessionExpiredDispatch = 0;

/**
 * Flush all queued requests waiting for cookie refresh
 */
const processQueue = (error: unknown = null) => {
  for (const promise of failedQueue) {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  }
  failedQueue = [];
};

/**
 * Underlying un-intercepted HTTP client instance
 */
const rawApiClient = ofetch.create({
  baseURL: BASE_URL,
  credentials: "include",
});

export interface ApiRequestOptions extends FetchOptions<"json"> {
  _retry?: boolean;
}

/**
 * Perform silent token rotation via HttpOnly Cookie
 */
async function performTokenRefresh(): Promise<void> {
  // Browser automatically transmits the HttpOnly refresh-token cookie
  // Backend responds with 200 OK and Set-Cookie headers for new tokens
  await rawApiClient("/auth/refresh-token", {
    method: "POST",
    credentials: "include",
  });
}

/**
 * Safely dispatch session-expired event with rate limiting
 */
function dispatchSessionExpired() {
  if (typeof window === "undefined") return;

  const now = Date.now();
  // Prevent firing duplicate events within 3 seconds
  if (now - lastSessionExpiredDispatch > 3000) {
    lastSessionExpiredDispatch = now;
    window.dispatchEvent(new CustomEvent("auth:session-expired"));
  }
}

/**
 * Universal Production-Grade API Client (Secure HttpOnly Cookies)
 *
 * Automatically includes credentials/cookies, intercepts 401 Unauthorized responses,
 * triggers silent cookie rotation via POST /auth/refresh-token, and queues concurrent
 * requests during the refresh window.
 */
async function apiClient<T = unknown>(
  url: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const mergedOptions: FetchOptions<"json"> = {
    ...options,
    baseURL: BASE_URL,
    credentials: "include",
  };

  try {
    return await rawApiClient<T>(url, mergedOptions);
  } catch (error: unknown) {
    const errorObj = error as {
      response?: {
        status?: number;
        _data?: { message?: string };
      };
      status?: number;
      data?: { message?: string };
      message?: string;
    };

    const status = errorObj?.response?.status || errorObj?.status;
    const isAuthEndpoint =
      url.includes("/auth/login") ||
      url.includes("/auth/refresh-token") ||
      url.includes("/auth/forgot-password");

    // Intercept 401 Unauthorized errors on protected endpoints
    if (status === 401 && !isAuthEndpoint && !options._retry) {
      if (isRefreshing) {
        // Request Queuing: wait for the active refresh call to complete
        return new Promise<void>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            // Retry the original request with the fresh HttpOnly cookies
            return apiClient<T>(url, {
              ...options,
              _retry: true,
            });
          })
          .catch((queueErr) => {
            throw queueErr;
          });
      }

      options._retry = true;
      isRefreshing = true;

      try {
        await performTokenRefresh();
        processQueue(null);
        isRefreshing = false;

        // Retry the initial request with the newly set HttpOnly cookies
        return await apiClient<T>(url, {
          ...options,
          _retry: true,
        });
      } catch (refreshErr) {
        processQueue(refreshErr);
        isRefreshing = false;

        const refreshErrObj = refreshErr as {
          response?: { status?: number };
          status?: number;
        };
        const refreshStatus =
          refreshErrObj?.response?.status || refreshErrObj?.status;

        // If the refresh call returned 400 (no token), 401, or 403, notify session expired
        if (
          refreshStatus === 400 ||
          refreshStatus === 401 ||
          refreshStatus === 403
        ) {
          dispatchSessionExpired();
        }

        const message =
          errorObj?.response?._data?.message ||
          errorObj?.data?.message ||
          errorObj?.message ||
          "Session expired. Please log in again.";
        throw new Error(message);
      }
    }

    const message =
      errorObj?.response?._data?.message ||
      errorObj?.data?.message ||
      errorObj?.message ||
      "An unexpected error occurred.";
    throw new Error(message);
  }
}

export default apiClient;
