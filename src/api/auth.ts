import apiClient from "@/lib/api-client";
import type { LoginInput } from "@/validators";

export interface LoginResponse {
  success?: boolean;
  message?: string;
  data?: {
    token?: string;
    user?: {
      id: string;
      email: string;
      role?: string;
      name?: string;
    };
  };
  [key: string]: unknown;
}

export async function loginUser(data: LoginInput): Promise<LoginResponse> {
  return await apiClient<LoginResponse>("/auth/login", {
    method: "POST",
    body: data,
  });
}
