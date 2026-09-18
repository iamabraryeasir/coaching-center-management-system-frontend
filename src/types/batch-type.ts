export type BatchStatus = "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";

export type EnrollmentStatus = "PENDING" | "ENROLLED" | "APPROVED" | "REJECTED";

export interface BatchCount {
  enrollments?: number;
  routines?: number;
}

export interface Batch {
  id: string;
  name: string;
  fee: number;
  status: BatchStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  _count?: BatchCount;
  enrollmentCount?: number;
  routineCount?: number;
}

export interface BatchQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: BatchStatus | "ALL";
  fee_gte?: number;
  fee_lte?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CreateBatchDto {
  name: string;
  fee: number;
  status: BatchStatus;
}

export interface UpdateBatchDto {
  name?: string;
  fee?: number;
  status?: BatchStatus;
}

export interface DirectEnrollDto {
  studentId: string;
}

export interface BatchEnrollmentStudentProfile {
  rollNumber?: string;
  classLevel?: string;
  institutionName?: string;
  guardianName?: string;
  guardianPhone?: string;
}

export interface BatchEnrollmentUser {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  gender?: "MALE" | "FEMALE" | "OTHER" | null;
  studentProfile?: BatchEnrollmentStudentProfile | null;
}

export interface BatchEnrollment {
  id: string;
  batchId: string;
  studentId?: string;
  userId?: string;
  status: EnrollmentStatus;
  approvedAt?: string | null;
  enrolledAt?: string;
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt?: string;
  batch?: Batch;
  student?: BatchEnrollmentUser;
  user?: BatchEnrollmentUser;
}
