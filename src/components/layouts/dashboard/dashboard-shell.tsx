import type { ReactNode } from "react";
import { SidebarInset } from "@/components/ui/sidebar";
import DashboardHeader from "./header";
import DashboardSidebar from "./sidebar";

interface DashboardShellProps {
  children: ReactNode;
  portalRole: "ADMIN" | "TEACHER";
  portalTitle?: string;
}

export default function DashboardShell({
  children,
  portalRole,
  portalTitle,
}: DashboardShellProps) {
  const defaultTitle =
    portalRole === "ADMIN" ? "Admin Console" : "Teacher Workspace";

  return (
    <>
      {/* Official Shadcn Collapsible Sidebar */}
      <DashboardSidebar portalRole={portalRole} />

      {/* Main Content Area via SidebarInset */}
      <SidebarInset>
        <DashboardHeader portalTitle={portalTitle || defaultTitle} />

        <div className="flex-1 overflow-y-auto bg-muted/20 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </div>
      </SidebarInset>
    </>
  );
}
