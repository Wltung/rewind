"use client";

import React, { useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

export default function EighteenthChapter() {
  const confettiRef = useRef<any>(null);
  const flowerRef = useRef<any>(null);

  return (
    <div 
      className="bg-[#f8f6f6] dark:bg-[#221014] min-h-screen flex items-center justify-center p-4 md:p-8 overflow-hidden relative" 
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap" rel="stylesheet" />
      
      <style dangerouslySetInnerHTML={{__html: `
        .paper-texture {
          background-color: #fdfaf7;
          background-image: radial-gradient(#e5e7eb 0.5px, transparent 0.5px);
          background-size: 24px 24px;
        }
      `}} />

      <div className="relative flex h-auto min-h-[600px] w-full max-w-[1200px] flex-col md:flex-row bg-white dark:bg-zinc-900 rounded-xl shadow-2xl overflow-hidden border border-[#ec1346]/10">
        
        {/* BÊN TRÁI: Dòng chữ chúc mừng */}
        <div className="flex-1 paper-texture p-8 md:p-16 flex flex-col justify-center items-center text-center border-b md:border-b-0 md:border-r border-[#ec1346]/5">
          <div className="max-w-md">
            <span className="material-symbols-outlined text-[#ec1346]/40 mb-6 text-4xl">auto_awesome</span>
            <h2 className="text-[#4a3b52] dark:text-[#ec1346]/80 text-3xl md:text-4xl italic leading-relaxed mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Chúc mừng lễ trưởng thành nhé.
            </h2>
            <div className="h-px w-12 bg-[#ec1346]/20 mx-auto mb-6"></div>
            <h1 className="text-[#4a3b52] dark:text-slate-200 text-2xl md:text-3xl font-medium leading-snug" style={{ fontFamily: "'Playfair Display', serif" }}>
              Bông hoa hôm qua nay nở rồi <span className="text-[#ec1346]">🌷</span>
            </h1>
            <p className="mt-12 text-[#4a3b52]/60 text-sm tracking-widest uppercase">Eighteenth Chapter</p>
          </div>
        </div>

        {/* BÊN PHẢI: Khối hình Hoa và Hiệu ứng */}
        <div className="flex-1 bg-white dark:bg-zinc-900 p-8 md:p-16 flex flex-col justify-center items-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#ec1346]/5 to-transparent pointer-events-none"></div>
          
          <div className="relative w-[350px] h-[350px] flex items-center justify-center">
            <div className="relative w-72 h-72 flex items-center justify-center">
              
              {/* ✨ LỚP 1: HIỆU ỨNG CONFETTI */}
              <div className="absolute inset-0 z-0 scale-[1.5] pointer-events-none opacity-90">
                <Lottie
                    lottieRef={confettiRef}
                    animationData={require('@/assets/Confetti.json')} 
                    loop={true} 
                    autoplay={true}
                    onDOMLoaded={() => confettiRef.current?.setSpeed(0.5)} 
                />
              </div>

              {/* 🌷 LỚP 2: BÔNG HOA CHÍNH */}
              <div className="relative z-10 w-[250px] h-[250px]">
                  <Lottie
                      lottieRef={flowerRef}
                      animationData={require('@/assets/flower_animation.json')} 
                      loop={true} 
                      autoplay={true} 
                      initialSegment={[0, 61]}
                      onDOMLoaded={() => flowerRef.current?.setSpeed(0.5)}
                  />
              </div>

              {/* CÁC HIỆU ỨNG PHỤ (MATERIAL SYMBOLS) - SẮP XẾP LỘN XỘN */}

              {/* 1. MỚI: Góc trên phải (Thay thế spark) - Cụm lấp lánh mạnh mẽ */}
              <div className="absolute -top-8 -right-10 animate-pulse" style={{ animationDelay: "0.5s" }}>
                <span className="material-symbols-outlined text-yellow-400 text-lg">auto_awesome</span>
              </div>
              
              {/* 2. CŨ: Giữa trái (Chỉnh lại offset cho lộn xộn hơn) - Vệt sáng mờ */}
              <div className="absolute top-1/3 -left-14 opacity-50 animate-pulse" style={{ animationDelay: "1.2s" }}>
                <span className="material-symbols-outlined text-yellow-500 text-xs">blur_on</span>
              </div>
              
              {/* 3. CŨ: Dưới cùng lệch phải - Trái tim đặc */}
              <div className="absolute -bottom-6 right-1/4 opacity-30 animate-pulse" style={{ animationDelay: "1.8s" }}>
                <span className="material-symbols-outlined text-[#ec1346] text-xl">favorite</span>
              </div>

              {/* 4. MỚI - Góc trên trái: Một ngôi sao bồng bềnh */}
              <div className="absolute top-4 -left-6 opacity-40 animate-[bounce_3s_infinite]" style={{ animationDelay: "0.8s" }}>
                <span className="material-symbols-outlined text-[#ec1346] text-sm">grade</span>
              </div>

              {/* 5. MỚI - Giữa phải: Một trái tim mỏng viền */}
              <div className="absolute top-1/2 -right-12 opacity-40 animate-pulse" style={{ animationDelay: "1.5s" }}>
                <span className="material-symbols-outlined text-[#ec1346] text-sm">favorite_border</span>
              </div>

              {/* 6. MỚI - Đỉnh đầu: Một điểm sáng flare tinh tế */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-40 animate-pulse" style={{ animationDelay: "1s" }}>
                <span className="material-symbols-outlined text-yellow-500 text-xs">flare</span>
              </div>

              {/* 7. MỚI - Phía dưới bên trái: Cụm sao lấp lánh chậm */}
              <div className="absolute bottom-2 left-1/4 opacity-60 animate-pulse" style={{ animationDelay: "2.2s" }}>
                <span className="material-symbols-outlined text-yellow-400 text-lg">stars</span>
              </div>
            </div>
          </div>
          
          {/* Đã xóa hoàn toàn nút Share, Download và Re-bloom để giao diện tối giản nhất */}
        </div>
      </div>

      <div className="fixed top-6 left-6 flex items-center gap-3">
        <div className="size-10 bg-[#ec1346] rounded-full flex items-center justify-center text-white">
          <span className="material-symbols-outlined">menu_book</span>
        </div>
        <span className="font-bold text-[#4a3b52] dark:text-slate-100">Digital Notebook</span>
      </div>

      {/* 🔙 NÚT BACK (Thiết kế mới) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <Link href="/for-ngoc">
          <button className="flex items-center gap-2 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md px-8 py-3 rounded-full border border-[#ec1346]/20 shadow-xl text-[#ec1346] hover:bg-[#ec1346]/10 hover:scale-105 active:scale-95 transition-all font-bold text-sm tracking-widest">
            <span className="material-symbols-outlined text-sm">arrow_back_ios_new</span>
            BACK
          </button>
        </Link>
      </div>
    </div>
  );
}