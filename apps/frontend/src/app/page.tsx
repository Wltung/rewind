"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { Notebook } from "@/components/desk/Notebook";
import { Cassette } from "@/components/desk/Cassette";
import { Camera } from "@/components/desk/Camera";
import { Envelope } from "@/components/desk/Envelope";
import { PolaroidGacha } from "@/components/desk/PolaroidGacha";

export default function DeskPage() {
  // Tạo Refs để GSAP điều khiển
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const deskRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Đọc tham số trên thanh URL (ví dụ: /?from=album)
    const params = new URLSearchParams(window.location.search);
    const fromPage = params.get("from");

    if (fromPage === "album") {
      // ==========================================
      // KỊCH BẢN 1: TỪ ALBUM TRỞ VỀ (RÈM GỖ, KHÔNG ZOOM)
      // ==========================================
      
      // Giăng rèm gỗ ra trước
      gsap.set(overlayRef.current, { backgroundColor: "#D7C9AA", opacity: 1, display: "block" });
      // Mặt bàn hiện rõ luôn, size 100%, không cần zoom
      gsap.set(deskRef.current, { scale: 1, opacity: 1 }); 

      // Từ từ kéo rèm gỗ lên để lộ mặt bàn
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.6,
        delay: 0.1, // Chờ xíu để Nextjs load xong DOM
        ease: "power2.inOut",
        onComplete: () => {
          gsap.set(overlayRef.current, { display: "none" }); 
        }
      });

    } else if (fromPage === "envelope") {
      // ==========================================
      // KỊCH BẢN MỚI: TỪ TRANG 8/3 TRỞ VỀ (RÈM TÍM NHẠT)
      // ==========================================
      gsap.set(overlayRef.current, { backgroundColor: "#E6E6FA", opacity: 1, display: "block" });
      gsap.set(deskRef.current, { scale: 1, opacity: 1 }); 

      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.8, // Fade chậm hơn một chút cho lãng mạn
        delay: 0.1,
        ease: "power2.inOut",
        onComplete: () => { gsap.set(overlayRef.current, { display: "none" }); }
      });

    } else {
      // ==========================================
      // KỊCH BẢN 2: TỪ LOGIN VÀO HOẶC VÀO TRỰC TIẾP (ZOOM IN ĐIỆN ẢNH)
      // ==========================================
      
      // Giăng rèm màu xanh đen của login
      gsap.set(overlayRef.current, { backgroundColor: "#2C3A31", opacity: 1, display: "block" });

      const tl = gsap.timeline({ delay: 0.3 });

      // Rèm đen mờ đi (2.5s)
      tl.to(overlayRef.current, {
        opacity: 0,
        duration: 2.5,
        ease: "power2.inOut",
        onComplete: () => {
          gsap.set(overlayRef.current, { display: "none" }); 
        }
      }, 0); 

      // Mặt bàn từ từ Zoom lên (3.5s)
      tl.to(deskRef.current, {
        scale: 1, 
        opacity: 1, 
        duration: 3.5, 
        ease: "power3.out", 
      }, 0); 
    }
  }, { scope: containerRef });

  return (
    <main ref={containerRef} className="relative min-h-screen w-full wood-texture flex items-center justify-center overflow-hidden p-4 font-display text-ink selection:bg-primary/20">
      
      {/* 1. MÀN CHE CHUYỂN CẢNH (Màu xanh đen) */}
      <div 
        ref={overlayRef}
        className="fixed inset-0 z-[999] bg-[#2C3A31] pointer-events-none" 
      />

      {/* 2. KHUNG ZOOM-IN (Set sẵn opacity-0 và scale-75 để GSAP cầm quyền điều khiển) */}
      <div 
        ref={deskRef}
        className="absolute inset-0 w-full h-full flex items-center justify-center opacity-0 scale-[0.5] origin-center"
      >
        {/* Đồ vật trang trí: Vết cà phê & Bút chì */}
        <div className="absolute top-10 left-[10%] w-48 h-48 coffee-stain opacity-60 pointer-events-none z-0 transform -rotate-12" />
        <div className="absolute bottom-10 right-[25%] w-64 h-4 bg-yellow-400 rotate-12 shadow-sm rounded-full pointer-events-none z-0 hidden lg:block">
          <div className="absolute right-0 top-0 h-full w-4 bg-pink-300 rounded-r-full" />
          <div className="absolute left-0 top-0 h-full w-8 bg-[#d4c5a3] rounded-l-full" style={{ clipPath: "polygon(0 50%, 100% 0, 100% 100%)" }} />
          <div className="absolute left-0 top-0 h-full w-2 bg-black rounded-l-full" style={{ clipPath: "polygon(0 50%, 100% 0, 100% 100%)" }} />
        </div>

        {/* Mặt bàn và các đồ vật chính */}
        <div className="relative w-[95vw] max-w-[2000px] h-[95vh] min-h-[800px] flex flex-col md:block mx-auto">
          <Notebook />
          <Cassette />
          <Camera />
          <Envelope />
          <PolaroidGacha />

          {/* Băng dính decor mặt bàn */}
          <div className="absolute top-[12%] left-[45%] w-24 h-[26px] transform -rotate-45 z-20 bg-[#DFD7C0]/60 backdrop-blur-[2px] shadow-[0_1px_2px_rgba(0,0,0,0.05)] border-x-[4px] border-dashed border-x-white/40 bg-clip-padding" />
        </div>
      </div>

    </main>
  );
}