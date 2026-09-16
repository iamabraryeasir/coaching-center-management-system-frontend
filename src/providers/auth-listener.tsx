"use client";

import { useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { authKeys } from "@/constants/query-keys";
import { authChannel } from "@/lib/auth-channel";

/**
 * Global Authentication Session & Multi-Tab Listener
 *
 * 1. Catches local session-expired events emitted by the HTTP client.
 * 2. Synchronizes auth state across open browser tabs via BroadcastChannel.
 * 3. Preserves target URL with ?redirect=... when redirecting to login.
 */
export default function AuthListener() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 1. Handle local session expiration event from apiClient
    const handleSessionExpired = () => {
      // Purge local cache
      queryClient.setQueryData(authKeys.currentUser(), null);
      queryClient.removeQueries({ queryKey: authKeys.all });

      // Notify other tabs
      authChannel.postMessage({ type: "SESSION_EXPIRED" });

      // Only notify and redirect if the user is on a protected route
      if (pathname.startsWith("/dashboard")) {
        toast.error("Session expired. Please log in again.", {
          id: "auth-session-expired",
        });
        const redirectParam = encodeURIComponent(pathname);
        router.push(`/login?redirect=${redirectParam}`);
      }
    };

    window.addEventListener("auth:session-expired", handleSessionExpired);

    // 2. Handle cross-tab messages from other tabs
    const unsubscribeChannel = authChannel.subscribe((msg) => {
      if (msg.type === "LOGOUT") {
        queryClient.setQueryData(authKeys.currentUser(), null);
        queryClient.removeQueries({ queryKey: authKeys.all });
        if (pathname.startsWith("/dashboard")) {
          toast.success("Logged out from another tab", {
            id: "cross-tab-logout",
          });
          router.push("/");
        }
      } else if (msg.type === "LOGIN") {
        // Another tab logged in: revalidate user query
        queryClient.invalidateQueries({ queryKey: authKeys.currentUser() });
      } else if (msg.type === "SESSION_EXPIRED") {
        queryClient.setQueryData(authKeys.currentUser(), null);
        queryClient.removeQueries({ queryKey: authKeys.all });
        if (pathname.startsWith("/dashboard")) {
          toast.error("Session expired. Please log in again.", {
            id: "auth-session-expired",
          });
          const redirectParam = encodeURIComponent(pathname);
          router.push(`/login?redirect=${redirectParam}`);
        }
      }
    });

    return () => {
      window.removeEventListener("auth:session-expired", handleSessionExpired);
      unsubscribeChannel();
    };
  }, [queryClient, router, pathname]);

  return null;
}
