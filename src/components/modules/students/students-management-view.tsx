"use client";

import { UserCheck, UserPlus, Users } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

  // Fetch pending count
  const { data: pendingResponse } = usePendingStudents();
  const pendingCount = (pendingResponse?.data as unknown[])?.length || 0;

  const enrolledStudents = studentsResponse?.data || [];
  const enrolledMeta = studentsResponse?.meta;

  const handleTabChange = (val: string | null) => {
    if (!val) return;
    const params = new URLSearchParams(searchParams.toString());
    if (val === "enrolled") {
      params.delete("tab");
    } else {
      params.set("tab", val);
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="space-y-4">
      {/* Header View Options & Creation */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Student Management
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Supervise registered candidates, monitor batch assignments, and
            authorize pending admissions.
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

      {/* View Switcher Select Component */}
      <div className="border-b border-border/80 pb-3 flex items-center justify-between gap-3">
        <div className="w-full sm:w-64">
          <Select value={activeTab} onValueChange={handleTabChange}>
            <SelectTrigger className="h-10 text-xs w-full bg-background font-medium">
              <SelectValue placeholder="Select View">
                {(val: string | null) => {
                  if (val === "pending") {
                    return (
                      <div className="flex items-center justify-between w-full pr-2">
                        <div className="flex items-center gap-2">
                          <UserCheck className="size-3.5 text-muted-foreground" />
                          <span>Pending Approvals</span>
                        </div>
                        {pendingCount > 0 && (
                          <Badge
                            variant="outline"
                            className="text-xs px-2 py-0.5 bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 font-semibold rounded-full"
                          >
                            {pendingCount}
                          </Badge>
                        )}
                      </div>
                    );
                  }
                  return (
                    <div className="flex items-center justify-between w-full pr-2">
                      <div className="flex items-center gap-2">
                        <Users className="size-3.5 text-muted-foreground" />
                        <span>Admitted Students</span>
                      </div>
                      {enrolledMeta && (
                        <Badge
                          variant="secondary"
                          className="text-xs px-2 py-0.5 font-semibold rounded-full"
                        >
                          {enrolledMeta.total}
                        </Badge>
                      )}
                    </div>
                  );
                }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="w-64">
              <SelectItem value="enrolled" className="text-xs py-2">
                <div className="flex items-center justify-between w-full gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="size-3.5 text-muted-foreground" />
                    <span>Admitted Students</span>
                  </div>
                  {enrolledMeta && (
                    <Badge
                      variant="secondary"
                      className="text-xs px-2 py-0.5 font-semibold rounded-full"
                    >
                      {enrolledMeta.total}
                    </Badge>
                  )}
                </div>
              </SelectItem>
              <SelectItem value="pending" className="text-xs py-2">
                <div className="flex items-center justify-between w-full gap-4">
                  <div className="flex items-center gap-2">
                    <UserCheck className="size-3.5 text-muted-foreground" />
                    <span>Pending Approvals</span>
                  </div>
                  {pendingCount > 0 && (
                    <Badge
                      variant="outline"
                      className="text-xs px-2 py-0.5 bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 font-semibold rounded-full"
                    >
                      {pendingCount}
                    </Badge>
                  )}
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active View Content */}
      {activeTab === "enrolled" ? (
        <div className="space-y-4">
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
        </div>
      ) : (
        <div className="space-y-4">
          <PendingStudentsQueue />
        </div>
      )}

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
