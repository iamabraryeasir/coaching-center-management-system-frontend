"use client";

import { KeyRound, ShieldCheck, UserPlus, Users } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useTeachers } from "@/hooks";
import { getTeacherPermissions, type User, type UserStatus } from "@/types";
import { RegisterTeacherDialog } from "./register-teacher-dialog";
import { TeacherDetailsModal } from "./teacher-details-modal";
import { TeacherPermissionsDialog } from "./teacher-permissions-dialog";
import { TeacherTable } from "./teacher-table";
import { TeacherToolbar } from "./teacher-toolbar";

export function TeachersManagementView() {
  const searchParams = useSearchParams();

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [selectedTeacherForDetails, setSelectedTeacherForDetails] =
    useState<User | null>(null);
  const [selectedTeacherForPermissions, setSelectedTeacherForPermissions] =
    useState<User | null>(null);

  // URL Params for Teachers Directory
  const page = Number(searchParams.get("page") || "1");
  const limit = Number(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || "";
  const status =
    (searchParams.get("status") as UserStatus | "ALL" | null) || "ALL";
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder =
    (searchParams.get("sortOrder") as "asc" | "desc" | null) || "desc";

  // Fetch teachers query
  const { data: teachersResponse, isLoading: isTeachersLoading } = useTeachers({
    page,
    limit,
    search: search.trim() ? search.trim() : undefined,
    status: status !== "ALL" ? status : undefined,
    sortBy,
    sortOrder,
  });

  const teachers = teachersResponse?.data || [];
  const teachersMeta = teachersResponse?.meta;

  // Compute stat highlights
  const stats = useMemo(() => {
    const total = teachersMeta?.total ?? teachers.length;
    const active = teachers.filter((t) => t.status === "ACTIVE").length;
    const privileged = teachers.filter(
      (t) => getTeacherPermissions(t).length > 0,
    ).length;

    return { total, active, privileged };
  }, [teachers, teachersMeta]);

  return (
    <div className="space-y-6">
      {/* Top Banner & Primary Action */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Faculty & Teacher Management
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Supervise teaching staff, configure academic credentials, and assign
            system permissions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsRegisterOpen(true)}
            size="sm"
            className="gap-1.5 shadow-sm font-medium"
          >
            <UserPlus className="size-4" />
            <span>Onboard Faculty Member</span>
          </Button>
        </div>
      </div>

      {/* Quick Summary Highlights */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border/70 bg-card/60 p-4 shadow-2xs flex items-center gap-3.5">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
            <Users className="size-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">
              Total Faculty
            </p>
            <p className="text-xl font-bold text-foreground">{stats.total}</p>
          </div>
        </div>

        <div className="rounded-xl border border-border/70 bg-card/60 p-4 shadow-2xs flex items-center gap-3.5">
          <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">
              Active in Directory
            </p>
            <p className="text-xl font-bold text-foreground">{stats.active}</p>
          </div>
        </div>

        <div className="rounded-xl border border-border/70 bg-card/60 p-4 shadow-2xs flex items-center gap-3.5">
          <div className="flex size-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
            <KeyRound className="size-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">
              Staff with Permissions
            </p>
            <p className="text-xl font-bold text-foreground">
              {stats.privileged}
            </p>
          </div>
        </div>
      </div>

      {/* Directory Controls & Data Table */}
      <div className="space-y-4">
        <TeacherToolbar
          currentStatus={status}
          currentSort={`${sortBy}:${sortOrder}`}
          currentSearch={search}
        />

        <TeacherTable
          teachers={teachers}
          isLoading={isTeachersLoading}
          meta={teachersMeta}
          onViewDetails={(teacher) => setSelectedTeacherForDetails(teacher)}
          onManagePermissions={(teacher) =>
            setSelectedTeacherForPermissions(teacher)
          }
          onCreateTeacher={() => setIsRegisterOpen(true)}
        />
      </div>

      {/* Register / Onboard Faculty Dialog */}
      <RegisterTeacherDialog
        open={isRegisterOpen}
        onOpenChange={setIsRegisterOpen}
      />

      {/* Teacher Profile Dossier Modal */}
      <TeacherDetailsModal
        teacher={selectedTeacherForDetails}
        open={Boolean(selectedTeacherForDetails)}
        onOpenChange={(open) => {
          if (!open) setSelectedTeacherForDetails(null);
        }}
        onManagePermissions={(teacher) => {
          setSelectedTeacherForDetails(null);
          setSelectedTeacherForPermissions(teacher);
        }}
      />

      {/* Delegated Permissions Dialog */}
      <TeacherPermissionsDialog
        teacher={selectedTeacherForPermissions}
        open={Boolean(selectedTeacherForPermissions)}
        onOpenChange={(open) => {
          if (!open) setSelectedTeacherForPermissions(null);
        }}
      />
    </div>
  );
}
