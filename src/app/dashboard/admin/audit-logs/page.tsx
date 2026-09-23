import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminAuditLogsView } from "@/components/modules/audit-logs";
import { siteConfig } from "@/config/site";
import AdminAuditLogsLoading from "./loading";

export const metadata: Metadata = {
  title: `System Audit Logs & Security | ${siteConfig.name}`,
  description:
    "Explore system-wide immutable activity logs, monitor administrative actions, and inspect deep operational diffs.",
};

export default function AdminAuditLogsPage() {
  return (
    <Suspense fallback={<AdminAuditLogsLoading />}>
      <AdminAuditLogsView />
    </Suspense>
  );
}
