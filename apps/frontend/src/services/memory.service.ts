import { http } from "@/lib/http";
import { Memory, UploadMemoryPayload } from "@/types/memory";

// Trỏ thẳng domain Render cho các file tĩnh (ảnh, nhạc)
const ASSET_DOMAIN = "https://rewind-api-2muu.onrender.com";

const getFullUrl = (url?: string) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  const cleanPath = url.startsWith("/") ? url : `/${url}`;
  return `${ASSET_DOMAIN}${cleanPath}`;
};

export const memoryService = {
  // 1. Lấy tất cả ảnh (Dành cho Cuốn Album)
  getAllMemories: async (): Promise<Memory[]> => {
    const response: any = await http.get("/memories");
    const memories: Memory[] = response.data || [];
    
    // Gắn domain backend vào ảnh tự động
    return memories.map(m => ({ ...m, image_url: getFullUrl(m.image_url) }));
  },

  // 2. Bốc thăm 1 ảnh ngẫu nhiên
  getRandomMemory: async (excludeId?: number): Promise<Memory> => {
    const endpoint = excludeId ? `/memories/random?exclude_id=${excludeId}` : "/memories/random";
    const response: any = await http.get(endpoint);
    const m: Memory = response.data;
    if (m) m.image_url = getFullUrl(m.image_url);
    return m;
  },

  // 3. Upload Kỷ niệm mới (Admin)
  uploadMemory: async (payload: UploadMemoryPayload): Promise<Memory> => {
    const formData = new FormData();
    formData.append("caption", payload.caption);
    formData.append("secret_message", payload.secretMessage);
    formData.append("memory_date", payload.memoryDate);
    
    if (payload.imageFile) {
      formData.append("image_file", payload.imageFile);
    }

    const response: any = await http.post("/memories/upload", formData);
    const m: Memory = response.data;
    if (m) m.image_url = getFullUrl(m.image_url);
    return m;
  }
};