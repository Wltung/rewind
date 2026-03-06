"use client";
import React from "react";
import PageSpread from "../PageSpread";

// MẶT TRÁI (Nằm ở mặt sau của tờ lịch - Lật sang sẽ thấy chữ Elegant)
export const ElegantTextBack = () => (
  <PageSpread side="left">
    <div className="relative z-20 w-full h-full flex flex-col items-center justify-center">
      <h2 className="elegant-text text-[3rem] md:text-[4rem] text-slate-700 leading-relaxed text-center tracking-wide font-semibold">
          Chúc em luôn<br/><span className="text-pink-400/80 text-[3.5rem] md:text-[4.5rem]">xinh xắn.</span>
      </h2>
    </div>
  </PageSpread>
);

// BỔ SUNG onNext VÀO ĐÂY ĐỂ TRÁNH LỖI TYPESCRIPT
export const MirrorFront = ({ isShining, onNext }: { isShining: boolean; onNext: () => void }) => (
    // Gọi isOverflowVisible = true để hạt sáng bay xuyên được gáy sách sang bên chữ
    <PageSpread side="right" isOverflowVisible={true}>
      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
        {/* SVG Vẽ tay chiếc gương */}
        <svg className="w-64 h-80 opacity-60 drop-shadow-sm" viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg">
          <g className="mirror-drawing" fill="none" stroke="#8c8c8c" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
            <path d="M 95 200 C 95 230, 90 260, 85 280 C 100 290, 115 280, 110 260 C 105 230, 105 200, 105 200"></path>
            <path d="M 85 280 C 95 285, 105 285, 110 260"></path>
            <path d="M 92 230 C 100 235, 108 230, 108 230"></path>
            <ellipse cx="100" cy="110" rx="70" ry="90"></ellipse>
            <ellipse cx="100" cy="110" rx="60" ry="80"></ellipse>
            <path d="M 100 200 C 80 190, 60 210, 70 220 C 80 230, 95 210, 100 200"></path>
            <path d="M 100 200 C 120 190, 140 210, 130 220 C 120 230, 105 210, 100 200"></path>
            <path d="M 60 70 L 80 50" strokeWidth="1"></path>
            <path d="M 50 90 L 90 50" strokeWidth="1"></path>
          </g>
        </svg>
  
        {/* ĐỐM SÁNG VÀ HOA BÊN TRONG GƯƠNG CHỈ BAY KHI LẬT TỚI NƠI */}
        {isShining && (
          <>
            <svg className="sparkle s1 w-6 h-6" viewBox="0 0 24 24"><path d="M12 0 L13.5 10.5 L24 12 L13.5 13.5 L12 24 L10.5 13.5 L0 12 L10.5 10.5 Z" fill="#ffd54f"></path></svg>
            <svg className="sparkle s2 w-4 h-4" viewBox="0 0 24 24"><path d="M12 0 L13.5 10.5 L24 12 L13.5 13.5 L12 24 L10.5 13.5 L0 12 L10.5 10.5 Z" fill="#fff59d"></path></svg>
            <svg className="sparkle s3 w-5 h-5" viewBox="0 0 24 24"><path d="M12 0 L13.5 10.5 L24 12 L13.5 13.5 L12 24 L10.5 13.5 L0 12 L10.5 10.5 Z" fill="#ffe082"></path></svg>
            <svg className="sparkle s4 w-3 h-3" viewBox="0 0 24 24"><path d="M12 0 L13.5 10.5 L24 12 L13.5 13.5 L12 24 L10.5 13.5 L0 12 L10.5 10.5 Z" fill="#fff9c4"></path></svg>
            <svg className="sparkle s5 w-7 h-7" viewBox="0 0 24 24"><path d="M12 0 L13.5 10.5 L24 12 L13.5 13.5 L12 24 L10.5 13.5 L0 12 L10.5 10.5 Z" fill="#ffecb3"></path></svg>
  
            <svg className="flower-fly f1 w-8 h-8" viewBox="0 0 30 30"><circle cx="15" cy="15" fill="#f8bbd0" opacity="0.6" r="10"></circle><circle cx="10" cy="10" fill="#f48fb1" opacity="0.5" r="8"></circle><circle cx="20" cy="12" fill="#fce4ec" opacity="0.7" r="7"></circle><circle cx="15" cy="20" fill="#f06292" opacity="0.4" r="6"></circle><circle cx="15" cy="15" fill="#fff" opacity="0.8" r="2"></circle></svg>
            <svg className="flower-fly f2 w-6 h-6" viewBox="0 0 30 30"><circle cx="15" cy="15" fill="#e1bee7" opacity="0.6" r="8"></circle><circle cx="12" cy="12" fill="#ce93d8" opacity="0.5" r="6"></circle><circle cx="18" cy="18" fill="#f3e5f5" opacity="0.7" r="7"></circle><circle cx="15" cy="15" fill="#fff" opacity="0.8" r="1.5"></circle></svg>
            <svg className="flower-fly f3 w-10 h-10" viewBox="0 0 30 30"><circle cx="15" cy="15" fill="#bbdefb" opacity="0.6" r="12"></circle><circle cx="10" cy="15" fill="#90caf9" opacity="0.5" r="9"></circle><circle cx="20" cy="10" fill="#e3f2fd" opacity="0.7" r="8"></circle><circle cx="18" cy="22" fill="#64b5f6" opacity="0.4" r="7"></circle><circle cx="15" cy="15" fill="#fff" opacity="0.8" r="2.5"></circle></svg>
          </>
        )}
      </div>
  
      {/* Bổ sung nút gọi onNext ở đây */}
      <div className="absolute bottom-8 right-10 z-40 flex items-center gap-2 text-stone-500 opacity-70 hover:opacity-100 transition-opacity cursor-pointer pointer-events-auto" onClick={(e) => { e.stopPropagation(); onNext(); }}>
        <span className="font-['Caveat'] text-2xl font-bold">Nexttt...</span>
        <span className="material-symbols-outlined animate-pulse text-xl">arrow_forward</span>
      </div>
    </PageSpread>
  );