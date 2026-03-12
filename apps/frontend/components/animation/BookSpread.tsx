// file: components/animation/BookSpread.tsx
import React from "react";
import PageSpread from "./PageSpread";

// Lõi SVG Bông Hoa
export const FlowerIllustration = () => (
  <div className="absolute inset-0 flex items-center justify-center mt-10 pointer-events-none">
    <svg className="absolute opacity-30" height="400" viewBox="0 0 300 400" width="300"><path d="M150,350 Q160,280 135,210 T160,110 T145,30" fill="none" stroke="#6b7280" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"></path><path d="M150,350 Q130,300 145,260 T120,190" fill="none" stroke="#6b7280" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path></svg>
    <svg className="absolute z-10 drop-shadow-md" height="400" viewBox="0 0 300 400" width="300"><path d="M150,340 Q180,240 135,160 T150,80" fill="none" id="stemPath" stroke="#4ade80" strokeLinecap="round" strokeWidth="3"></path><path d="M162,280 Q200,260 190,230 Q160,250 162,280" fill="#22c55e" stroke="#166534" strokeWidth="1"></path><path d="M142,220 Q100,200 115,170 Q145,190 142,220" fill="#22c55e" stroke="#166534" strokeWidth="1"></path>
      <g transform="translate(150, 80)">
        {['M0,0 Q20,-25 15,-40 Q5,-35 0,-15','M0,0 Q-20,-25 -15,-40 Q-5,-35 0,-15','M0,0 Q30,-5 35,-20 Q20,-25 0,-10','M0,0 Q-30,-5 -35,-20 Q-20,-25 0,-10','M0,0 Q20,20 30,10 Q25,-5 0,-5','M0,0 Q-20,20 -30,10 Q-25,-5 0,-5','M0,0 Q10,30 0,35 Q-10,30 0,0'].map((d, i) => <path key={i} d={d} fill="#fecaca" stroke="#ef4444" strokeWidth="1"></path>)}
        <circle cx="0" cy="-5" fill="#fcd34d" r="10" stroke="#d97706" strokeWidth="1.5"></circle>
        <circle cx="0" cy="-5" fill="#fbbf24" r="6"></circle>
        <circle cx="-2" cy="-7" fill="#fff" opacity="0.6" r="2"></circle>
      </g>
    </svg>
    <svg className="absolute z-20" height="400" viewBox="0 0 300 400" width="300">
      <path d="M142,340 Q172,240 127,160 T142,80" fill="none" id="textPathOffset" stroke="none"></path>
      <text fill="#4A4A4A" className="font-['Caveat'] text-[22px] font-bold" opacity="0.85"><textPath href="#textPathOffset" startOffset="30%">Dành cho bông hoa nhỏ</textPath></text>
    </svg>
  </div>
);

// Trang Bông Hoa (Có nút Next)
export const FlowerPage = ({ onNext }: { onNext: () => void }) => (
  <PageSpread side="right">
    <FlowerIllustration />
    <div 
      className="absolute bottom-8 right-10 z-40 flex items-center gap-2 text-stone-500 opacity-70 hover:opacity-100 transition-opacity cursor-pointer pointer-events-auto"
      onClick={(e) => { e.stopPropagation(); onNext(); }}
    >
      <span className="font-['Caveat'] text-2xl font-bold">Chạm vào đây để xem tiếp nhé...</span>
      <span className="material-symbols-outlined animate-pulse text-xl">arrow_forward</span>
    </div>
  </PageSpread>
);

// Trang Hey You (Có nút Prev)
export const HeyYouPage = ({ onPrev }: { onPrev: () => void }) => (
  <PageSpread side="left">
    <div className="text-center flex flex-col items-center gap-4 mt-[-40px]">
      <h2 className="font-['Caveat'] text-[3.5rem] font-bold text-slate-700 leading-relaxed tracking-wide inline-flex items-center gap-3">
          Hey you <span className="text-pink-400 text-4xl mt-1">🌷</span>
      </h2>
      <p className="font-['Caveat'] text-[2.2rem] text-slate-600 leading-relaxed">
          Just a little wave.
      </p>
    </div>
    <div 
      className="absolute bottom-8 left-10 z-40 flex items-center gap-2 text-stone-500 opacity-70 hover:opacity-100 transition-opacity cursor-pointer pointer-events-auto"
      onClick={(e) => { e.stopPropagation(); onPrev(); }}
    >
      <span className="material-symbols-outlined text-xl">arrow_back_ios_new</span>
      <span className="font-['Caveat'] text-2xl font-bold">Xem lại hoa nhỏ</span>
    </div>
  </PageSpread>
);

// Trang Máy Bay
export const AirplanePage = ({ isFlying }: { isFlying: boolean }) => (
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
  </PageSpread>
);