// src/hooks/useMemory.ts
import { useState, useCallback } from "react";
import { memoryService } from "@/services/memory.service";
import { UploadMemoryPayload } from "@/types/memory";

export function useMemory() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadMemory = useCallback(async (payload: UploadMemoryPayload, onSuccess?: () => void) => {
    setIsUploading(true);
    setError(null);
    try {
      await memoryService.uploadMemory(payload);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error("Lỗi upload kỷ niệm:", err);
      setError(err.message || "Đã xảy ra lỗi khi upload.");
    } finally {
      setIsUploading(false);
    }
  }, []);

  return {
    uploadMemory,
    isUploading,
    error,
  };
}