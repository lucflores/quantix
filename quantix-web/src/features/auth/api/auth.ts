// src/features/auth/api/auth.ts
import { api } from "@/core/api/client";
import type { LoginDto, LoginResp } from "../types";

export const postLogin = async (dto: LoginDto) => {
  const { data } = await api.post<LoginResp>("/auth/login", dto);
  return data; // { token, user? }
};
