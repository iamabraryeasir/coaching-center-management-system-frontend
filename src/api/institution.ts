import apiClient from "@/lib/api-client";
import type {
  ApiResponse,
  InstitutionProfile,
  UpdateInstitutionDto,
} from "@/types";

/**
 * 1. Fetch public institution profile & live stats
 * GET /institution
 */
export async function getInstitutionProfile(): Promise<
  ApiResponse<InstitutionProfile>
> {
  return await apiClient<ApiResponse<InstitutionProfile>>("/institution", {
    method: "GET",
  });
}

/**
 * 2. Update institution branding, address & contact profile (Admin only)
 * PATCH /institution
 */
export async function updateInstitutionProfile(
  data: UpdateInstitutionDto,
): Promise<ApiResponse<InstitutionProfile>> {
  return await apiClient<ApiResponse<InstitutionProfile>>("/institution", {
    method: "PATCH",
    body: data,
  });
}
