"use client";

import { startOfDay, subDays } from "date-fns";
import { Eye, FilterX, Globe, RotateCcw, ScrollText, X } from "lucide-react";
import { useState } from "react";
import { StudentPagination } from "@/components/modules/students";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuditLogStats, useAuditLogs } from "@/hooks";
import { formatDateSafe } from "@/lib/utils";
import type { AuditLog } from "@/types";
import {
  AuditActionBadge,
  AuditEntityBadge,
  AuditStatusBadge,
} from "./audit-log-badge";
import { AuditLogDetailDrawer } from "./audit-log-detail-drawer";

interface ActionOption {
  label: string;
  value: string;
}

interface ActionGroup {
  group: string;
  items: ActionOption[];
}

// Separated action groups without emojis for clean, professional UX
const ACTION_GROUPS: ActionGroup[] = [
  {
    group: "Event Categories",
    items: [
      { label: "All Actions", value: "ALL" },
      { label: "Any Creation / Add Event", value: "CAT:CREATE" },
      { label: "Any Update / Edit Event", value: "CAT:UPDATE" },
      { label: "Any Deletion / Removal Event", value: "CAT:DELETE" },
      { label: "Authentication & Session", value: "CAT:AUTH" },
      { label: "Exams & Results", value: "CAT:EXAM" },
      { label: "Payments & Billing", value: "CAT:PAYMENT" },
    ],
  },
  {
    group: "Authentication & Security",
    items: [
      { label: "User Login", value: "LOGIN" },
      { label: "User Logout", value: "LOGOUT" },
      { label: "Update User Status", value: "UPDATE_STATUS" },
    ],
  },
  {
    group: "Students & Admissions",
    items: [
      { label: "Register Student", value: "REGISTER_STUDENT" },
      { label: "Approve Student Admission", value: "APPROVE_STUDENT" },
      { label: "Reject Student Admission", value: "REJECT_STUDENT" },
    ],
  },
  {
    group: "Teachers & Staff",
    items: [
      { label: "Register Teacher", value: "REGISTER_TEACHER" },
      { label: "Update Teacher Permissions", value: "UPDATE_PERMISSIONS" },
    ],
  },
  {
    group: "Academic Batches & Enrollments",
    items: [
      { label: "Create Academic Batch", value: "CREATE_BATCH" },
      { label: "Update Batch", value: "UPDATE_BATCH" },
      { label: "Delete Batch", value: "DELETE_BATCH" },
      { label: "Direct Student Enrollment", value: "DIRECT_ENROLL" },
      { label: "Approve Batch Enrollment", value: "APPROVE_ENROLLMENT" },
      { label: "Reject Batch Enrollment", value: "REJECT_ENROLLMENT" },
    ],
  },
  {
    group: "Class Routines & Timetables",
    items: [
      { label: "Create Timetable Slot", value: "CREATE_ROUTINE" },
      { label: "Update Timetable Slot", value: "UPDATE_ROUTINE" },
      { label: "Delete Timetable Slot", value: "DELETE_ROUTINE" },
    ],
  },
  {
    group: "Daily Attendance",
    items: [{ label: "Submit Daily Attendance", value: "SUBMIT_ATTENDANCE" }],
  },
  {
    group: "Exams, Marks & Results",
    items: [
      { label: "Create Exam", value: "CREATE_EXAM" },
      { label: "Update Exam", value: "UPDATE_EXAM" },
      { label: "Delete Exam", value: "DELETE_EXAM" },
      { label: "Submit Exam Marks", value: "SUBMIT_MARKS" },
      { label: "Publish Exam Results", value: "PUBLISH_RESULTS" },
    ],
  },
  {
    group: "Payments & Invoicing",
    items: [{ label: "Record Manual Payment", value: "MANUAL_PAYMENT" }],
  },
  {
    group: "Institution Management",
    items: [
      { label: "Update Institution Profile", value: "UPDATE_INSTITUTION" },
    ],
  },
];

// Flat list of all predefined specific action values to compare against discovered actions
const KNOWN_ACTION_VALUES: Set<string> = new Set(
  ACTION_GROUPS.flatMap((g) => g.items.map((i) => i.value)),
);

const ENTITY_OPTIONS = [
  { label: "All Entities", value: "ALL" },
  { label: "User Accounts", value: "USER" },
  { label: "Academic Batches", value: "BATCH" },
  { label: "Class Routines", value: "ROUTINE" },
  { label: "Daily Attendance", value: "ATTENDANCE" },
  { label: "Exams & Results", value: "EXAM" },
  { label: "Payments & Fees", value: "PAYMENT" },
  { label: "Institution Profile", value: "INSTITUTION" },
] as const;

