import { http } from "@/lib/http";
import { Polaroid } from "@/types/polaroid";

export const polaroidService = {
  // Lấy ảnh ngẫu nhiên (Có hỗ trợ excludeId để không bốc trùng)
  async getRandomPolaroid(excludeId?: number): Promise<Polaroid> {
    const query = excludeId ? `?excludeId=${excludeId}` : "";
    const res = await http.get<{ data: Polaroid }>(`/polaroids/random${query}`);
    return res.data;
  },

  // (Admin) Upload ảnh mới lên kho Gacha
  async uploadPolaroid(data: { image: File; caption: string; secret_message: string }): Promise<Polaroid> {
    const formData = new FormData();
    formData.append("image", data.image);
    formData.append("caption", data.caption);
    formData.append("secret_message", data.secret_message);

    const res = await http.post<{ data: Polaroid }>("/polaroids/upload", formData);
    return res.data;
  }
};