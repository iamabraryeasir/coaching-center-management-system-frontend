"use client";

import { UserCheck, UserPlus, Users } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePendingStudents, useStudents } from "@/hooks";
import type { User, UserStatus } from "@/types";
import { PendingStudentsQueue } from "./pending-students-queue";
import { StudentAdmissionDialog } from "./student-admission-dialog";
import { StudentDetailsModal } from "./student-details-modal";
import { StudentPagination } from "./student-pagination";
import { StudentTable } from "./student-table";
import { StudentToolbar } from "./student-toolbar";

export function StudentsManagementView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [_isPending, startTransition] = useTransition();

  const [isAdmissionOpen, setIsAdmissionOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);

  // Active Tab Sync
  const activeTab = searchParams.get("tab") || "enrolled";

  // URL Params for Enrolled Students
  const page = Number(searchParams.get("page") || "1");
  const limit = Number(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || "";
  const status =
    (searchParams.get("status") as UserStatus | "ALL" | null) || "ALL";
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder =
    (searchParams.get("sortOrder") as "asc" | "desc" | null) || "desc";

  // Fetch enrolled students
  const { data: studentsResponse, isLoading: isStudentsLoading } = useStudents({
    page,
    limit,
    search: search.trim() ? search.trim() : undefined,
    status: status !== "ALL" ? status : undefined,
    sortBy,
    sortOrder,
  });

  // Fetch pending applications count for the tab badge
  const { data: pendingResponse } = usePendingStudents({ limit: 1 });

  const enrolledStudents = studentsResponse?.data || [];
  const enrolledMeta = studentsResponse?.meta;
  const pendingCount = pendingResponse?.meta?.total || 0;

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "enrolled") {
      params.delete("tab");
    } else {
      params.set("tab", value);
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Primary Action */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Students Management
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Administer enrolled students, manage academic records, and review
            online admissions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsAdmissionOpen(true)}
            size="sm"
            className="gap-1.5 shadow-sm font-medium"
          >
            <UserPlus className="size-4" />
            <span>Admit Student</span>
          </Button>
        </div>
      </div>

      {/* Primary Tabs: Enrolled vs Pending Approvals */}
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full space-y-4"
      >
        <div className="border-b border-border/80 pb-3">
          <TabsList className="group-data-horizontal/tabs:h-11 p-1 bg-muted/60 rounded-xl border border-border/50 gap-1.5 shadow-2xs inline-flex items-center">
            <TabsTrigger
              value="enrolled"
              className="px-4 text-sm font-medium gap-2.5 rounded-lg h-9 data-active:bg-background data-active:text-foreground data-active:shadow-xs transition-all"
            >
              <Users className="size-4 text-muted-foreground" />
              <span>Admitted Students</span>
              {enrolledMeta && (
                <Badge
                  variant="secondary"
                  className="ml-2 text-xs px-2 py-0.5 font-semibold rounded-full"
                >
                  {enrolledMeta.total}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="px-4 text-sm font-medium gap-2.5 rounded-lg h-9 data-active:bg-background data-active:text-foreground data-active:shadow-xs transition-all"
            >
              <UserCheck className="size-4 text-muted-foreground" />
              <span>Pending Approvals</span>
              {pendingCount > 0 && (
                <Badge
                  variant="outline"
                  className="ml-2 text-xs px-2 py-0.5 bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 font-semibold rounded-full"
                >
                  {pendingCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Enrolled Students Directory */}
        <TabsContent value="enrolled" className="space-y-4 outline-none">
          <StudentToolbar
            currentStatus={status}
            currentSort={`${sortBy}:${sortOrder}`}
            currentSearch={search}
          />

          <StudentTable
            students={enrolledStudents}
            isLoading={isStudentsLoading}
            onViewDetails={(student) => setSelectedStudent(student)}
          />

          <StudentPagination meta={enrolledMeta} />
        </TabsContent>

        {/* Tab 2: Pending Applications Queue */}
        <TabsContent value="pending" className="space-y-4 outline-none">
          <PendingStudentsQueue />
        </TabsContent>
      </Tabs>

      {/* Admission Dialog */}
      <StudentAdmissionDialog
        open={isAdmissionOpen}
        onOpenChange={setIsAdmissionOpen}
      />

      {/* Student Dossier Modal */}
      <StudentDetailsModal
        student={selectedStudent}
        open={Boolean(selectedStudent)}
        onOpenChange={(open) => {
          if (!open) setSelectedStudent(null);
        }}
      />
    </div>
  );
}
