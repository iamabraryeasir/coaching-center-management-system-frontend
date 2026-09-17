import type { ReactNode } from "react";
import { RoleGuard } from "@/components/guards";
import DashboardShell from "@/components/layouts/dashboard/dashboard-shell";
import AdminDashboardLoading from "./loading";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard
      allowedRoles={["ADMIN"]}
      loadingFallback={
        <DashboardShell portalRole="ADMIN" portalTitle="Admin Console">
          <AdminDashboardLoading />
        </DashboardShell>
      }
    >
      <DashboardShell portalRole="ADMIN" portalTitle="Admin Console">
        {children}
      </DashboardShell>
    </RoleGuard>
  );
}
