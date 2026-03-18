// src/hooks/useSong.ts
import { useState, useCallback } from "react";
import { songService } from "@/services/song.service";
import { UploadSongPayload } from "@/types/song";

export function useSong() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadSong = useCallback(async (payload: UploadSongPayload, onSuccess?: () => void) => {
    setIsUploading(true);
    setError(null);
    try {
      await songService.uploadSong(payload);
      if (onSuccess) onSuccess();
      // Tuỳ chọn: Bạn có thể thêm logic refetch playlist ở đây để cập nhật list mới
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.response?.data?.error || err.message || "Đã xảy ra lỗi khi upload.");
    } finally {
      setIsUploading(false);
    }
  }, []);

  return {
    uploadSong,
    isUploading,
    error,
  };
}