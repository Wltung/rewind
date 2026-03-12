"use client";

import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

interface LoginGateProps {
  onSuccess: () => void; // Hàm gọi khi mở khóa thành công để chuyển sang cái bàn học
}

export default function LoginGate({ onSuccess }: LoginGateProps) {
  const [password, setPassword] = useState("");
  const [isFading, setIsFading] = useState(false);
  
  // Gọi trực tiếp custom hook thay vì tự fetch lỉnh kỉnh
  const { login, isLoading, error } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 4) return;

    // Truyền dữ liệu vào hàm login của hook
    const isSuccess = await login({ password });

    if (isSuccess) {
      // Nếu đăng nhập đúng, chạy hiệu ứng mờ dần
      setIsFading(true);
      setTimeout(() => {
        onSuccess();
      }, 1000); // Đợi 1s cho animation chạy xong rồi mới lật trang
    } else {
      // Đăng nhập sai thì xóa trắng ô nhập để gõ lại (lỗi đã được hook xử lý)
      setPassword("");
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#E6E6FA] transition-opacity duration-1000 ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Background mờ ảo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none blur-[80px] opacity-50">
        <div className="absolute top-[20%] left-[20%] w-[30vw] h-[30vw] rounded-full bg-[#FFD1DC] animate-pulse"></div>
        <div
          className="absolute bottom-[20%] right-[20%] w-[30vw] h-[30vw] rounded-full bg-[#B0E0E6] animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Khung nhập mật khẩu */}
      <div className="relative z-10 p-10 rounded-[30px] bg-white/30 backdrop-blur-md border border-white/40 shadow-xl text-center flex flex-col items-center max-w-sm w-full mx-4">
        <h1 className="font-['Lora'] text-2xl italic text-[#4A4A6A] mb-2 font-semibold">
          Class 12A5
        </h1>
        <p className="font-['Baloo_2'] text-sm text-[#4A4A6A]/80 mb-8">
          Nhập mã số bí mật để mở ngăn bàn
        </p>

        <form onSubmit={handleLogin} className="flex flex-col items-center w-full">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="****"
            maxLength={4}
            disabled={isLoading || isFading}
            className="bg-transparent border-b-2 border-[#4A4A6A]/40 font-mono text-4xl text-[#4A4A6A] text-center w-[120px] outline-none mb-6 tracking-[8px] placeholder:text-[#4A4A6A]/20 transition-all focus:border-[#4A4A6A] disabled:opacity-50"
          />

          <div className="h-6 mb-4">
            {error && (
              <p className="font-['Baloo_2'] text-sm text-red-400 animate-in fade-in slide-in-from-bottom-2">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || isFading || password.length < 4}
            className="px-6 py-2 rounded-full bg-[#4A4A6A] text-white font-['Baloo_2'] text-sm tracking-wide hover:bg-[#3a3a5a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {isLoading ? "Đang mở..." : "Mở cửa"}
          </button>
        </form>
      </div>
    </div>
  );
}