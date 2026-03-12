"use client";

import { useRouter } from "next/navigation";
import LoginGate from "@/components/auth/LoginGate";

export default function LoginPage() {
  const router = useRouter();

  const handleLoginSuccess = () => {
    // Chuyển hướng về trang chủ sau khi nhập đúng pass và chạy xong animation lùi mờ
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-[#E6E6FA] relative overflow-hidden">
      {/* Gọi component LoginGate và truyền hàm xử lý khi thành công vào */}
      <LoginGate onSuccess={handleLoginSuccess} />
    </main>
  );
}