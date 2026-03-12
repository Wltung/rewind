// apps/frontend/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 1. Lấy cookie rewind_auth mà Backend Go đã set
  const token = request.cookies.get("rewind_auth");
  const { pathname } = request.nextUrl;

  // 2. Những trang không cần bảo vệ (như trang /login)
  const isAuthPage = pathname.startsWith("/login");

  // 3. Nếu chưa có vé mà đòi vào nhà -> Đá ra cổng /login
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 4. Nếu có vé rồi mà vẫn đứng ở cổng /login -> Mời thẳng vào nhà (trang chủ)
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Hợp lệ thì cho đi tiếp
  return NextResponse.next();
}

// Cấu hình matcher để middleware CHỈ chạy trên các route giao diện
// Bỏ qua các file tĩnh (ảnh, css, lottie json...) và Next.js internals
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.json|.*\\.png).*)",
  ],
};