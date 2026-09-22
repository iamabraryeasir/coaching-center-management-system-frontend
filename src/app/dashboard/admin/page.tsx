"use client";

import { siteConfig } from "@/config/site";
import { useAuth } from "@/hooks";

export default function AdminDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Welcome back, {user?.name?.split(" ")[0] || "Administrator"}
          </h2>
          <p className="text-sm text-muted-foreground">
            Here is what is happening across {siteConfig.name} today.
          </p>
        </div>
      </div>
    </div>
  );
}
