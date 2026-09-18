import apiClient from "@/lib/api-client";
import type {
  ApiResponse,
  BatchTimetableData,
  CreateRoutineSlotDto,
  PaginatedResponse,
  RoutineQueryParams,
  RoutineSlot,
  StudentScheduleData,
  TeacherScheduleData,
  UpdateRoutineSlotDto,
} from "@/types";

/**
 * Fetch all routine slots with QueryBuilder filters
 */
export async function getRoutines(
  params?: RoutineQueryParams,
): Promise<PaginatedResponse<RoutineSlot>> {
  return await apiClient<PaginatedResponse<RoutineSlot>>("/routines", {
    method: "GET",
    params,
  });
}

/**
 * Fetch a single routine slot by ID
 */
export async function getRoutineById(
  routineId: string,
): Promise<ApiResponse<RoutineSlot>> {
  return await apiClient<ApiResponse<RoutineSlot>>(`/routines/${routineId}`, {
    method: "GET",
  });
}

/**
 * Fetch complete weekly timetable for a specific batch (grouped SATURDAY through FRIDAY)
 */
export async function getBatchTimetable(
  batchId: string,
): Promise<ApiResponse<BatchTimetableData>> {
  return await apiClient<ApiResponse<BatchTimetableData>>(
    `/routines/batch/${batchId}`,
    {
      method: "GET",
    },
  );
}

/**
 * Fetch complete weekly teaching schedule for a specific teacher
 */
export async function getTeacherSchedule(
  teacherUserId: string,
): Promise<ApiResponse<TeacherScheduleData>> {
  return await apiClient<ApiResponse<TeacherScheduleData>>(
    `/routines/teacher/${teacherUserId}`,
    {
      method: "GET",
    },
  );
}

/**
 * Fetch personal weekly teaching schedule for authenticated teacher
 */
export async function getMyTeacherSchedule(): Promise<
  ApiResponse<TeacherScheduleData>
> {
  return await apiClient<ApiResponse<TeacherScheduleData>>(
    "/routines/my/teacher-schedule",
    {
      method: "GET",
    },
  );
}

/**
 * Fetch personal weekly class timetable for authenticated student
 */
export async function getMyStudentSchedule(): Promise<
  ApiResponse<StudentScheduleData>
> {
  return await apiClient<ApiResponse<StudentScheduleData>>(
    "/routines/my/student-schedule",
    {
      method: "GET",
    },
  );
}

/**
 * Create a new routine slot with room, teacher, and batch conflict validation
 */
export async function createRoutineSlot(
  payload: CreateRoutineSlotDto,
): Promise<ApiResponse<RoutineSlot>> {
  return await apiClient<ApiResponse<RoutineSlot>>("/routines", {
    method: "POST",
    body: payload,
  });
}

/**
 * Update an existing routine slot
 */
export async function updateRoutineSlot(
  routineId: string,
  payload: UpdateRoutineSlotDto,
): Promise<ApiResponse<RoutineSlot>> {
  return await apiClient<ApiResponse<RoutineSlot>>(`/routines/${routineId}`, {
    method: "PATCH",
    body: payload,
  });
}

/**
 * Delete a routine slot and release room / teacher assignments
 */
export async function deleteRoutineSlot(
  routineId: string,
): Promise<ApiResponse<{ routineId: string }>> {
  return await apiClient<ApiResponse<{ routineId: string }>>(
    `/routines/${routineId}`,
    {
      method: "DELETE",
    },
  );
}

/**
 * Build URL to download or preview the official batch routine PDF
 */
export function getBatchRoutinePdfUrl(
  batchId: string,
  download = false,
): string {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
  return `${baseUrl}/routines/batches/${batchId}/pdf?download=${download}`;
}
