"use client";

import { Home } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  portalTitle?: string;
}

export default function DashboardHeader({
  portalTitle = "Dashboard",
}: DashboardHeaderProps) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-border/60 bg-background/80 px-4 backdrop-blur-md sm:px-6">
      {/* Left: Official Shadcn Sidebar trigger & Title */}
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-1" />

        <Separator orientation="vertical" className="h-4" />

        <h1 className="font-heading text-sm sm:text-base font-semibold tracking-tight text-foreground">
          {portalTitle}
        </h1>
      </div>

      {/* Right: Quick actions & User Profile Pill */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "gap-1.5 hidden sm:inline-flex",
          )}
        >
          <Home className="size-3.5" />
          <span>Home Page</span>
        </Link>

        {/* User Pill */}
        {user && (
          <div className="flex items-center gap-2 rounded border border-border/80 bg-muted/40 py-1 pl-1.5 pr-3 text-xs">
            <span className="font-medium text-foreground hidden sm:inline truncate">
              {user.name}
            </span>
            <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
              {user.role}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
