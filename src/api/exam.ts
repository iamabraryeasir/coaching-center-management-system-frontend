import apiClient from "@/lib/api-client";
import type {
  ApiResponse,
  BatchMeritList,
  BulkMarksEntryDto,
  CreateExamDto,
  Exam,
  ExamMarkRecord,
  ExamQueryParams,
  StudentExamResultItem,
  StudentReportCard,
  UpdateExamDto,
  UpdateStudentMarkDto,
} from "@/types";

/**
 * 1. Get Exams List (Paginated & Filtered)
 */
export async function getExams(
  params?: ExamQueryParams,
): Promise<ApiResponse<Exam[]>> {
  const query: Record<string, string | number> = {};
  if (params?.batchId) query.batchId = params.batchId;
  if (params?.status) query.status = params.status;
  if (params?.search) query.search = params.search;
  if (params?.page) query.page = params.page;
  if (params?.limit) query.limit = params.limit;
  if (params?.sortBy) query.sortBy = params.sortBy;
  if (params?.sortOrder) query.sortOrder = params.sortOrder;

  return await apiClient<ApiResponse<Exam[]>>("/exams", {
    method: "GET",
    query,
  });
}

/**
 * 2. Get Single Exam Details
 */
export async function getExamById(examId: string): Promise<ApiResponse<Exam>> {
  return await apiClient<ApiResponse<Exam>>(`/exams/${examId}`, {
    method: "GET",
  });
}

/**
 * 3. Create a New Exam (Admin or Authorized Teacher)
 */
export async function createExam(
  payload: CreateExamDto,
): Promise<ApiResponse<Exam>> {
  return await apiClient<ApiResponse<Exam>>("/exams", {
    method: "POST",
    body: payload,
  });
}

/**
 * 4. Update Exam Metadata (Admin or Authorized Teacher)
 */
export async function updateExam(
  examId: string,
  payload: UpdateExamDto,
): Promise<ApiResponse<Exam>> {
  return await apiClient<ApiResponse<Exam>>(`/exams/${examId}`, {
    method: "PATCH",
    body: payload,
  });
}

/**
 * 5. Delete Exam (Admin or Authorized Teacher)
 */
export async function deleteExam(
  examId: string,
): Promise<ApiResponse<{ id: string; message?: string }>> {
  return await apiClient<ApiResponse<{ id: string; message?: string }>>(
    `/exams/${examId}`,
    {
      method: "DELETE",
    },
  );
}

/**
 * 6. Bulk Marks Entry (Admin or Authorized Teacher)
 */
export async function bulkSubmitMarks(
  examId: string,
  payload: BulkMarksEntryDto,
): Promise<ApiResponse<ExamMarkRecord[]>> {
  return await apiClient<ApiResponse<ExamMarkRecord[]>>(
    `/exams/${examId}/marks`,
    {
      method: "POST",
      body: payload,
    },
  );
}

/**
 * 7. Update Single Student Mark (Admin or Authorized Teacher)
 */
export async function updateStudentMark(
  examId: string,
  targetUserId: string,
  payload: UpdateStudentMarkDto,
): Promise<ApiResponse<ExamMarkRecord>> {
  return await apiClient<ApiResponse<ExamMarkRecord>>(
    `/exams/${examId}/marks/${targetUserId}`,
    {
      method: "PATCH",
      body: payload,
    },
  );
}

/**
 * 8. Publish Exam Results (Admin or Authorized Teacher)
 */
export async function publishExamResults(
  examId: string,
): Promise<ApiResponse<Exam>> {
  return await apiClient<ApiResponse<Exam>>(`/exams/${examId}/publish`, {
    method: "PATCH",
  });
}

/**
 * 9. Unpublish Exam Results (Admin Only)
 */
export async function unpublishExamResults(
  examId: string,
): Promise<ApiResponse<Exam>> {
  return await apiClient<ApiResponse<Exam>>(`/exams/${examId}/unpublish`, {
    method: "PATCH",
  });
}

/**
 * 10. Get Batch Exam Results / Merit List (All Roles)
 */
export async function getBatchExamResults(
  examId: string,
): Promise<ApiResponse<BatchMeritList>> {
  return await apiClient<ApiResponse<BatchMeritList>>(
    `/exams/${examId}/results`,
    {
      method: "GET",
    },
  );
}

/**
 * 11. Get Authenticated Student Report Card (All published exams)
 */
export async function getMyExamResults(): Promise<
  ApiResponse<StudentReportCard>
> {
  return await apiClient<ApiResponse<StudentReportCard>>("/exams/my/results", {
    method: "GET",
  });
}

/**
 * 12. Get Authenticated Student Single Exam Result
 */
export async function getMySingleExamResult(
  examId: string,
): Promise<ApiResponse<StudentExamResultItem>> {
  return await apiClient<ApiResponse<StudentExamResultItem>>(
    `/exams/my/results/${examId}`,
    {
      method: "GET",
    },
  );
}

/**
 * 13. Get Report Card PDF Download URL
 */
export function getReportCardPdfUrl(
  examId: string,
  studentId: string,
  download = false,
): string {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
  return `${baseUrl}/exams/${examId}/students/${studentId}/report-card/pdf?download=${download}`;
}

/**
 * 14. Dispatch Student Report Card PDF via Email (Admin & Teacher)
 */
export async function sendReportCardEmail(
  examId: string,
  studentId: string,
): Promise<ApiResponse<{ message: string }>> {
  return await apiClient<ApiResponse<{ message: string }>>(
    `/exams/${examId}/students/${studentId}/send-report-card`,
    {
      method: "POST",
    },
  );
}
