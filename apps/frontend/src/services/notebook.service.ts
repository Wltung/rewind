import { http } from "@/lib/http";
import { NotebookData, NotebookResponse } from "@/types/notebook";

export const notebookService = {
  getNotebook: async (): Promise<NotebookData> => {
    return http.get<NotebookData>("/notebook");
  },

  updateNotebook: async (data: NotebookData): Promise<NotebookData> => {
    // Gọi đến API PUT /notebook ở Go Backend
    const res = await http.post<NotebookResponse>("/notebook", data); 
    return res.data || data; 
  }
};