import { http } from "@/lib/http";
import { Polaroid } from "@/types/polaroid";

const ASSET_DOMAIN = "https://rewind-api-2muu.onrender.com";

const getFullUrl = (url?: string) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  const cleanPath = url.startsWith("/") ? url : `/${url}`;
  return `${ASSET_DOMAIN}${cleanPath}`;
};

export const polaroidService = {
  // Lấy ảnh ngẫu nhiên
  async getRandomPolaroid(excludeId?: number): Promise<Polaroid> {
    const query = excludeId ? `?excludeId=${excludeId}` : "";
    const res = await http.get<{ data: Polaroid }>(`/polaroids/random${query}`);
    const p = res.data;
    if (p) p.image_url = getFullUrl(p.image_url);
    return p;
  },

  // (Admin) Upload ảnh mới lên kho Gacha
  async uploadPolaroid(data: { image: File; caption: string; secret_message: string }): Promise<Polaroid> {
    const formData = new FormData();
    formData.append("image", data.image);
    formData.append("caption", data.caption);
    formData.append("secret_message", data.secret_message);

    const res = await http.post<{ data: Polaroid }>("/polaroids/upload", formData);
    const p = res.data;
    if (p) p.image_url = getFullUrl(p.image_url);
    return p;
  }
};