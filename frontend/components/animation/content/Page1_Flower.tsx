"use client";
import React from "react";
import PageSpread from "../PageSpread";

export const FlowerFront = ({ onNext }: { onNext: () => void }) => (
  <PageSpread side="right">
    <div className="absolute inset-0 flex items-center justify-center mt-10 pointer-events-none">
      <svg className="absolute opacity-30" height="400" viewBox="0 0 300 400" width="300"><path d="M150,350 Q160,280 135,210 T160,110 T145,30" fill="none" stroke="#6b7280" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"></path><path d="M150,350 Q130,300 145,260 T120,190" fill="none" stroke="#6b7280" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path></svg>
      <svg className="absolute z-10 drop-shadow-md" height="400" viewBox="0 0 300 400" width="300"><path d="M150,340 Q180,240 135,160 T150,80" fill="none" id="stemPath" stroke="#4ade80" strokeLinecap="round" strokeWidth="3"></path><path d="M162,280 Q200,260 190,230 Q160,250 162,280" fill="#22c55e" stroke="#166534" strokeWidth="1"></path><path d="M142,220 Q100,200 115,170 Q145,190 142,220" fill="#22c55e" stroke="#166534" strokeWidth="1"></path>
        <g transform="translate(150, 80)">
          {['M0,0 Q20,-25 15,-40 Q5,-35 0,-15','M0,0 Q-20,-25 -15,-40 Q-5,-35 0,-15','M0,0 Q30,-5 35,-20 Q20,-25 0,-10','M0,0 Q-30,-5 -35,-20 Q-20,-25 0,-10','M0,0 Q20,20 30,10 Q25,-5 0,-5','M0,0 Q-20,20 -30,10 Q-25,-5 0,-5','M0,0 Q10,30 0,35 Q-10,30 0,0'].map((d, i) => <path key={i} d={d} fill="#fecaca" stroke="#ef4444" strokeWidth="1"></path>)}
          <circle cx="0" cy="-5" fill="#fcd34d" r="10" stroke="#d97706" strokeWidth="1.5"></circle><circle cx="0" cy="-5" fill="#fbbf24" r="6"></circle><circle cx="-2" cy="-7" fill="#fff" opacity="0.6" r="2"></circle>
        </g>
      </svg>
      <svg className="absolute z-20" height="400" viewBox="0 0 300 400" width="300">
        <path d="M142,340 Q172,240 127,160 T142,80" fill="none" id="textPathOffset" stroke="none"></path>
        <text fill="#4A4A4A" className="font-['Caveat'] text-[22px] font-bold" opacity="0.85"><textPath href="#textPathOffset" startOffset="30%">Dành cho bông hoa nhỏ</textPath></text>
      </svg>
    </div>
    <div className="absolute bottom-8 right-10 z-40 flex items-center gap-2 text-stone-500 opacity-70 hover:opacity-100 transition-opacity cursor-pointer pointer-events-auto" onClick={(e) => { e.stopPropagation(); onNext(); }}>
      <span className="font-['Dancing_Script'] text-2xl font-bold">Chạm vào đây để xem tiếp nhé...</span>
      <span className="material-symbols-outlined animate-pulse text-xl">arrow_forward</span>
    </div>
  </PageSpread>
);

export const HeyYouBack = () => (
  <PageSpread side="left">
    <div className="text-center flex flex-col items-center gap-4 mt-[-40px]">
      <h2 className="font-['Caveat'] text-[3.5rem] font-bold text-slate-700 leading-relaxed tracking-wide inline-flex items-center gap-3">Hey you <span className="text-pink-400 text-4xl mt-1">🌷</span></h2>
      <p className="font-['Caveat'] text-[2.2rem] text-slate-600 leading-relaxed">Just a little wave.</p>
    </div>
  </PageSpread>
);