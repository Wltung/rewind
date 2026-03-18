"use client";

import { useRouter } from "next/navigation";
import LoginGate from "@/components/auth/LoginGate";

export default function LoginPage() {
  const router = useRouter();

  const handleLoginSuccess = () => {
    router.push("/?from=login");
  };

  return (
    // Đổi bg-[#E6E6FA] thành bg-[#2C3A31]
    <main className="min-h-screen bg-[#2C3A31] relative overflow-hidden">
      <LoginGate onSuccess={handleLoginSuccess} />
    </main>
  );
}