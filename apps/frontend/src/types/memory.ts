// src/types/memory.ts

export interface Memory {
    id: number;
    image_url: string; // Chuỗi rỗng "" nghĩa là Tờ Note Vàng
    caption: string;   // Mặt trước
    secret_message?: string; // Mặt sau (chỉ lật mới thấy)
    memory_date: string; // Ngày tháng kỷ niệm
    created_at?: string;
  }
  
  export interface UploadMemoryPayload {
    imageFile: File | null; // Có thể null nếu chỉ viết Note
    caption: string;
    secretMessage: string;
    memoryDate: string; // Format: YYYY-MM-DD
  }