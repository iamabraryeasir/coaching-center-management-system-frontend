"use client";

import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect, useMemo } from "react";
import { useAuth } from "@/hooks";
import type { UserRole } from "@/types";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: readonly UserRole[];
  /** Optional custom loading skeleton to show while user session is verifying */
  loadingFallback?: ReactNode;
}

/**
 * Reusable Enterprise Role Guard
 *
 * Enforces strict role-based access control across dashboard portals:
 * - Prevents unauthorized roles from viewing or flashing protected pages.
 * - Automatically bounces unauthorized users to their own authorized dashboard.
 * - Redirects unauthenticated visitors to login preserving destination query context.
 */
export function RoleGuard({
  children,
  allowedRoles,
  loadingFallback,
}: RoleGuardProps) {
  const { user, role, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Determine if the current authenticated user's role is permitted
  const isAuthorized = useMemo(() => {
    if (!isAuthenticated || !role) return false;
    return allowedRoles.includes(role);
  }, [isAuthenticated, role, allowedRoles]);

  useEffect(() => {
    if (!isLoading) {
      // 1. Unauthenticated -> Redirect to login with redirect param
      if (!isAuthenticated || !user) {
        const destination = pathname
          ? encodeURIComponent(pathname)
          : "%2Fdashboard";
        router.replace(`/login?redirect=${destination}`);
        return;
      }

      // 2. Authenticated but unauthorized for this portal -> Redirect to their OWN portal
      if (!isAuthorized && role) {
        switch (role) {
          case "ADMIN":
            router.replace("/dashboard/admin");
            break;
          case "TEACHER":
            router.replace("/dashboard/teacher");
            break;
          case "STUDENT":
            router.replace("/dashboard/student");
            break;
          default:
            router.replace("/login");
            break;
        }
      }
    }
  }, [isLoading, isAuthenticated, user, role, isAuthorized, router, pathname]);

  // Render seamless fallback while verifying authentication status
  if (isLoading) {
    return loadingFallback ?? null;
  }

  // If unauthorized, block child rendering and show redirection state
  if (!isAuthorized) {
    return (
      <div className="flex min-h-[60vh] w-full flex-1 items-center justify-center p-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-xs text-muted-foreground">
            Redirecting to your authorized workspace...
          </p>
        </div>
      </div>
    );
  }

  // Authorized user: render protected content
  return <>{children}</>;
}
