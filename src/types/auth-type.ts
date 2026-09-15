import type { ApiResponse } from "./api-type";

export type UserRole = "ADMIN" | "TEACHER" | "STUDENT";

export type UserStatus =
  | "ACTIVE"
  | "PENDING_ACTIVATION"
  | "INACTIVE"
  | "BLOCKED";

export type TeacherPermission =
  | "MANAGE_ATTENDANCE"
  | "MANAGE_EXAMS"
  | "MANAGE_ROUTINES";

export type Gender = "MALE" | "FEMALE" | "OTHER" | null;

export interface AdminProfile {
  id: string;
  institutionName: string;
  institutionAddress: string;
  institutionPhone: string;
  institutionEmail: string;
}

export interface TeacherProfile {
  id: string;
  designation: string;
  qualification: string;
  specialization: string;
  joiningDate: string;
}

export interface StudentProfile {
  id: string;
  guardianName: string;
  guardianPhone: string;
  institutionName: string;
  classLevel: string;
  rollNumber: string;
}

export interface InstitutionSummary {
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  gender?: Gender;
  avatarUrl?: string | null;
  status: UserStatus;
  createdAt: string;
  role: UserRole;
  adminProfile?: AdminProfile;
  teacherProfile?: TeacherProfile;
  studentProfile?: StudentProfile;
  permissions?: TeacherPermission[];
  institution?: InstitutionSummary;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginResponseData {
  user: User;
  tokens: AuthTokens;
}

export type LoginResponse = ApiResponse<LoginResponseData>;
