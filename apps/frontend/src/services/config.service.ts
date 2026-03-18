import { http } from "@/lib/http";
import { DeskNote } from "@/types/config";

export const configService = {
  // Lấy và parse tờ note
  async getDeskNote(): Promise<DeskNote | null> {
    try {
      const res = await http.get<{ data: string }>("/configs/desk_note");
      if (res.data) {
        return JSON.parse(res.data) as DeskNote;
      }
      return null;
    } catch (error) {
      console.error("Lỗi khi lấy config:", error);
      return null;
    }
  },

  // Lưu note mới (truyền null để xóa)
  async setDeskNote(note: DeskNote | null): Promise<void> {
    const formData = new FormData();
    formData.append("value", note ? JSON.stringify(note) : "");
    await http.post("/configs/desk_note", formData);
  },
};