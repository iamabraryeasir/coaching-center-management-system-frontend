import type { Metadata } from "next";
import { AdminSettingsView } from "@/components/modules/settings";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Institution Settings - ${siteConfig.name}`,
  description:
    "Manage coaching center branding, white-label configuration, and operational parameters.",
};

export default function AdminSettingsPage() {
  return <AdminSettingsView />;
}
