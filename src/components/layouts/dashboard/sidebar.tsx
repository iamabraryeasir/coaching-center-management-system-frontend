"use client";

import { Loader2, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AppLogo from "@/assets/svg/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { siteConfig } from "@/config/site";
import {
  ADMIN_NAV_GROUPS,
  type DashboardNavGroup,
  TEACHER_NAV_GROUPS,
} from "@/constants";
import { useAuth } from "@/hooks";

interface DashboardSidebarProps {
  portalRole: "ADMIN" | "TEACHER";
  className?: string;
}

export default function DashboardSidebar({
  portalRole,
  className,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const { user, hasPermission, logout, isLoggingOut } = useAuth();

  const navGroups: readonly DashboardNavGroup[] =
    portalRole === "ADMIN" ? ADMIN_NAV_GROUPS : TEACHER_NAV_GROUPS;

  const roleLabel =
    portalRole === "ADMIN" ? "Admin Portal" : "Faculty Workspace";

  const checkIsActive = (href: string, exact?: boolean): boolean => {
    if (!pathname) return false;
    if (exact) {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <Sidebar collapsible="icon" className={className}>
      {/* Brand Header */}
      <SidebarHeader className="border-b border-sidebar-border/60">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={<Link href="/" />}
              className="gap-2.5 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                <AppLogo size={0.65} priority />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-heading font-semibold text-sidebar-foreground">
                  {siteConfig.name}
                </span>
                <span className="truncate text-xs font-medium text-primary">
                  {roleLabel}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Main Navigation Content */}
      <SidebarContent>
        {navGroups.map((group, groupIdx) => {
          const visibleItems = group.items.filter((item) => {
            if (!item.requiredPermission) return true;
            return hasPermission(item.requiredPermission);
          });

          if (visibleItems.length === 0) return null;

          return (
            <SidebarGroup key={group.label || groupIdx}>
              {group.label && (
                <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                  {group.label}
                </SidebarGroupLabel>
              )}
              <SidebarGroupContent>
                <SidebarMenu>
                  {visibleItems.map((item) => {
                    const isActive = checkIsActive(item.href, item.exact);
                    const Icon = item.icon;

                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          render={<Link href={item.href} />}
                          isActive={isActive}
                          tooltip={item.title}
                        >
                          <Icon />
                          <span>{item.title}</span>
                        </SidebarMenuButton>

                        {item.badge && (
                          <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                        )}
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>

      {/* User Session Footer */}
      <SidebarFooter className="border-t border-sidebar-border/60">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 p-1 group-data-[collapsible=icon]:justify-center">
              <div className="relative flex size-8 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground text-xs shadow-xs">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                <span className="absolute bottom-0 right-0 size-2 rounded-full border border-sidebar bg-emerald-500" />
              </div>

              <div className="flex flex-1 flex-col truncate text-left text-xs group-data-[collapsible=icon]:hidden">
                <span className="truncate font-semibold text-sidebar-foreground">
                  {user?.name || "Authenticated User"}
                </span>
                <span className="truncate text-[11px] text-muted-foreground">
                  {user?.email}
                </span>
              </div>

              <button
                type="button"
                onClick={() => logout()}
                disabled={isLoggingOut}
                title="Sign out session"
                aria-label="Sign out"
                className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50 group-data-[collapsible=icon]:hidden"
              >
                {isLoggingOut ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <LogOut className="size-3.5" />
                )}
              </button>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      {/* Clickable / Draggable desktop collapse rail */}
      <SidebarRail />
    </Sidebar>
  );
}
