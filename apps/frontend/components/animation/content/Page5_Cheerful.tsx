"use client";
import React from "react";
import PageSpread from "../PageSpread";

// MẶT TRÁI (Lời chúc font tròn thân thiện)
export const CheerfulTextBack = () => (
  <PageSpread side="left">
    <div className="relative z-20 w-full h-full flex items-center justify-center p-12">
      <h2 className="friendly-text text-6xl md:text-7xl text-orange-600 leading-relaxed text-center tracking-wide font-bold">
          Luôn vui tươi.
      </h2>
    </div>
  </PageSpread>
);

// MẶT PHẢI (Ông mặt trời và nốt nhạc bay)
export const CheerfulSunFront = ({ isShining, onNext }: { isShining: boolean, onNext: () => void }) => (
  // OverflowVisible = true để các nốt nhạc có thể bay xuyên sách
  <PageSpread side="right" isOverflowVisible={true}>
    
    <div className="absolute inset-0 z-20 overflow-hidden pointer-events-none">
      
      {/* 3 ĐÁM MÂY MÀU NƯỚC (Blue, Pink, Yellow) CHUẨN HTML CỦA BẠN */}
      <svg className="absolute top-20 left-10 w-48 h-32 opacity-70" viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M 50 60 C 30 60, 20 40, 40 30 C 45 15, 70 10, 85 25 C 100 5, 140 10, 145 35 C 170 35, 175 60, 150 65 C 160 85, 130 95, 110 85 C 90 95, 60 90, 50 60 Z" fill="#e1f5fe" filter="blur(4px)"></path>
      </svg>
      <svg className="absolute bottom-32 left-20 w-56 h-40 opacity-60" viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M 60 70 C 40 70, 30 50, 50 40 C 55 25, 80 20, 95 35 C 110 15, 150 20, 155 45 C 180 45, 185 70, 160 75 C 170 95, 140 105, 120 95 C 100 105, 70 100, 60 70 Z" fill="#fce4ec" filter="blur(6px)"></path>
      </svg>
      <svg className="absolute top-40 right-10 w-40 h-24 opacity-60" viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M 40 50 C 20 50, 10 30, 30 20 C 35 5, 60 0, 75 15 C 90 -5, 130 0, 135 25 C 160 25, 165 50, 140 55 C 150 75, 120 85, 100 75 C 80 85, 50 80, 40 50 Z" fill="#fff9c4" filter="blur(5px)"></path>
      </svg>

      {/* ÔNG MẶT TRỜI DẬO NHẠC ĐƯỢC ĐẶT VÀO ĐÚNG GÓC TRÊN PHẢI */}
      <div className="absolute top-16 right-16 w-48 h-48">
        <div className="sun-jiggle w-full h-full relative">
          
          <svg className="sun-rays absolute inset-0 w-full h-full opacity-80" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" stroke="#ffb300" strokeLinecap="round" strokeWidth="6">
              <line x1="100" x2="100" y1="10" y2="40"></line>
              <line x1="100" x2="100" y1="160" y2="190"></line>
              <line x1="10" x2="40" y1="100" y2="100"></line>
              <line x1="160" x2="190" y1="100" y2="100"></line>
              <line x1="36" x2="58" y1="36" y2="58"></line>
              <line x1="142" x2="164" y1="142" y2="164"></line>
              <line x1="36" x2="58" y1="164" y2="142"></line>
              <line x1="142" x2="164" y1="58" y2="36"></line>
            </g>
          </svg>

          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" fill="#ffca28" r="50" stroke="#ffb300" strokeWidth="4"></circle>
            <path d="M 80 95 Q 85 90 90 95" fill="none" stroke="#5d4037" strokeLinecap="round" strokeWidth="3"></path>
            <path d="M 110 95 Q 115 90 120 95" fill="none" stroke="#5d4037" strokeLinecap="round" strokeWidth="3"></path>
            <ellipse cx="75" cy="105" fill="#ff7043" opacity="0.6" rx="6" ry="4"></ellipse>
            <ellipse cx="125" cy="105" fill="#ff7043" opacity="0.6" rx="6" ry="4"></ellipse>
            <path d="M 85 110 Q 100 125 115 110" fill="none" stroke="#5d4037" strokeLinecap="round" strokeWidth="3"></path>
          </svg>

        </div>
      </div>

      {/* CÁC NỐT NHẠC VẼ TAY BAY LƠ LỬNG */}
      {isShining && (
        <>
          <svg className="note n1 w-8 h-8" fill="none" stroke="#5d4037" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
          <svg className="note n2 w-6 h-6" fill="none" stroke="#5d4037" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
          <svg className="note n3 w-10 h-10" fill="none" stroke="#5d4037" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
          <svg className="note n4 w-7 h-7" fill="none" stroke="#5d4037" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M14 18V6l-4 2v10"></path><circle cx="7" cy="18" r="3"></circle><circle cx="17" cy="16" r="3"></circle></svg>
          <svg className="note n5 w-5 h-5" fill="none" stroke="#5d4037" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
        </>
      )}

    </div>
    
    <div className="absolute bottom-8 right-10 z-40 flex items-center gap-2 text-stone-500 opacity-70 hover:opacity-100 transition-opacity cursor-pointer pointer-events-auto" onClick={(e) => { e.stopPropagation(); onNext(); }}>
      <span className="font-['Dancing_Script'] text-2xl font-bold">Muốn nữa hem...</span>
      <span className="material-symbols-outlined animate-pulse text-xl">arrow_forward</span>
    </div>
  </PageSpread>
);