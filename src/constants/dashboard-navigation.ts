import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  CreditCard,
  GraduationCap,
  Layers,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  UserCheck,
  UserCircle,
  Users,
} from "lucide-react";
import type { TeacherPermission } from "@/types";

export interface DashboardNavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
  exact?: boolean;
  requiredPermission?: TeacherPermission;
}

export interface DashboardNavGroup {
  label?: string;
  items: DashboardNavItem[];
}

/**
 * Admin Portal Navigation Structure
 * Full institution-wide operational access
 */
export const ADMIN_NAV_GROUPS: readonly DashboardNavGroup[] = [
  {
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard/admin",
        icon: LayoutDashboard,
        exact: true,
      },
    ],
  },
  {
    label: "Academic Management",
    items: [
      {
        title: "Batches",
        href: "/dashboard/admin/batches",
        icon: Layers,
      },
      {
        title: "Class Routines",
        href: "/dashboard/admin/routines",
        icon: CalendarDays,
      },
      {
        title: "Attendance",
        href: "/dashboard/admin/attendance",
        icon: UserCheck,
      },
      {
        title: "Exams & Results",
        href: "/dashboard/admin/exams",
        icon: GraduationCap,
      },
    ],
  },
  {
    label: "Administration",
    items: [
      {
        title: "Students",
        href: "/dashboard/admin/students",
        icon: Users,
      },
      {
        title: "Faculty / Teachers",
        href: "/dashboard/admin/teachers",
        icon: ShieldCheck,
      },
      {
        title: "Fee & Payments",
        href: "/dashboard/admin/payments",
        icon: CreditCard,
      },
    ],
  },
  {
    label: "Settings",
    items: [
      {
        title: "Institution Settings",
        href: "/dashboard/admin/settings",
        icon: Settings,
      },
    ],
  },
] as const;

/**
 * Teacher Portal Navigation Structure
 * Focused on assigned classes, attendance marking, grading, and routines
 */
export const TEACHER_NAV_GROUPS: readonly DashboardNavGroup[] = [
  {
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard/teacher",
        icon: LayoutDashboard,
        exact: true,
      },
    ],
  },
  {
    label: "Academic",
    items: [
      {
        title: "My Batches",
        href: "/dashboard/teacher/batches",
        icon: Layers,
      },
      {
        title: "Class Routine",
        href: "/dashboard/teacher/routines",
        icon: CalendarDays,
        requiredPermission: "MANAGE_ROUTINES",
      },
      {
        title: "Attendance",
        href: "/dashboard/teacher/attendance",
        icon: UserCheck,
        requiredPermission: "MANAGE_ATTENDANCE",
      },
      {
        title: "Exams & Marks",
        href: "/dashboard/teacher/exams",
        icon: GraduationCap,
        requiredPermission: "MANAGE_EXAMS",
      },
    ],
  },
  {
    label: "Account",
    items: [
      {
        title: "Faculty Profile",
        href: "/dashboard/teacher/profile",
        icon: UserCircle,
      },
      {
        title: "Settings",
        href: "/dashboard/teacher/settings",
        icon: Settings,
      },
    ],
  },
] as const;
