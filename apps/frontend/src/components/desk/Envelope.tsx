"use client";
import React from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap"; // ---> NHỚ IMPORT GSAP

export function Envelope() {
  const router = useRouter();

  const handleOpenEnvelope = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // 1. Tạo màn che màu Tím Nhạt (Cùng màu nền với IntroSequence)
    const envelopeOverlay = document.createElement("div");
    envelopeOverlay.className = "fixed inset-0 bg-[#E6E6FA] z-[9999] opacity-0 pointer-events-none";
    document.body.appendChild(envelopeOverlay);

    // 2. Kéo rèm lên từ từ
    gsap.to(envelopeOverlay, {
      opacity: 1,
      duration: 0.6,
      ease: "power2.inOut",
      onComplete: () => {
        // 3. Đã che kín -> Push sang trang 8/3
        router.push("/for-ngoc");
        
        // 4. Dọn rác DOM sau khi trang mới đã load xong
        setTimeout(() => envelopeOverlay.remove(), 1000);
      }
    });
  };

  return (
    <button 
      onClick={handleOpenEnvelope} 
      className="hover-lift absolute bottom-[5%] right-[2%] md:bottom-[15%] md:right-[15%] z-20 w-32 sm:w-40 md:w-56 aspect-[1.5] bg-[#fdfbf7] shadow-lg transform rotate-2 cursor-pointer border border-gray-200 group" 
      style={{ '--hover-rotate': '0deg' } as React.CSSProperties}
    >
      <div className="absolute top-0 left-0 w-full h-0 border-l-[112px] border-l-transparent border-r-[112px] border-r-transparent border-t-[80px] border-t-[#f2efe9] shadow-sm z-10 origin-top transition-transform duration-500 group-hover:scale-y-90" />
      <div className="absolute bottom-0 left-0 w-full h-full bg-[#fff] z-0 overflow-hidden">
        <div className="absolute bottom-0 left-0 w-0 h-0 border-l-[112px] border-l-[#f7f5f0] border-t-[70px] border-t-transparent border-b-[70px] border-b-[#e8e6e1]" />
        <div className="absolute bottom-0 right-0 w-0 h-0 border-r-[112px] border-r-[#f7f5f0] border-t-[70px] border-t-transparent border-b-[70px] border-b-[#e8e6e1]" />
      </div>
      
      {/* Thêm hiệu ứng nhịp đập (group-hover:scale-110) cho icon trái tim thêm sinh động */}
      <div className="absolute top-[60px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-red-800 rounded-full shadow-md flex items-center justify-center text-white border-2 border-red-900/50 transition-transform group-hover:scale-110">
        <span className="material-symbols-outlined text-sm">favorite</span>
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-full text-center">
        <p className="font-hand text-xl text-ink">8/3 🌷</p>
      </div>
    </button>
  );
}