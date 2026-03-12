"use client";
import React, { useState, useEffect } from "react";
import PageSpread from "../PageSpread";

// MẶT TRÁI (Lời dặn dò mạnh mẽ)
export const EncouragementTextBack = () => (
  <PageSpread side="left">
    <div className="relative z-20 w-full h-full flex items-center justify-center p-12">
      <h2 className="bold-charcoal-text text-[3rem] md:text-[4rem] leading-relaxed text-center tracking-wide font-bold">
          Và luôn cố gắng.
      </h2>
    </div>
  </PageSpread>
);

// MẶT PHẢI (Núi dốc và Countdown)
export const MountainFront = ({ isShining, onNext }: { isShining: boolean, onNext: () => void }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Mục tiêu: 07:00 Sáng ngày 11/06/2026
    const targetDate = new Date("2026-06-11T07:00:00").getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (time: number) => time.toString().padStart(2, '0');

  return (
    <PageSpread side="right" isOverflowVisible={true}>
      <div className="absolute inset-0 flex flex-col items-center pt-24 pb-12 px-8 z-20 pointer-events-none">
        
        {/* KHỐI SVG VẼ NÚI */}
        <div className="relative w-full h-64 flex-shrink-0">
          <svg className="w-full h-full" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
            <path className="hand-drawn-line" d="M 20 280 L 150 100 L 220 180 L 350 40 L 380 90"></path>
            <path className="hand-drawn-line" d="M 120 140 L 180 60 L 260 160" opacity="0.5"></path>
            <path className="hand-drawn-line path-animation" d="M 50 250 Q 120 230 150 180 T 250 120 T 320 50" strokeDasharray="10 5"></path>
            
            {/* Lá cờ đỏ */}
            <g transform="translate(345, 10)">
              <line stroke="#4b5563" strokeLinecap="round" strokeWidth="2" x1="5" x2="5" y1="30" y2="0"></line>
              <path d="M 5 2 L 25 10 L 5 18 Z" fill="#ef4444" stroke="#4b5563" strokeLinejoin="round" strokeWidth="1.5"></path>
            </g>

            {/* Dấu chấm leo núi (Chỉ bắt đầu đi khi lật tới trang này) */}
            {isShining && (
              <g className="climber">
                <circle cx="0" cy="0" fill="#f59e0b" r="6" stroke="#4b5563" strokeWidth="1.5"></circle>
                <g className="speech-bubble" transform="translate(-50, -70)">
                  <path d="M 10 0 H 90 Q 100 0 100 10 V 25 Q 100 35 90 35 H 55 L 45 45 L 40 35 H 10 Q 0 35 0 25 V 10 Q 0 0 10 0 Z" fill="white" stroke="#4b5563" strokeWidth="1"></path>
                  <text fill="#374151" className="font-['Dancing_Script']" fontSize="16" fontWeight="bold" textAnchor="middle" x="50" y="22">Sắp tới đích rồi!</text>
                </g>
              </g>
            )}

            {/* Chim bay xa */}
            <path d="M 60 40 Q 70 30 80 40 Q 90 35 100 45" fill="none" opacity="0.6" stroke="#9ca3af" strokeLinecap="round" strokeWidth="1.5"></path>
            <path d="M 250 30 Q 265 20 280 30" fill="none" opacity="0.6" stroke="#9ca3af" strokeLinecap="round" strokeWidth="1.5"></path>
          </svg>
        </div>

        {/* ĐỒNG HỒ COUNTDOWN */}
        <div className="mt-auto mb-10 flex flex-col items-center">
          <div className="bg-gray-800 rounded-lg p-4 px-6 border-2 border-gray-700 shadow-inner relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-white/5 pointer-events-none"></div>
            {/* Hiển thị Ngày : Giờ : Phút : Giây */}
            <div className="digital-clock text-3xl md:text-4xl tracking-widest flex items-center gap-2">
              <span>{formatTime(timeLeft.days)}</span><span className="animate-pulse opacity-70">:</span>
              <span>{formatTime(timeLeft.hours)}</span><span className="animate-pulse opacity-70">:</span>
              <span>{formatTime(timeLeft.minutes)}</span><span className="animate-pulse opacity-70">:</span>
              <span>{formatTime(timeLeft.seconds)}</span>
            </div>
          </div>
          <p className="font-['Caveat','Patrick_Hand',cursive] text-3xl text-gray-600 mt-6 transform -rotate-2 font-bold animate-pulse" style={{ animationDuration: '3s' }}>Cố lên nhé.</p>
        </div>
      </div>
      
      <div className="absolute bottom-8 right-10 z-40 flex items-center gap-2 text-stone-500 opacity-70 hover:opacity-100 transition-opacity cursor-pointer pointer-events-auto" onClick={(e) => { e.stopPropagation(); onNext(); }}>
        <span className="font-['Caveat'] text-2xl font-bold">Và...</span>
        <span className="material-symbols-outlined animate-pulse text-xl">arrow_forward</span>
      </div>
    </PageSpread>
  );
}