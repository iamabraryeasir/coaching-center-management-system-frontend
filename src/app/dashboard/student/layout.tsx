import type { ReactNode } from "react";
import { RoleGuard } from "@/components/guards";
import DashboardShell from "@/components/layouts/dashboard/dashboard-shell";
import StudentDashboardLoading from "./loading";

export default function StudentLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard
      allowedRoles={["STUDENT"]}
      loadingFallback={
        <DashboardShell portalRole="STUDENT" portalTitle="Student Portal">
          <StudentDashboardLoading />
        </DashboardShell>
      }
    >
      <DashboardShell portalRole="STUDENT" portalTitle="Student Portal">
        {children}
      </DashboardShell>
    </RoleGuard>
  );
}
