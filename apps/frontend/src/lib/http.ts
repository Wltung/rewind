// apps/frontend/lib/http.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080/api";

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
    const isFormData = body instanceof FormData;

    const headers: HeadersInit = {};
    // Chỉ ép kiểu JSON nếu không phải là FormData
    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers, // Truyền headers đã xử lý linh hoạt
      credentials: "include",
      // Không stringify nếu là FormData để giữ nguyên vẹn file
      body: isFormData ? body : JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || "Có lỗi xảy ra khi gửi dữ liệu");
    }
    return res.json();
  },

  // Thêm hàm này ngay dưới hàm post hiện tại
  async put<T>(endpoint: string, body: any): Promise<T> {
    const isFormData = body instanceof FormData;

    const headers: HeadersInit = {};
    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "PUT", // ĐỔI THÀNH PUT Ở ĐÂY
      headers,
      credentials: "include",
      body: isFormData ? body : JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || "Có lỗi xảy ra khi cập nhật dữ liệu");
    }
    return res.json();
  },
};