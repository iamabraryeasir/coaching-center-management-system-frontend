import type { ReactNode } from "react";
import { RoleGuard } from "@/components/guards";
import DashboardShell from "@/components/layouts/dashboard/dashboard-shell";
import TeacherDashboardLoading from "./loading";

export default function TeacherLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard
      allowedRoles={["TEACHER"]}
      loadingFallback={
        <DashboardShell portalRole="TEACHER" portalTitle="Teacher Workspace">
          <TeacherDashboardLoading />
        </DashboardShell>
      }
    >
      <DashboardShell portalRole="TEACHER" portalTitle="Teacher Workspace">
        {children}
      </DashboardShell>
    </RoleGuard>
  );
}
