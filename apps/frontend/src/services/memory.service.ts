// src/services/memory.service.ts
import { http } from "@/lib/http";
import { Memory, UploadMemoryPayload } from "@/types/memory";

const BACKEND_DOMAIN = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || "http://127.0.0.1:9001";

export const memoryService = {
  // 1. Lấy tất cả ảnh (Dành cho Cuốn Album)
  getAllMemories: async (): Promise<Memory[]> => {
    const response: any = await http.get("/memories");
    const memories: Memory[] = response.data || [];
    
    // Gắn domain backend vào ảnh để không bị 404
    return memories.map(m => {
      if (m.image_url && m.image_url.startsWith("/images")) {
        return { ...m, image_url: `${BACKEND_DOMAIN}${m.image_url}` };
      }
      return m;
    });
  },

  // 2. Bốc thăm 1 ảnh ngẫu nhiên (Có loại trừ ảnh đang xem)
  getRandomMemory: async (excludeId?: number): Promise<Memory> => {
    const endpoint = excludeId ? `/memories/random?exclude_id=${excludeId}` : "/memories/random";
    const response: any = await http.get(endpoint);
    const m: Memory = response.data;
    if (m && m.image_url && m.image_url.startsWith("/images")) {
      m.image_url = `${BACKEND_DOMAIN}${m.image_url}`;
    }
    return m;
  },

  // 3. Upload Kỷ niệm mới (Admin)
  uploadMemory: async (payload: UploadMemoryPayload): Promise<Memory> => {
    const formData = new FormData();
    formData.append("caption", payload.caption);
    formData.append("secret_message", payload.secretMessage);
    formData.append("memory_date", payload.memoryDate);
    
    // Nếu có file ảnh thì mới append
    if (payload.imageFile) {
      formData.append("image_file", payload.imageFile);
    }

    const response: any = await http.post("/memories/upload", formData);
    return response.data;
  }
};