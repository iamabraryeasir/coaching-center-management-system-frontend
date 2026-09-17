"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AppLogo from "@/assets/svg/logo";
import { siteConfig } from "@/config/site";
import { useAuth } from "@/hooks";

/**
 * Smart Dashboard Gateway
 *
 * Enterprise Router: Determines the authenticated user's role and immediately
 * forwards them to their dedicated, role-scoped portal:
 * - ADMIN   -> /dashboard/admin
 * - TEACHER -> /dashboard/teacher
 * - STUDENT -> /dashboard/student
 */
export default function DashboardGatewayPage() {
  const { user, isAuthenticated, isLoading, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || !user) {
        router.replace("/login?redirect=/dashboard");
        return;
      }

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
          router.replace("/dashboard/admin");
          break;
      }
    }
  }, [isLoading, isAuthenticated, user, role, router]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="relative flex items-center justify-center">
          <div className="size-12 rounded-2xl bg-primary/10 motion-safe:animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <AppLogo size={0.65} priority />
          </div>
        </div>

        <div className="space-y-1">
          <p className="font-heading text-sm font-semibold tracking-tight text-foreground">
            {siteConfig.name}
          </p>
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
            <Loader2 className="size-3 animate-spin text-primary" />
            <span>Connecting to your dashboard portal...</span>
          </p>
        </div>
      </div>
    </div>
  );
}
