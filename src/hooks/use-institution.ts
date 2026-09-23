import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getInstitutionProfile, updateInstitutionProfile } from "@/api";
import { institutionKeys } from "@/constants/query-keys";
import type {
  ApiResponse,
  InstitutionProfile,
  UpdateInstitutionDto,
} from "@/types";

/**
 * Hook to retrieve institution profile & live stats
 * GET /institution
 */
export function useInstitutionProfile() {
  return useQuery<ApiResponse<InstitutionProfile>>({
    queryKey: institutionKeys.profile(),
    queryFn: getInstitutionProfile,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to update institution profile (Admin only)
 * PATCH /institution
 */
export function useUpdateInstitutionMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<InstitutionProfile>,
    Error,
    UpdateInstitutionDto
  >({
    mutationFn: updateInstitutionProfile,
    onSuccess: (response) => {
      // Invalidate and update the cached institution profile
      queryClient.setQueryData(institutionKeys.profile(), response);
      queryClient.invalidateQueries({ queryKey: institutionKeys.profile() });
    },
  });
}
