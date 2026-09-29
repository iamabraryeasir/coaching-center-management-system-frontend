import type { Metadata } from "next";
import { Suspense } from "react";
import {
  StudentSettingsSkeleton,
  StudentSettingsView,
} from "@/components/modules/settings";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Student Profile & Settings | ${siteConfig.name}`,
  description:
    "Manage your student academic credentials, personal profile, account security, and active login sessions.",
};

export default async function StudentSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const query = await searchParams;
  const tab = typeof query.tab === "string" ? query.tab : undefined;

  return (
    <Suspense fallback={<StudentSettingsSkeleton />}>
      <StudentSettingsView
        defaultTab={tab as "profile" | "security" | undefined}
      />
    </Suspense>
  );
}
