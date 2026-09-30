"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSidebar } from "@/components/ui/sidebar";
import { siteConfig } from "@/config/site";
import {
  useAuth,
  useBatches,
  useBatchTimetable,
  useDeleteRoutineMutation,
  useMyTeacherSchedule,
  useRoutines,
  useTeacherSchedule,
  useTeachers,
} from "@/hooks";
import {
  ACADEMIC_DAYS_ORDER,
  type DayOfWeek,
  type DayTimetableGroup,
  type RoutineSlot,
  type User,
} from "@/types";
import { WeeklyTimetableGrid } from "../shared/weekly-timetable-grid";
import { RoutineSlotDialog } from "./routine-slot-dialog";
import { RoutineToolbar, type RoutineViewMode } from "./routine-toolbar";

interface RoutinesManagementViewProps {
  portalRole?: "ADMIN" | "TEACHER";
}

export function RoutinesManagementView({
  portalRole = "ADMIN",
}: RoutinesManagementViewProps = {}) {
  const searchParams = useSearchParams();
  const { setOpen } = useSidebar();
  const { user, hasPermission } = useAuth();

  const isTeacherPortal = portalRole === "TEACHER";
  const canManageRoutines =
    portalRole === "ADMIN" || hasPermission("MANAGE_ROUTINES");

  // Collapse sidebar by default on the routine route to provide maximum screen real estate for the 7-day grid,
  // and restore when navigating away to other dashboard pages.
  useEffect(() => {
    setOpen(false);
    return () => {
      setOpen(true);
    };
  }, [setOpen]);

  // When a teacher does not have MANAGE_ROUTINES, view is strictly "teacher" (their own routine)
  // When a teacher does not have MANAGE_ROUTINES, view is strictly "teacher" (their own routine).
  // When they DO have MANAGE_ROUTINES, they get full admin-level view capability (defaulting to "all" master schedule).
  const initialViewMode: RoutineViewMode = !canManageRoutines
    ? "teacher"
    : (searchParams.get("view") as RoutineViewMode) ||
      (searchParams.get("batchId")
        ? "batch"
        : searchParams.get("teacherId")
          ? "teacher"
          : "all");

  const [viewMode, setViewMode] = useState<RoutineViewMode>(initialViewMode);
  const [selectedBatchId, setSelectedBatchId] = useState<string>(
    searchParams.get("batchId") || "",
  );
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(
    searchParams.get("teacherId") || "",
  );

  const effectiveViewMode: RoutineViewMode = !canManageRoutines
    ? "teacher"
    : viewMode;

  // Effective teacher ID: in teacher portal, defaults to current teacher
  const effectiveTeacherId =
    selectedTeacherId || (isTeacherPortal && user?.id ? user.id : "");

  // Check if viewing the logged-in teacher's personal schedule
  const isViewingSelf =
    isTeacherPortal &&
    (!canManageRoutines ||
      !selectedTeacherId ||
      Boolean(user?.id && selectedTeacherId === user.id));

  // Dialog states
  const [isSlotDialogOpen, setIsSlotDialogOpen] = useState(false);
  const [slotToEdit, setSlotToEdit] = useState<RoutineSlot | null>(null);
  const [defaultDayForNewSlot, setDefaultDayForNewSlot] = useState<
    DayOfWeek | undefined
  >(undefined);
  const [slotToDelete, setSlotToDelete] = useState<RoutineSlot | null>(null);

  // Fetch batches & teachers for selectors only if user has management permissions
  const { data: batchesResponse, isLoading: isBatchesLoading } = useBatches(
    { limit: 100 },
    canManageRoutines,
  );
  const { data: teachersResponse, isLoading: isTeachersLoading } = useTeachers(
    { limit: 100 },
    canManageRoutines,
  );

  // Queries for timetable data
  const { data: allRoutinesResponse, isLoading: isAllRoutinesLoading } =
    useRoutines(
      { limit: 100 },
      canManageRoutines && effectiveViewMode === "all",
    );

  // Combine teachers from teachers API, routine slots, and authenticated user so names are never missing
  const teacherMap = new Map<string, User>();

  // 1. Add teachers from API response
  for (const t of teachersResponse?.data || []) {
    if (t?.id) teacherMap.set(t.id, t);
  }

  // 2. Discover teachers from all scheduled routine slots
  for (const slot of allRoutinesResponse?.data || []) {
    if (slot.teacher?.id && !teacherMap.has(slot.teacher.id)) {
      teacherMap.set(slot.teacher.id, {
        id: slot.teacher.id,
        name: slot.teacher.name,
        email: slot.teacher.email || "",
        phone: slot.teacher.phone || null,
        role: "TEACHER",
        status: "ACTIVE",
        createdAt: "",
        teacherProfile: {
          id: slot.teacher.id,
          designation: slot.teacher.designation || "Teacher",
          specialization: slot.teacher.specialization || "",
          qualification: "",
          joiningDate: "",
        },
      });
    }
  }

  // 3. Always include authenticated user with their actual name and profile
  if (user?.id) {
    const existing = teacherMap.get(user.id);
    teacherMap.set(user.id, {
      ...(existing || user),
      name: user.name || existing?.name || "My Routine",
      teacherProfile: user.teacherProfile ||
        existing?.teacherProfile || {
          id: user.id,
          designation: "Teacher",
          qualification: "",
          specialization: "",
          joiningDate: "",
        },
    });
  }

  const combinedTeachers: User[] = Array.from(teacherMap.values());

  const batches = batchesResponse?.data || [];
  const teachers = combinedTeachers;

  // Auto-select first batch or first teacher if none selected
  const activeBatchId = selectedBatchId || batches[0]?.id || "";
  const activeTeacherId = effectiveTeacherId || teachers[0]?.id || "";

  const { data: batchTimetableResponse, isLoading: isBatchTimetableLoading } =
    useBatchTimetable(
      activeBatchId,
      canManageRoutines &&
        effectiveViewMode === "batch" &&
        Boolean(activeBatchId),
    );

  // Personal schedule for authenticated teacher (GET /routines/my/teacher-schedule)
  const { data: myScheduleResponse, isLoading: isMyScheduleLoading } =
    useMyTeacherSchedule(isTeacherPortal && isViewingSelf);

  // Another teacher's schedule (GET /routines/teacher/:teacherUserId)
  const { data: teacherScheduleResponse, isLoading: isTeacherScheduleLoading } =
    useTeacherSchedule(
      activeTeacherId,
      effectiveViewMode === "teacher" &&
        !isViewingSelf &&
        Boolean(activeTeacherId),
    );

  const deleteMutation = useDeleteRoutineMutation();

  // Active Schedule payload (grouped Saturday -> Friday)
  const activeSchedule: DayTimetableGroup[] | undefined =
    effectiveViewMode === "all"
      ? ACADEMIC_DAYS_ORDER.map((day) => ({
          dayOfWeek: day,
          slots: (allRoutinesResponse?.data || [])
            .filter((slot) => slot.dayOfWeek === day)
            .sort((a, b) => a.startTime.localeCompare(b.startTime)),
        }))
      : effectiveViewMode === "batch"
        ? batchTimetableResponse?.data?.schedule
        : isViewingSelf
          ? myScheduleResponse?.data?.schedule
          : teacherScheduleResponse?.data?.schedule;

  const isLoadingTimetable =
    effectiveViewMode === "all"
      ? isAllRoutinesLoading
      : effectiveViewMode === "batch"
        ? isBatchesLoading || isBatchTimetableLoading
        : isViewingSelf
          ? isMyScheduleLoading
          : isTeachersLoading || isTeacherScheduleLoading;

  // Selected Entity Name
  const selectedBatchObj = batches.find((b) => b.id === activeBatchId);
  const selectedTeacherObj = teachers.find((t) => t.id === activeTeacherId);

  // Handle open add slot
  const handleOpenAddSlot = (dayOfWeek?: DayOfWeek) => {
    setSlotToEdit(null);
    setDefaultDayForNewSlot(dayOfWeek);
    setIsSlotDialogOpen(true);
  };

  // Handle open edit slot
  const handleOpenEditSlot = (slot: RoutineSlot) => {
    setSlotToEdit(slot);
    setIsSlotDialogOpen(true);
  };

  // Handle delete slot confirmation
  const confirmDelete = () => {
    if (!slotToDelete) return;
    deleteMutation.mutate(slotToDelete.id, {
      onSettled: () => setSlotToDelete(null),
    });
  };

  // Trigger native browser print directly on the active routine
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Global Print Media Rules for Crisp A4 Landscape Output */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 8mm;
          }
          *,
          *::before,
          *::after {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          /* Hide application shell elements */
          header,
          nav,
          aside,
          [data-slot="sidebar"],
          [data-slot="sidebar-container"],
          [data-slot="sidebar-rail"],
          .print\\:hidden {
            display: none !important;
          }
          /* Reset root layout constraints for paper flow */
          html,
          body {
            background: white !important;
            color: black !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: auto !important;
            min-height: 100% !important;
            overflow: visible !important;
          }
          /* Un-constrain inner page wrappers */
          main,
          [data-slot="sidebar-inset"],
          [data-slot="sidebar-inset"] > div,
          .mx-auto {
            margin: 0 !important;
            padding: 0 !important;
            max-width: 100% !important;
            width: 100% !important;
            overflow: visible !important;
            background: white !important;
          }
        }
      `}</style>

      {/* Routine Controls & Filter Toolbar (Screen only) */}
      <div className="print:hidden">
        <RoutineToolbar
          viewMode={effectiveViewMode}
          onViewModeChange={(mode) => setViewMode(mode)}
          selectedBatchId={activeBatchId}
          onSelectBatchId={(id) => setSelectedBatchId(id)}
          batches={batches}
          selectedTeacherId={effectiveTeacherId}
          onSelectTeacherId={(id) => setSelectedTeacherId(id)}
          teachers={teachers}
          currentUserId={user?.id}
          canManageRoutines={canManageRoutines}
          onAddSlot={canManageRoutines ? () => handleOpenAddSlot() : undefined}
          onPrint={handlePrint}
        />
      </div>

      {/* Clean Routine Print Header (Visible ONLY during A4 print / PDF export) */}
      <div className="hidden print:block text-center pb-3 mb-4 border-b-2 border-black">
        <h1 className="text-2xl font-black uppercase tracking-tight text-black">
          {siteConfig.name}
        </h1>
        <h2 className="text-sm font-bold text-neutral-800 mt-1">
          {effectiveViewMode === "batch"
            ? `Class Routine — ${selectedBatchObj?.name || "Academic Batch"}`
            : effectiveViewMode === "teacher"
              ? `Class Routine — ${
                  isViewingSelf
                    ? user?.name || "My Teaching Schedule"
                    : selectedTeacherObj?.name || "Teacher"
                }`
              : "Weekly Class Routine"}
        </h2>
      </div>

      {/* 7-Day Timetable Grid View (Rendered in dashboard and directly in A4 print) */}
      <div>
        <WeeklyTimetableGrid
          schedule={activeSchedule}
          isLoading={isLoadingTimetable}
          viewMode={effectiveViewMode}
          onAddSlot={canManageRoutines ? handleOpenAddSlot : undefined}
          onEditSlot={canManageRoutines ? handleOpenEditSlot : undefined}
          onDeleteSlot={
            canManageRoutines ? (slot) => setSlotToDelete(slot) : undefined
          }
          emptyTitle={
            effectiveViewMode === "all"
              ? "No classes scheduled across any batch yet"
              : effectiveViewMode === "batch"
                ? `No classes scheduled for "${selectedBatchObj?.name || "this batch"}"`
                : isViewingSelf
                  ? "No classes scheduled in your personal routine yet"
                  : `No classes scheduled for "${selectedTeacherObj?.name || "this teacher"}"`
          }
          emptyDescription="Start scheduling regular weekly periods to assign rooms and prevent timetable clashes."
        />
      </div>

      {/* Create / Edit Routine Slot Modal */}
      {canManageRoutines && (
        <RoutineSlotDialog
          open={isSlotDialogOpen}
          onOpenChange={setIsSlotDialogOpen}
          slotToEdit={slotToEdit}
          defaultBatchId={
            effectiveViewMode === "batch" ? activeBatchId : undefined
          }
          defaultDayOfWeek={defaultDayForNewSlot}
          batches={batches}
          teachers={teachers}
        />
      )}

      {/* Delete Slot Confirmation Modal */}
      {canManageRoutines && (
        <Dialog
          open={Boolean(slotToDelete)}
          onOpenChange={(open) => {
            if (!open) setSlotToDelete(null);
          }}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-destructive font-heading">
                Remove Class Slot
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm pt-1">
                Are you sure you want to remove the scheduled session for{" "}
                <strong className="text-foreground">
                  {slotToDelete?.subject || "this class"}
                </strong>{" "}
                on{" "}
                <span className="font-semibold">
                  {slotToDelete?.dayOfWeek} ({slotToDelete?.startTime} –{" "}
                  {slotToDelete?.endTime})
                </span>
                ? This will release the allocated classroom and teacher time
                slot.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="gap-2.5 sm:gap-2.5 pt-2">
              <DialogClose
                render={
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={deleteMutation.isPending}
                  >
                    Cancel
                  </Button>
                }
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={confirmDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Removing..." : "Remove Slot"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
