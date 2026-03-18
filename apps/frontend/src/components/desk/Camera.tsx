"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap"; // ---> IMPORT GSAP
import { CameraUploadModal } from "./CameraUploadModal";

export function Camera() {
  const router = useRouter();
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const handleOpenUpload = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    setIsUploadOpen(true);
  };

  // ---> HIỆU ỨNG CAMERA FLASH CHUYỂN TRANG <---
  const handleOpenAlbum = () => {
    // 1. Tạo thẻ div trắng tinh phủ kín màn hình (z-index cực lớn)
    const flash = document.createElement("div");
    flash.className = "fixed inset-0 bg-white z-[9999] pointer-events-none";
    document.body.appendChild(flash);

    // 2. Push trang ngay lập tức
    router.push("/album");

    // 3. Cho tia Flash mờ dần đi (kéo dài 1.2s để trang Album kịp render bên dưới)
    gsap.to(flash, { 
      opacity: 0, 
      duration: 1.2, 
      ease: "power2.out", 
      delay: 0.1, // Chờ xíu cho Next.js chuyển route
      onComplete: () => flash.remove() // Chạy xong thì xóa rác DOM
    });
  };

  return (
    <>
      <button 
        onClick={handleOpenAlbum} // ---> ĐỔI SỰ KIỆN TẠI ĐÂY
        className="hover-lift absolute md:top-16 md:right-24 top-12 right-12 z-30 w-48 h-40 bg-[#f0f0f0] rounded-xl shadow-lg flex flex-col items-center p-4 transform rotate-6 border-b-4 border-gray-300 cursor-pointer group" 
        style={{ '--hover-rotate': '8deg' } as React.CSSProperties}
      >
        <div className="w-full h-8 bg-gray-800 rounded-t-lg flex items-center justify-between px-3 mb-2">
          <div className="w-6 h-4 bg-yellow-200/20 rounded-sm border border-white/20" /> 
          <div className="w-4 h-4 bg-black rounded-full border border-gray-600" /> 
        </div>
        <div className="relative w-20 h-20 bg-gray-800 rounded-full border-4 border-gray-300 shadow-md flex items-center justify-center">
          <div className="w-16 h-16 bg-[#111] rounded-full border-2 border-gray-600 flex items-center justify-center">
            <div className="w-8 h-8 bg-[#222] rounded-full border border-blue-900/50 shadow-inner overflow-hidden relative">
              <div className="absolute top-1 right-2 w-2 h-2 bg-white/30 rounded-full blur-[1px]" />
            </div>
          </div>
        </div>
        <div className="absolute bottom-6 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 opacity-80" />
        
        <div className="absolute -bottom-4 -right-2 bg-yellow-100 px-3 py-1.5 shadow-md transform -rotate-3 border border-yellow-200/50 z-40 flex items-center gap-2">
          <span className="text-ink font-hand font-bold text-lg">Memories 📸</span>
          <div 
            onClick={handleOpenUpload}
            className="w-5 h-5 bg-[#FF5A5A] text-white rounded-full flex items-center justify-center hover:scale-125 transition-transform shadow-sm cursor-pointer border border-red-800/20"
            title="Rửa ảnh mới (Admin)"
          >
            <span className="material-symbols-outlined text-[14px] font-bold">add</span>
          </div>
        </div>
      </button>

      <CameraUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={() => console.log("Đã lưu ảnh mới vào kho!")}
      />
    </>
  );
}