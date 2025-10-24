import { api } from "../../../core/api/client";
import type { LoginPayload, LoginResponse } from "../types";

// POST /api/v1/auth/login
export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/auth/login", payload);
  return data;
}


