import type { Gender, TeacherPermission, User, UserStatus } from "./auth-type";

export function getTeacherPermissions(
  user?: Partial<User> | Record<string, unknown> | null,
): TeacherPermission[] {
  if (!user || typeof user !== "object") return [];

  const u = user as Record<string, unknown>;
  const tp =
    u.teacherProfile && typeof u.teacherProfile === "object"
      ? (u.teacherProfile as Record<string, unknown>)
      : null;

  const candidateLists: unknown[] = [
    u.permissions,
    u.teacherPermissions,
    u.userPermissions,
    tp?.permissions,
    tp?.teacherPermissions,
    (u.profile as Record<string, unknown>)?.permissions,
    (u.profile as Record<string, unknown>)?.teacherPermissions,
  ];

  const result = new Set<TeacherPermission>();

  const processItem = (item: unknown) => {
    if (!item) return;

    if (typeof item === "string") {
      const trimmed = item.trim();
      if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
        try {
          const parsed = JSON.parse(trimmed);
          if (Array.isArray(parsed)) {
            for (const p of parsed) processItem(p);
            return;
          }
        } catch {
          // ignore parsing error
        }
      }

      if (trimmed.includes(",")) {
        for (const part of trimmed.split(",")) {
          processItem(part.trim());
        }
        return;
      }

      const normalized = trimmed.toUpperCase().replace(/[\s-]+/g, "_");
      if (
        normalized === "MANAGE_ATTENDANCE" ||
        normalized === "ATTENDANCE" ||
        normalized === "MANAGE_ATTENDANCES"
      ) {
        result.add("MANAGE_ATTENDANCE");
      } else if (
        normalized === "MANAGE_EXAMS" ||
        normalized === "EXAMS" ||
        normalized === "MANAGE_EXAM" ||
        normalized === "EXAM_MANAGEMENT"
      ) {
        result.add("MANAGE_EXAMS");
      } else if (
        normalized === "MANAGE_ROUTINES" ||
        normalized === "ROUTINES" ||
        normalized === "MANAGE_ROUTINE" ||
        normalized === "ROUTINE_MANAGEMENT"
      ) {
        result.add("MANAGE_ROUTINES");
      } else if (
        normalized === "ALL" ||
        normalized === "*" ||
        normalized === "MANAGE_ALL"
      ) {
        result.add("MANAGE_ATTENDANCE");
        result.add("MANAGE_EXAMS");
        result.add("MANAGE_ROUTINES");
      }
    } else if (typeof item === "object") {
      const obj = item as Record<string, unknown>;
      const val =
        obj.permission ||
        obj.name ||
        obj.code ||
        obj.permissionType ||
        obj.permissionName ||
        obj.value ||
        obj.id;
      if (val) {
        processItem(val);
      }
    }
  };

  for (const c of candidateLists) {
    if (!c) continue;
    if (Array.isArray(c)) {
      for (const item of c) processItem(item);
    } else {
      processItem(c);
    }
  }

  return Array.from(result);
}

export interface TeacherQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: UserStatus | "ALL";
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  role?: "TEACHER";
}

export interface RegisterTeacherDto {
  name: string;
  email: string;
  password?: string;
  phone: string;
  designation: string;
  qualification: string;
  specialization: string;
  joiningDate: string;
  permissions?: TeacherPermission[];
  gender: NonNullable<Gender>;
}

export interface UpdateTeacherPermissionsDto {
  permissions: TeacherPermission[];
}

export interface UpdateTeacherStatusDto {
  status: UserStatus;
}

export interface UpdateTeacherDto {
  name?: string;
  email?: string;
  phone?: string;
  gender?: Gender;
  designation?: string;
  qualification?: string;
  specialization?: string;
  joiningDate?: string;
}
