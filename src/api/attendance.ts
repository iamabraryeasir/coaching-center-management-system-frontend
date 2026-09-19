import apiClient from "@/lib/api-client";
import type {
  ApiResponse,
  AttendanceRecord,
  BatchAttendanceSheetData,
  BulkStudentAttendanceDto,
  BulkTeacherAttendanceDto,
  StudentAttendanceSummary,
  TeacherAttendanceRecord,
  TeacherAttendanceSummary,
  TeacherCheckInDto,
  UpdateAttendanceDto,
  UpdateTeacherAttendanceDto,
} from "@/types";

/**
 * 1. Mark Bulk Daily Attendance for Students in a Batch
 */
export async function markBatchAttendance(
  batchId: string,
  payload: BulkStudentAttendanceDto,
): Promise<ApiResponse<BatchAttendanceSheetData>> {
  return await apiClient<ApiResponse<BatchAttendanceSheetData>>(
    `/attendance/batches/${batchId}`,
    {
      method: "POST",
      body: payload,
    },
  );
}

/**
 * 2. Get Batch Attendance Sheet for a selected date
 */
export async function getBatchAttendanceSheet(
  batchId: string,
  date?: string,
): Promise<ApiResponse<BatchAttendanceSheetData>> {
  const query: Record<string, string> = {};
  if (date) query.date = date;

  return await apiClient<ApiResponse<BatchAttendanceSheetData>>(
    `/attendance/batches/${batchId}`,
    {
      method: "GET",
      query,
    },
  );
}

/**
 * 3. Update Single Student Attendance Record
 */
export async function updateAttendanceRecord(
  attendanceId: string,
  payload: UpdateAttendanceDto,
): Promise<ApiResponse<AttendanceRecord>> {
  return await apiClient<ApiResponse<AttendanceRecord>>(
    `/attendance/${attendanceId}`,
    {
      method: "PATCH",
      body: payload,
    },
  );
}

/**
 * 4. Get Student Individual Attendance History & Statistics
 */
export async function getStudentAttendanceHistory(
  studentUserId: string,
  params?: { page?: number; limit?: number },
): Promise<ApiResponse<StudentAttendanceSummary>> {
  const query: Record<string, number> = {};
  if (params?.page) query.page = params.page;
  if (params?.limit) query.limit = params.limit;

  return await apiClient<ApiResponse<StudentAttendanceSummary>>(
    `/attendance/students/${studentUserId}`,
    {
      method: "GET",
      query,
    },
  );
}

/**
 * 5. Get Authenticated Student Attendance Summary
 */
export async function getMyStudentAttendanceSummary(params?: {
  page?: number;
  limit?: number;
}): Promise<ApiResponse<StudentAttendanceSummary>> {
  const query: Record<string, number> = {};
  if (params?.page) query.page = params.page;
  if (params?.limit) query.limit = params.limit;

  return await apiClient<ApiResponse<StudentAttendanceSummary>>(
    "/attendance/my/summary",
    {
      method: "GET",
      query,
    },
  );
}

/**
 * 6. Teacher Self Check-In
 */
export async function teacherSelfCheckIn(
  payload?: TeacherCheckInDto,
): Promise<ApiResponse<TeacherAttendanceRecord>> {
  return await apiClient<ApiResponse<TeacherAttendanceRecord>>(
    "/attendance/teachers/check-in",
    {
      method: "POST",
      body: payload || {},
    },
  );
}

/**
 * 7. Get Authenticated Teacher Attendance Summary
 */
export async function getMyTeacherAttendanceSummary(params?: {
  page?: number;
  limit?: number;
}): Promise<ApiResponse<TeacherAttendanceSummary>> {
  const query: Record<string, number> = {};
  if (params?.page) query.page = params.page;
  if (params?.limit) query.limit = params.limit;

  return await apiClient<ApiResponse<TeacherAttendanceSummary>>(
    "/attendance/teachers/my/summary",
    {
      method: "GET",
      query,
    },
  );
}

/**
 * 8. Mark Bulk Teacher Attendance (Admin)
 */
export async function markBulkTeacherAttendance(
  payload: BulkTeacherAttendanceDto,
): Promise<ApiResponse<TeacherAttendanceRecord[]>> {
  return await apiClient<ApiResponse<TeacherAttendanceRecord[]>>(
    "/attendance/teachers/bulk",
    {
      method: "POST",
      body: payload,
    },
  );
}

/**
 * 9. Get Teacher Attendance Sheet for a selected date
 */
export async function getTeacherAttendanceSheet(
  date?: string,
  params?: { page?: number; limit?: number },
): Promise<ApiResponse<{ date: string; records: TeacherAttendanceRecord[] }>> {
  const query: Record<string, string | number> = {};
  if (date) query.date = date;
  if (params?.page) query.page = params.page;
  if (params?.limit) query.limit = params.limit;

  return await apiClient<
    ApiResponse<{ date: string; records: TeacherAttendanceRecord[] }>
  >("/attendance/teachers", {
    method: "GET",
    query,
  });
}

/**
 * 10. Get Specific Teacher Attendance Summary (Admin)
 */
export async function getTeacherAttendanceSummary(
  teacherUserId: string,
  params?: { page?: number; limit?: number },
): Promise<ApiResponse<TeacherAttendanceSummary>> {
  const query: Record<string, number> = {};
  if (params?.page) query.page = params.page;
  if (params?.limit) query.limit = params.limit;

  return await apiClient<ApiResponse<TeacherAttendanceSummary>>(
    `/attendance/teachers/${teacherUserId}/summary`,
    {
      method: "GET",
      query,
    },
  );
}

/**
 * 11. Update Single Teacher Attendance Record
 */
export async function updateTeacherAttendanceRecord(
  teacherAttendanceId: string,
  payload: UpdateTeacherAttendanceDto,
): Promise<ApiResponse<TeacherAttendanceRecord>> {
  return await apiClient<ApiResponse<TeacherAttendanceRecord>>(
    `/attendance/teachers/${teacherAttendanceId}`,
    {
      method: "PATCH",
      body: payload,
    },
  );
}