const STATUS_OPTIONS = [
  { label: "All Statuses", value: "ALL" },
  { label: "Success", value: "SUCCESS" },
  { label: "Failed / Error", value: "FAILED" },
  { label: "Pending", value: "PENDING" },
] as const;

const DATE_RANGE_OPTIONS = [
  { label: "All Time", value: "ALL" },
  { label: "Today", value: "TODAY" },
  { label: "Last 7 Days", value: "7D" },
  { label: "Last 30 Days", value: "30D" },
] as const;

// Human-readable labels for Select Trigger display (no emojis)
const ACTION_DISPLAY_MAP: Record<string, string> = {
  ALL: "All Actions",
  "CAT:CREATE": "Creation / Add Events",
  "CAT:UPDATE": "Update / Edit Events",
  "CAT:DELETE": "Deletion / Removal Events",
  "CAT:AUTH": "Authentication & Session",
  "CAT:EXAM": "Exams & Results",
  "CAT:PAYMENT": "Payments & Billing",
  LOGIN: "User Login",
  LOGOUT: "User Logout",
  REGISTER_STUDENT: "Register Student",
  REGISTER_TEACHER: "Register Teacher",
  APPROVE_STUDENT: "Approve Student Admission",
  REJECT_STUDENT: "Reject Student Admission",
  CREATE_BATCH: "Create Academic Batch",
  UPDATE_BATCH: "Update Batch",
  DELETE_BATCH: "Delete Batch",
  DIRECT_ENROLL: "Direct Student Enrollment",
  APPROVE_ENROLLMENT: "Approve Batch Enrollment",
  REJECT_ENROLLMENT: "Reject Batch Enrollment",
  CREATE_ROUTINE: "Create Timetable Slot",
  UPDATE_ROUTINE: "Update Timetable Slot",
  DELETE_ROUTINE: "Delete Timetable Slot",
  SUBMIT_ATTENDANCE: "Submit Daily Attendance",
  CREATE_EXAM: "Create Exam",
  UPDATE_EXAM: "Update Exam",
  DELETE_EXAM: "Delete Exam",
  SUBMIT_MARKS: "Submit Exam Marks",
  PUBLISH_RESULTS: "Publish Exam Results",
  MANUAL_PAYMENT: "Record Manual Payment",
  UPDATE_INSTITUTION: "Update Institution Profile",
  UPDATE_STATUS: "Update User Status",
  UPDATE_PERMISSIONS: "Update Teacher Permissions",
};

const ENTITY_DISPLAY_MAP: Record<string, string> = {
  ALL: "All Entities",
  USER: "User Accounts",
  BATCH: "Academic Batches",
  ROUTINE: "Class Routines",
  ATTENDANCE: "Daily Attendance",
  EXAM: "Exams & Results",
  PAYMENT: "Payments & Fees",
  INSTITUTION: "Institution Profile",
};

const STATUS_DISPLAY_MAP: Record<string, string> = {
  ALL: "All Statuses",
  SUCCESS: "Success",
  FAILED: "Failed / Error",
  PENDING: "Pending",
};

const DATE_RANGE_DISPLAY_MAP: Record<string, string> = {
  ALL: "All Time",
  TODAY: "Today",
  "7D": "Last 7 Days",
  "30D": "Last 30 Days",
};

/**
 * Dedicated Table Skeleton for Route Streaming / Initial Page Load
 */
