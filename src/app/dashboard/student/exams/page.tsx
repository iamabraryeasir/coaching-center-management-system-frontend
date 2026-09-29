import type { Metadata } from "next";
import { Suspense } from "react";
import {
  StudentExamsSkeleton,
  StudentExamsView,
} from "@/components/modules/exams";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `My Exams & Report Cards | ${siteConfig.name}`,
  description:
    "View your academic test scores, GPA ratings, batch rankings, and download official report cards.",
};

export default function StudentExamsPage() {
  return (
    <Suspense fallback={<StudentExamsSkeleton />}>
      <StudentExamsView />
    </Suspense>
  );
}
