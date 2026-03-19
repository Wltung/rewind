import { useState } from "react";
import { polaroidService } from "@/services/polaroid.service";
import { Polaroid } from "@/types/polaroid";

export const usePolaroid = () => {
  const [error, setError] = useState<string | null>(null);

  // Không cần state isLoading ở đây vì Component PolaroidGacha 
  // đã có sẵn hiệu ứng Loading giả lập (Delay 1.2s) cực xịn rồi.

  const getRandomPolaroid = async (excludeId?: number): Promise<Polaroid | null> => {
    setError(null);
    try {
      const data = await polaroidService.getRandomPolaroid(excludeId);
      return data;
    } catch (err: any) {
      setError(err.message || "Lỗi khi rút ảnh");
      return null;
    }
  };

  return { getRandomPolaroid, error };
};