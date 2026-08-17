export interface NotebookData {
  id?: number;
  title: string;
  body_text: string;
  footer_text: string;
  icon_name: string;
}

export interface NotebookResponse {
  message?: string;
  data?: NotebookData;
}