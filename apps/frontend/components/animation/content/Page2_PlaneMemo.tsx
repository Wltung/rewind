"use client";
import React from "react";
import PageSpread from "../PageSpread";

export const PlaneFront = ({ isFlying, onNext }: { isFlying: boolean, onNext: () => void }) => (
  <PageSpread side="right">
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <svg className="w-full h-full opacity-90 drop-shadow-sm" viewBox="0 0 450 590" xmlns="http://www.w3.org/2000/svg">
        <path d="M 50 300 C 150 150, 300 150, 350 300 C 400 450, 250 450, 150 300" fill="none" opacity="0.6" stroke="#94a3b8" strokeDasharray="6,8" strokeWidth="2"></path>
      </svg>
      {isFlying && (
        <div className="absolute top-0 left-0 drop-shadow-md origin-center animate-fly">
          <svg width="60" height="60" viewBox="-20 -20 100 100" className="opacity-90">
            <g transform="scale(0.8)">
              <path d="M 0 0 L 60 -10 L 15 20 Z" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1"></path>
              <path d="M 0 0 L 60 -10 L 25 10 Z" fill="#f8fafc"></path>
              <path d="M 25 10 L 60 -10 L 15 20 Z" fill="#cbd5e1"></path>
              <path d="M 25 10 L 15 20 L 20 12 Z" fill="#94a3b8"></path>
            </g>
          </svg>
        </div>
      )}
    </div>
    <div className="absolute bottom-8 right-10 z-40 flex items-center gap-2 text-stone-500 opacity-70 hover:opacity-100 transition-opacity cursor-pointer pointer-events-auto" onClick={(e) => { e.stopPropagation(); onNext(); }}>
      <span className="font-['Dancing_Script'] text-2xl font-bold">Lật tiếp nha...</span>
      <span className="material-symbols-outlined animate-pulse text-xl">arrow_forward</span>
    </div>
  </PageSpread>
);

export const MemoBack = () => (
  <PageSpread side="left">
    {/* Tờ ghi chú dán băng dính chuyển từ code.html */}
    <div className="relative bg-white/60 p-8 pt-10 pb-12 shadow-[2px_5px_15px_rgba(0,0,0,0.05)] border border-stone-200/50 w-[85%] rounded-sm rotate-[-2deg]">
      <div className="washi-tape pink w-24 h-6 absolute -top-3 left-1/2 -translate-x-1/2 rotate-1"></div>
      <h2 className="font-['Caveat'] text-[2.5rem] font-bold text-slate-700 leading-relaxed tracking-wide text-center">Chú ý!</h2>
      <div className="w-16 h-0.5 bg-pink-200/60 mx-auto mt-2 mb-6 rounded-full"></div>
      <p className="font-['Caveat'] text-[1.8rem] text-slate-600 leading-relaxed text-center">Hôm nay là 8/3 rồi đó.</p>
    </div>
  </PageSpread>
);