import type { Gender, TeacherPermission, User, UserStatus } from "./auth-type";

export function getTeacherPermissions(
  user?: Partial<User> | null,
): TeacherPermission[] {
  if (!user) return [];
  if (
    Array.isArray(user.teacherPermissions) &&
    user.teacherPermissions.length > 0
  ) {
    return user.teacherPermissions;
  }
  if (Array.isArray(user.permissions)) {
    return user.permissions;
  }
  return [];
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