export function AuditLogsTableSkeleton() {
  return (
    <div className="space-y-4">
      {/* Filters Toolbar Skeleton matching the 4 filters layout */}
      <div className="rounded-xl border border-border/80 bg-card p-4 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <Skeleton className="h-9 sm:col-span-2 lg:col-span-2 rounded-md" />
          <Skeleton className="h-9 rounded-md" />
          <Skeleton className="h-9 rounded-md" />
          <Skeleton className="h-9 rounded-md" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-2xs">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="w-45">Timestamp</TableHead>
              <TableHead>Operator / Actor</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Entity</TableHead>
              <TableHead>Client IP</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-20 text-right">Inspect</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              "table-skel-1",
              "table-skel-2",
              "table-skel-3",
              "table-skel-4",
              "table-skel-5",
              "table-skel-6",
            ].map((key) => (
              <TableRow key={key}>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Skeleton className="size-7 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-3.5 w-24" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-28 rounded" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-16 rounded" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="size-7 rounded ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export function AuditLogsTable() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [selectedAction, setSelectedAction] = useState<string>("ALL");
  const [selectedEntity, setSelectedEntity] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedDateRange, setSelectedDateRange] = useState<string>("ALL");

  // Selected audit log for detail drawer
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Optional stats for dynamic action options
  const { data: statsResponse } = useAuditLogStats();

  // Search parameter when category is selected
  const querySearch = selectedAction.startsWith("CAT:")
    ? selectedAction.replace("CAT:", "")
    : undefined;

  const queryAction =
    selectedAction === "ALL" || selectedAction.startsWith("CAT:")
      ? undefined
      : selectedAction;

  // Use standard TanStack Query with placeholderData to maintain stable UI
  const {
    data: logsResponse,
    isLoading: isInitialLoading,
    isFetching,
    refetch,
  } = useAuditLogs({
    page,
    limit,
    search: querySearch,
    action: queryAction,
    entity: selectedEntity !== "ALL" ? selectedEntity : undefined,
    status: selectedStatus !== "ALL" ? selectedStatus : undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const rawLogs = logsResponse?.data || [];
  const meta = logsResponse?.meta;

  // Dynamically extract any extra actions from backend data/stats not in predefined list
  const dynamicActionSet = new Set<string>();
  for (const log of rawLogs) {
    if (log.action && !KNOWN_ACTION_VALUES.has(log.action)) {
      dynamicActionSet.add(log.action);
    }
  }
  const breakdown = statsResponse?.data?.actionBreakdown;
  if (Array.isArray(breakdown)) {
    for (const item of breakdown) {
      if (item.action && !KNOWN_ACTION_VALUES.has(item.action)) {
        dynamicActionSet.add(item.action);
      }
    }
  } else if (breakdown && typeof breakdown === "object") {
    for (const key of Object.keys(breakdown)) {
      if (!KNOWN_ACTION_VALUES.has(key)) {
        dynamicActionSet.add(key);
      }
    }
  }
  const dynamicActions = Array.from(dynamicActionSet);

  // In-memory filtering for instant 0ms response and rock-solid stability
  const logs = rawLogs.filter((log) => {
    // 1. Action filtering
    if (selectedAction !== "ALL") {
      const logAction = (log.action || "").toUpperCase();
      if (selectedAction.startsWith("CAT:")) {
        const cat = selectedAction.replace("CAT:", "").toUpperCase();
        if (!logAction.includes(cat)) {
          return false;
        }
      } else if (logAction !== selectedAction.toUpperCase()) {
        return false;
      }
    }

    // 2. Entity filtering
    if (selectedEntity !== "ALL") {
      const logEntity = (log.entity || "").toUpperCase();
      const target = selectedEntity.toUpperCase();
      if (logEntity !== target && !logEntity.includes(target)) {
        return false;
      }
    }

    // 3. Status filtering
    if (selectedStatus !== "ALL") {
      const logStatus = (log.status || "SUCCESS").toUpperCase();
      const target = selectedStatus.toUpperCase();
      if (
        target === "SUCCESS" &&
        !["SUCCESS", "OK", "200"].includes(logStatus)
      ) {
        return false;
      }
      if (
        target === "FAILED" &&
        !["FAILED", "ERROR", "FAILURE"].includes(logStatus)
      ) {
        return false;
      }
      if (target === "PENDING" && logStatus !== "PENDING") {
        return false;
      }
    }

    // 4. Timeframe filtering
    if (selectedDateRange !== "ALL") {
      const logTime = new Date(log.createdAt).getTime();
      const now = Date.now();
      if (selectedDateRange === "TODAY") {
        const todayStart = startOfDay(now).getTime();
        if (logTime < todayStart) return false;
      } else if (selectedDateRange === "7D") {
        const sevenDaysAgo = subDays(now, 7).getTime();
        if (logTime < sevenDaysAgo) return false;
      } else if (selectedDateRange === "30D") {
        const thirtyDaysAgo = subDays(now, 30).getTime();
        if (logTime < thirtyDaysAgo) return false;
      }
    }

    return true;
  });

  const hasActiveFilters =
    selectedAction !== "ALL" ||
    selectedEntity !== "ALL" ||
    selectedStatus !== "ALL" ||
    selectedDateRange !== "ALL";

  const handleClearFilters = () => {
    setSelectedAction("ALL");
    setSelectedEntity("ALL");
    setSelectedStatus("ALL");
    setSelectedDateRange("ALL");
    setPage(1);
  };

  const handleOpenDetail = (log: AuditLog) => {
    setSelectedLog(log);
    setIsDrawerOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDrawerOpen(false);
    setSelectedLog(null);
  };

  return (
    <div className="space-y-4">
      {/* Filters Toolbar */}
      <div className="rounded-xl border border-border/80 bg-card p-4 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* 1. Action Filter Select (Broader: spans 2 columns with categorized groups) */}
          <div className="sm:col-span-2 lg:col-span-2">
            <Select
              value={selectedAction}
              onValueChange={(val) => {
                if (val) {
                  setSelectedAction(val);
                  setPage(1);
                }
              }}
            >
              <SelectTrigger className="w-full bg-background/80 text-xs h-9">
                <SelectValue placeholder="Action">
                  {(val: string | null) =>
                    val && val !== "ALL"
                      ? `Action: ${ACTION_DISPLAY_MAP[val] || val}`
                      : "All Actions"
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="w-[320px] sm:w-95 max-h-88">
                {ACTION_GROUPS.map((group, groupIdx) => (
                  <div key={group.group}>
                    {groupIdx > 0 && <SelectSeparator />}
                    <SelectGroup>
                      <SelectLabel className="font-semibold text-[11px] text-muted-foreground uppercase tracking-wider px-2 py-1">
                        {group.group}
                      </SelectLabel>
                      {group.items.map((opt) => (
                        <SelectItem
                          key={opt.value}
                          value={opt.value}
                          className="text-xs"
                        >
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </div>
                ))}

                {dynamicActions.length > 0 && (
                  <div>
                    <SelectSeparator />
                    <SelectGroup>
                      <SelectLabel className="font-semibold text-[11px] text-muted-foreground uppercase tracking-wider px-2 py-1">
                        Other Discovered Actions
                      </SelectLabel>
                      {dynamicActions.map((action) => (
                        <SelectItem
                          key={action}
                          value={action}
                          className="text-xs"
                        >
                          {action}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* 2. Entity Filter Select */}
          <div>
            <Select
              value={selectedEntity}
              onValueChange={(val) => {
                if (val) {
                  setSelectedEntity(val);
                  setPage(1);
                }
              }}
            >
              <SelectTrigger className="w-full bg-background/80 text-xs h-9">
                <SelectValue placeholder="Entity">
                  {(val: string | null) =>
                    val && val !== "ALL"
                      ? `Entity: ${ENTITY_DISPLAY_MAP[val] || val}`
                      : "All Entities"
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {ENTITY_OPTIONS.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className="text-xs"
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 3. Execution Status Select */}
          <div>
            <Select
              value={selectedStatus}
              onValueChange={(val) => {
                if (val) {
                  setSelectedStatus(val);
                  setPage(1);
                }
              }}
            >
              <SelectTrigger className="w-full bg-background/80 text-xs h-9">
                <SelectValue placeholder="Status">
                  {(val: string | null) =>
                    val && val !== "ALL"
                      ? `Status: ${STATUS_DISPLAY_MAP[val] || val}`
                      : "All Statuses"
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className="text-xs"
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 4. Timeframe Select */}
          <div>
            <Select
              value={selectedDateRange}
              onValueChange={(val) => {
                if (val) {
                  setSelectedDateRange(val);
                  setPage(1);
                }
              }}
            >
              <SelectTrigger className="w-full bg-background/80 text-xs h-9">
                <SelectValue placeholder="Timeframe">
                  {(val: string | null) =>
                    val && val !== "ALL"
                      ? `Time: ${DATE_RANGE_DISPLAY_MAP[val] || val}`
                      : "All Time"
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {DATE_RANGE_OPTIONS.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className="text-xs"
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Controls & Active Filter Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-border/50 text-xs">
          {/* Active Filter Chips / Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {hasActiveFilters ? (
              <>
                <span className="text-[11px] text-muted-foreground font-medium mr-1">
                  Active:
                </span>
                {selectedAction !== "ALL" && (
                  <Badge
                    variant="secondary"
                    className="gap-1 text-[11px] font-normal pl-2 pr-1 py-0.5"
                  >
                    Action:{" "}
                    {ACTION_DISPLAY_MAP[selectedAction] || selectedAction}
                    <button
                      type="button"
                      onClick={() => setSelectedAction("ALL")}
                      className="hover:bg-muted-foreground/20 rounded-full p-0.5"
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                )}
                {selectedEntity !== "ALL" && (
                  <Badge
                    variant="secondary"
                    className="gap-1 text-[11px] font-normal pl-2 pr-1 py-0.5"
                  >
                    Entity:{" "}
                    {ENTITY_DISPLAY_MAP[selectedEntity] || selectedEntity}
                    <button
                      type="button"
                      onClick={() => setSelectedEntity("ALL")}
                      className="hover:bg-muted-foreground/20 rounded-full p-0.5"
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                )}
                {selectedStatus !== "ALL" && (
                  <Badge
                    variant="secondary"
                    className="gap-1 text-[11px] font-normal pl-2 pr-1 py-0.5"
                  >
                    Status:{" "}
                    {STATUS_DISPLAY_MAP[selectedStatus] || selectedStatus}
                    <button
                      type="button"
                      onClick={() => setSelectedStatus("ALL")}
                      className="hover:bg-muted-foreground/20 rounded-full p-0.5"
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                )}
                {selectedDateRange !== "ALL" && (
                  <Badge
                    variant="secondary"
                    className="gap-1 text-[11px] font-normal pl-2 pr-1 py-0.5"
                  >
                    Time:{" "}
                    {DATE_RANGE_DISPLAY_MAP[selectedDateRange] ||
                      selectedDateRange}
                    <button
                      type="button"
                      onClick={() => setSelectedDateRange("ALL")}
                      className="hover:bg-muted-foreground/20 rounded-full p-0.5"
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                )}
              </>
            ) : (
              <span className="text-[11px] text-muted-foreground">
                Showing all events. Use filters above to narrow your query.
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
                className="gap-1.5 text-xs text-muted-foreground hover:text-foreground h-7"
              >
                <FilterX className="size-3.5" />
                Reset Filters
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="gap-1.5 text-xs h-7"
            >
              <RotateCcw
                className={`size-3.5 ${isFetching ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-2xs">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="w-45 font-semibold">Timestamp</TableHead>
              <TableHead className="font-semibold">Operator / Actor</TableHead>
              <TableHead className="font-semibold">Action</TableHead>
              <TableHead className="font-semibold">Entity</TableHead>
              <TableHead className="font-semibold">Client IP</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="w-20 text-right font-semibold">
                Inspect
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isInitialLoading && !logsResponse ? (
              [
                "row-skel-1",
                "row-skel-2",
                "row-skel-3",
                "row-skel-4",
                "row-skel-5",
                "row-skel-6",
              ].map((key) => (
                <TableRow key={key}>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Skeleton className="size-7 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-3.5 w-24" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-28 rounded" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16 rounded" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="size-7 rounded ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-56 text-center">
                  <div className="mx-auto flex max-w-sm flex-col items-center justify-center space-y-3">
                    <div className="flex size-12 items-center justify-center rounded-full bg-muted/80 text-muted-foreground">
                      <ScrollText className="size-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-foreground text-sm">
                        No audit logs found
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {hasActiveFilters
                          ? "No audit records match your current action, entity, status, or timeframe filters."
                          : "System activity logs will appear here once actions are performed."}
                      </p>
                    </div>
                    {hasActiveFilters && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearFilters}
                        className="text-xs mt-2"
                      >
                        Reset All Filters
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log.id} className="hover:bg-muted/30">
                  {/* Timestamp */}
                  <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                    <div>{formatDateSafe(log.createdAt)}</div>
                    <div className="text-[11px] text-muted-foreground/75">
                      {formatDateSafe(log.createdAt, {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </div>
                  </TableCell>

                  {/* Actor */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="size-7 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-[10px] shrink-0">
                        {log.user?.name
                          ? log.user.name.slice(0, 2).toUpperCase()
                          : "SYS"}
                      </div>
                      <div className="min-w-0 max-w-40">
                        <p className="text-xs font-medium text-foreground truncate">
                          {log.user?.name || log.userId || "System"}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {log.user?.email || "internal@system"}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Action */}
                  <TableCell>
                    <AuditActionBadge action={log.action} />
                  </TableCell>

                  {/* Entity */}
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <AuditEntityBadge entity={log.entity} />
                      {log.entityId && (
                        <span className="font-mono text-[10px] text-muted-foreground truncate max-w-28">
                          {log.entityId}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  {/* IP Address */}
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Globe className="size-3 text-muted-foreground/70" />
                      {log.ipAddress || "127.0.0.1"}
                    </span>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <AuditStatusBadge status={log.status || "SUCCESS"} />
                  </TableCell>

                  {/* Inspect action */}
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleOpenDetail(log)}
                      title="Inspect Log Entry"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Eye className="size-4" />
                      <span className="sr-only">Inspect Log</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {meta && meta.total > 0 && (
          <div className="border-t border-border/80 p-3 bg-muted/10">
            <StudentPagination
              meta={meta}
              onPageChange={(p) => setPage(p)}
              onLimitChange={(l) => {
                setLimit(l);
                setPage(1);
              }}
              itemLabel="audit logs"
            />
          </div>
        )}
      </div>

      {/* Slide-out detail drawer */}
      <AuditLogDetailDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDetail}
        logId={selectedLog?.id}
        initialLog={selectedLog}
      />
    </div>
  );
}
