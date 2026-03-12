// src/hooks/useAuth.ts
import { useState } from 'react';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/useAuthStore';
import { LoginRequest } from '@/types/auth';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Lấy hàm cập nhật trạng thái từ Zustand
  const setAuth = useAuthStore((state) => state.setAuth);

  const login = async (data: LoginRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.login(data);
      setAuth(true); // Đánh dấu đã đăng nhập thành công
      return true;
    } catch (err: any) {
      setError(err.message || 'Cánh cửa đang kẹt, thử lại sau nhé...');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const checkAuth = async () => {
    try {
      await authService.checkAuth();
      setAuth(true);
      return true;
    } catch (err) {
      setAuth(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setAuth(false);
    } catch (err) {
      console.error("Lỗi khi đăng xuất", err);
    }
  };

  return { login, checkAuth, logout, isLoading, error };
};