// file: components/animation/DeskDecor.tsx
import React from "react";

export default function DeskDecor() {
  return (
    <>
      {/* Cốc Cà Phê */}
      <div className="absolute top-[3%] right-[10%] w-[90px] h-[90px] bg-white rounded-full shadow-[2px_5px_15px_rgba(0,0,0,0.2)] flex items-center justify-center z-0">
        <div className="absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-12 border-[6px] border-white rounded-full z-[-1] shadow-[2px_2px_5px_rgba(0,0,0,0.1)]"></div>
        <div className="w-[85%] h-[85%] bg-[#361f0e] rounded-full shadow-[inset_0_4px_10px_rgba(0,0,0,0.6)] relative overflow-hidden">
          <div className="absolute top-2 right-3 w-4 h-10 bg-orange-50/15 rounded-full rotate-45 blur-[1px]"></div>
        </div>
      </div>
      {/* Vết ố cà phê */}
      <div className="absolute bottom-[2%] right-[2%] w-36 h-36 rounded-full border-[4px] border-[#8b4513]/15 shadow-[inset_0_0_10px_rgba(139,69,19,0.1)] z-0 mix-blend-multiply"></div>
      {/* Kính cận */}
      <div className="absolute bottom-[2%] left-[12%] w-40 h-16 opacity-80 rotate-[-12deg] z-0">
        <svg viewBox="0 0 100 40" className="w-full h-full drop-shadow-sm" fill="none" stroke="#6b4423" strokeWidth="1.5" strokeLinecap="round">
          <circle cx="25" cy="20" r="14"></circle>
          <circle cx="75" cy="20" r="14"></circle>
          <path d="M 39 20 Q 50 15 61 20"></path>
          <path d="M 11 20 L -5 5"></path>
        </svg>
      </div>
    </>
  );
}