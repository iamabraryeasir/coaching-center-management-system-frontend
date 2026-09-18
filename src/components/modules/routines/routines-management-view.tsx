"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
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
  useBatches,
  useBatchTimetable,
  useDeleteRoutineMutation,
  useRoutines,
  useTeacherSchedule,
  useTeachers,
} from "@/hooks";
import {
  ACADEMIC_DAYS_ORDER,
  type DayOfWeek,
  type DayTimetableGroup,
  type RoutineSlot,
} from "@/types";
import { RoutineSlotDialog } from "./routine-slot-dialog";
import { RoutineToolbar, type RoutineViewMode } from "./routine-toolbar";
import { WeeklyTimetableGrid } from "./weekly-timetable-grid";

export function RoutinesManagementView() {
  const searchParams = useSearchParams();
  const { setOpen } = useSidebar();

  // Collapse sidebar by default on the routine route to provide maximum screen real estate for the 7-day grid,
  // and restore when navigating away to other dashboard pages.
  useEffect(() => {
    setOpen(false);
    return () => {
      setOpen(true);
    };
  }, [setOpen]);

  const initialViewMode: RoutineViewMode =
    (searchParams.get("view") as RoutineViewMode) ||
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

  // Dialog states
  const [isSlotDialogOpen, setIsSlotDialogOpen] = useState(false);
  const [slotToEdit, setSlotToEdit] = useState<RoutineSlot | null>(null);
  const [defaultDayForNewSlot, setDefaultDayForNewSlot] = useState<
    DayOfWeek | undefined
  >(undefined);
  const [slotToDelete, setSlotToDelete] = useState<RoutineSlot | null>(null);

  // Fetch batches & teachers for selectors
  const { data: batchesResponse, isLoading: isBatchesLoading } = useBatches({
    limit: 100,
  });
  const { data: teachersResponse, isLoading: isTeachersLoading } = useTeachers({
    limit: 100,
  });

  const batches = batchesResponse?.data || [];
  const teachers = teachersResponse?.data || [];

  // Auto-select first batch or first teacher if none selected
  const activeBatchId = selectedBatchId || batches[0]?.id || "";
  const activeTeacherId = selectedTeacherId || teachers[0]?.id || "";

  // Queries for timetable data
  const { data: allRoutinesResponse, isLoading: isAllRoutinesLoading } =
    useRoutines({ limit: 100 }, viewMode === "all");

  const { data: batchTimetableResponse, isLoading: isBatchTimetableLoading } =
    useBatchTimetable(
      activeBatchId,
      viewMode === "batch" && Boolean(activeBatchId),
    );

  const { data: teacherScheduleResponse, isLoading: isTeacherScheduleLoading } =
    useTeacherSchedule(
      activeTeacherId,
      viewMode === "teacher" && Boolean(activeTeacherId),
    );

  const deleteMutation = useDeleteRoutineMutation();

  // Active Schedule payload (grouped Saturday -> Friday)
  const activeSchedule: DayTimetableGroup[] | undefined = useMemo(() => {
    if (viewMode === "all") {
      const allSlots = allRoutinesResponse?.data || [];
      return ACADEMIC_DAYS_ORDER.map((day) => ({
        dayOfWeek: day,
        slots: allSlots
          .filter((slot) => slot.dayOfWeek === day)
          .sort((a, b) => a.startTime.localeCompare(b.startTime)),
      }));
    }
    if (viewMode === "batch") {
      return batchTimetableResponse?.data?.schedule;
    }
    return teacherScheduleResponse?.data?.schedule;
  }, [
    viewMode,
    allRoutinesResponse?.data,
    batchTimetableResponse?.data?.schedule,
    teacherScheduleResponse?.data?.schedule,
  ]);

  const isLoadingTimetable =
    viewMode === "all"
      ? isAllRoutinesLoading
      : viewMode === "batch"
        ? isBatchesLoading || isBatchTimetableLoading
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
          viewMode={viewMode}
          onViewModeChange={(mode) => setViewMode(mode)}
          selectedBatchId={activeBatchId}
          onSelectBatchId={(id) => setSelectedBatchId(id)}
          batches={batches}
          selectedTeacherId={activeTeacherId}
          onSelectTeacherId={(id) => setSelectedTeacherId(id)}
          teachers={teachers}
          onAddSlot={() => handleOpenAddSlot()}
          onPrint={handlePrint}
        />
      </div>

      {/* Clean Routine Print Header (Visible ONLY during A4 print / PDF export) */}
      <div className="hidden print:block text-center pb-3 mb-4 border-b-2 border-black">
        <h1 className="text-2xl font-black uppercase tracking-tight text-black">
          {siteConfig.name}
        </h1>
        <h2 className="text-sm font-bold text-neutral-800 mt-1">
          {viewMode === "batch"
            ? `Class Routine — ${selectedBatchObj?.name || "Academic Batch"}`
            : viewMode === "teacher"
              ? `Class Routine — ${selectedTeacherObj?.name || "Faculty Member"}`
              : "Weekly Class Routine"}
        </h2>
      </div>

      {/* 7-Day Timetable Grid View (Rendered in dashboard and directly in A4 print) */}
      <div>
        <WeeklyTimetableGrid
          schedule={activeSchedule}
          isLoading={isLoadingTimetable}
          viewMode={viewMode}
          onAddSlot={handleOpenAddSlot}
          onEditSlot={handleOpenEditSlot}
          onDeleteSlot={(slot) => setSlotToDelete(slot)}
          emptyTitle={
            viewMode === "all"
              ? "No classes scheduled across any batch yet"
              : viewMode === "batch"
                ? `No classes scheduled for "${selectedBatchObj?.name || "this batch"}"`
                : `No classes scheduled for "${selectedTeacherObj?.name || "this faculty member"}"`
          }
          emptyDescription="Start scheduling regular weekly periods to assign rooms and prevent timetable clashes."
        />
      </div>

      {/* Create / Edit Routine Slot Modal */}
      <RoutineSlotDialog
        open={isSlotDialogOpen}
        onOpenChange={setIsSlotDialogOpen}
        slotToEdit={slotToEdit}
        defaultBatchId={viewMode === "batch" ? activeBatchId : undefined}
        defaultDayOfWeek={defaultDayForNewSlot}
        batches={batches}
        teachers={teachers}
      />

      {/* Delete Slot Confirmation Modal */}
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
              ? This will release the allocated classroom and teacher time slot.
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
    </div>
  );
}
