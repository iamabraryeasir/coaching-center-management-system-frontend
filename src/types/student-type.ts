import type { Gender, UserStatus } from "./auth-type";

export interface StudentQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: UserStatus | "ALL";
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  role?: "STUDENT";
}

export interface RegisterStudentDto {
  name: string;
  email: string;
  password?: string;
  phone: string;
  guardianName: string;
  guardianPhone: string;
  institutionName: string;
  classLevel: string;
  rollNumber: string;
  gender: NonNullable<Gender>;
}

export interface PendingStudent {
  id: string;
  name: string;
  email: string;
  phone: string;
  guardianName: string;
  guardianPhone: string;
  institutionName: string;
  classLevel: string;
  rollNumber: string;
  gender?: Gender;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt: string;
}
