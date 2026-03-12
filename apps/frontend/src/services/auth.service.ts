// apps/frontend/services/auth.service.ts
import { http } from "@/lib/http";
import { LoginRequest, LoginResponse } from "src/types/auth"; // Bạn tự tạo type tương ứng nhé

export const authService = {
  login: async (data: LoginRequest) => {
    return http.post<LoginResponse>("/auth/login", data);
  },

  checkAuth: async () => {
    return http.get<{ message: string }>("/auth/check");
  },

  logout: async () => {
    return http.post<{ message: string }>("/auth/logout", {});
  },
};