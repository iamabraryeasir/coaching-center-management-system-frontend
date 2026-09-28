import type { Metadata } from "next";
import { Suspense } from "react";
import {
  StudentBatchesSkeleton,
  StudentBatchesView,
} from "@/components/modules/batches";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `My Batches & Courses | ${siteConfig.name}`,
  description:
    "View your enrolled coaching batches, monitor application status, or explore available courses.",
};

export default function StudentBatchesPage() {
  return (
    <Suspense fallback={<StudentBatchesSkeleton />}>
      <StudentBatchesView />
    </Suspense>
  );
}
