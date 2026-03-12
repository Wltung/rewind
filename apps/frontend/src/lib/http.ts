// apps/frontend/lib/http.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export const http = {
  async get<T>(endpoint: string): Promise<T> {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // ⚡ Bắt buộc để gửi kèm HTTP-Only Cookie
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || "Có lỗi xảy ra khi tải dữ liệu");
    }
    return res.json();
  },

  async post<T>(endpoint: string, body: any): Promise<T> {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || "Có lỗi xảy ra khi gửi dữ liệu");
    }
    return res.json();
  },
};