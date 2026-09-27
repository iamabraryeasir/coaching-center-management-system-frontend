import type { Metadata } from "next";
import { Suspense } from "react";
import {
  TeacherSettingsSkeleton,
  TeacherSettingsView,
} from "@/components/modules/settings";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Faculty Settings - ${siteConfig.name}`,
  description:
    "Manage faculty credentials, personal contact details, attendance records, and security settings.",
};

export default function TeacherSettingsPage() {
  return (
    <Suspense fallback={<TeacherSettingsSkeleton />}>
      <TeacherSettingsView />
    </Suspense>
  );
}
