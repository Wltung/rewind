import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from "@vercel/analytics/react";
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Rewind',
  description: 'Một chút năng lượng nhỏ...',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;700&family=Courier+Prime:ital,wght@0,400;0,700;1,400;1,700&family=Special+Elite&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
        />
      </head>
      <body className="antialiased">
        {children}
        {/* ============================================================== */}
        {/* GLOBAL ROTATE WARNING - CẢNH BÁO XOAY MÀN HÌNH TOÀN CỤC */}
        {/* ============================================================== */}
        <div className="fixed inset-0 z-[99999] bg-[#2C3A31] flex-col items-center justify-center text-[#FDFBF7] hidden max-md:portrait:flex shadow-2xl">
          <span className="material-symbols-outlined text-[80px] mb-6 animate-[spin_3s_linear_infinite] opacity-80">
            screen_rotation
          </span>
          <p className="text-center px-8 text-4xl font-bold leading-relaxed" style={{ fontFamily: "'Caveat', cursive" }}>
            Xoay ngang máy nhé!
          </p>

          <div className="bg-black/20 backdrop-blur-sm p-4 rounded-xl max-w-[80%] border border-white/10 text-center animate-pulse mt-6 shadow-xl">
            <p className="text-sm italic font-medium opacity-90" style={{ fontFamily: "'Lora', serif" }}>
              💡 Bị kẹt không xoay được?<br/>
              <span className="bg-[#8a3324] text-white px-3 py-1.5 rounded mt-3 inline-block not-italic shadow-md tracking-wide">
                Mở bằng trình duyệt nha (Safari/Chrome)
              </span>
            </p>
          </div>
        </div>
        {/* ============================================================== */}
        <Analytics />
      </body>
    </html>
  );
}
