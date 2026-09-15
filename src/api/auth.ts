import apiClient from "@/lib/api-client";
import type { LoginResponse } from "@/types";
import type { LoginInput } from "@/validators";

export async function loginUser(data: LoginInput): Promise<LoginResponse> {
  return await apiClient<LoginResponse>("/auth/login", {
    method: "POST",
    body: data,
  });
}
