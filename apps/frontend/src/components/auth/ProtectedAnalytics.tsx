"use client";

import { Analytics } from "@vercel/analytics/react";
import { usePathname } from "next/navigation";

export default function ProtectedAnalytics() {
  const pathname = usePathname();

  // Nếu đang đứng ở cổng đăng nhập -> Không thu thập dữ liệu
  if (pathname === "/login") {
    return null;
  }

  // Nếu đã lọt được vào trong (nghĩa là nhập pass đúng) -> Bật Analytics
  return <Analytics />;
}