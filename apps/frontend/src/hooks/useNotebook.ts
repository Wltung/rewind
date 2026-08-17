import { useState, useEffect, useRef } from "react";
import { notebookService } from "@/services/notebook.service";
import NOTEBOOK_ICONS from "@/assets/material_symbol_icons.json";

export function useNotebook() {
  const [title, setTitle] = useState("Hello");
  const [bodyText, setBodyText] = useState("try\nagain!");
  const [footerText, setFooterText] = useState("- Let's song 🎧");
  const [iconName, setIconName] = useState(NOTEBOOK_ICONS[0].id);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const isInitialLoad = useRef(true);

  // LẤY DỮ LIỆU LẦN ĐẦU (Không cần chặn bằng isAuthenticated nữa)
  useEffect(() => {
    const fetchNotebook = async () => {
      try {
        setIsLoading(true);
        const data = await notebookService.getNotebook();
        if (data) {
          setTitle(data.title || "Hello");
          setBodyText(data.body_text || "try\nagain!");
          setFooterText(data.footer_text || "- Let's song 🎧");
          setIconName(data.icon_name || NOTEBOOK_ICONS[0].id);
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu sổ, dùng mặc định:", error);
        // Fallback về mặc định nếu chưa đăng nhập hoặc lỗi mạng
        setTitle("Hello");
        setBodyText("try\nagain!");
        setFooterText("- Let's song 🎧");
        setIconName(NOTEBOOK_ICONS[0].id);
      } finally {
        setIsLoading(false); // Chắc chắn sẽ được set false để tắt chữ "Đang tải..."
      }
    };

    fetchNotebook();
  }, []);

  // TỰ ĐỘNG LƯU VỚI DEBOUNCE (1.5 GIÂY)
  useEffect(() => {
    // Không lưu khi đang tải dữ liệu ban đầu
    if (isLoading) return;

    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    setIsSaving(true);
    const handler = setTimeout(async () => {
      try {
        await notebookService.updateNotebook({
          title,
          body_text: bodyText,
          footer_text: footerText,
          icon_name: iconName,
        });
      } catch (error) {
        console.error("Lỗi tự động lưu:", error);
      } finally {
        setIsSaving(false);
      }
    }, 1500);

    return () => clearTimeout(handler);
  }, [title, bodyText, footerText, iconName, isLoading]);

  return {
    title, setTitle,
    bodyText, setBodyText,
    footerText, setFooterText,
    iconName, setIconName,
    isLoading,
    isSaving,
  };
}