// file: components/animation/BookCover.tsx
import React from "react";

export function CoverFront({ isFlipped }: { isFlipped: boolean }) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-[#5c3a21] to-[#3a2210] rounded-r-2xl rounded-l-sm shadow-[15px_20px_40px_rgba(0,0,0,0.6),inset_8px_0_20px_rgba(0,0,0,0.8)] border-l-[12px] border-[#2a170a] relative group hover:shadow-[15px_25px_45px_rgba(0,0,0,0.7)] transition-shadow">
      <div className="absolute inset-0 rounded-r-2xl opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8Y2lyY2xlIGN4PSIyIiBjeT0iMiIgcj0iMSIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjEiLz4KPC9zdmc+')]"></div>
      <div className="absolute inset-2 md:inset-4 border border-dashed border-[#8b5a33] rounded-r-xl opacity-40"></div>
      <div className={`absolute bottom-20 left-10 md:left-16 w-60 min-h-[160px] bg-[#fdf08c] shadow-[4px_5px_15px_rgba(0,0,0,0.4)] -rotate-3 p-5 flex flex-col justify-center border border-[#e8df7b] z-20 backface-hidden ${!isFlipped ? 'animate-pulse' : ''}`}>
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-20 h-8 bg-white/40 backdrop-blur-[2px] shadow-sm rotate-[4deg] border border-white/20" style={{ clipPath: "polygon(0 10%, 100% 0, 95% 100%, 5% 90%)" }}></div>
        <p className="text-[#2c3e50] text-xl md:text-2xl text-center font-['Dancing_Script'] font-bold leading-relaxed">Chạm nhẹ vào đây để mở món quà nhỏ dành riêng cho em</p>
        <div className="absolute bottom-2 right-2 text-[#d14f4f] opacity-80"><span className="material-symbols-outlined text-2xl">favorite</span></div>
      </div>
      <div className="absolute top-1/2 -right-8 -translate-y-1/2 w-12 h-16 bg-gradient-to-r from-[#3a2210] to-[#2a1a10] shadow-lg rounded-r-md -z-10 border-y border-black backface-hidden"></div>
      <div className="absolute top-1/2 right-2 md:right-4 -translate-y-1/2 w-16 h-16 bg-[#2a1a10] rounded-full shadow-[inset_2px_2px_6px_rgba(255,255,255,0.1),_4px_5px_10px_rgba(0,0,0,0.6)] flex items-center justify-center border border-[#1a0f07] backface-hidden">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-300 to-zinc-500 shadow-[inset_1px_1px_3px_rgba(255,255,255,0.8),_2px_2px_5px_rgba(0,0,0,0.8)] flex items-center justify-center"><div className="w-6 h-6 rounded-full bg-gradient-to-br from-zinc-400 to-zinc-600 shadow-inner"></div></div>
      </div>
    </div>
  );
}

export function CoverBack() {
  return (
    <div className="w-full h-full bg-gradient-to-bl from-[#5c3a21] to-[#3a2210] rounded-l-2xl shadow-[inset_-8px_0_20px_rgba(0,0,0,0.8)] border-r-[6px] border-[#2a170a] p-4 flex flex-col items-center justify-center">
      <div className="absolute inset-0 rounded-l-2xl opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8Y2lyY2xlIGN4PSIyIiBjeT0iMiIgcj0iMSIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjEiLz4KPC9zdmc+')]"></div>
      <div className="relative w-56 h-64 bg-[#fdfbf7] shadow-[3px_5px_15px_rgba(0,0,0,0.5)] rotate-[-3deg] p-4 flex flex-col items-center border border-stone-200 z-20">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-amber-900/20 backdrop-blur-sm rotate-2 shadow-sm"></div>
        <h2 className="font-['Courier_Prime'] text-xl font-bold text-red-800 mb-2 border-b border-stone-300 w-full text-center pb-2">MARCH</h2>
        <div className="grid grid-cols-7 gap-y-3 gap-x-2 text-center w-full text-[10px] font-['Courier_Prime'] text-stone-600 mt-2">
          {['S','M','T','W','T','F','S'].map(d => <div key={d} className="font-bold text-stone-800">{d}</div>)}
          <div className="text-stone-300">26</div><div className="text-stone-300">27</div><div className="text-stone-300">28</div>
          {Array.from({length: 7}).map((_, i) => <div key={i}>{i + 1}</div>)}
          <div className="relative flex items-center justify-center"><span className="relative z-10 text-stone-900 font-bold text-xs">8</span><div className="absolute w-7 h-7 border-[2.5px] border-red-500 rounded-full scale-110 -rotate-12 opacity-80"></div></div>
          {Array.from({length: 23}).map((_, i) => <div key={i}>{i + 9}</div>)}<div className="text-stone-300">1</div>
        </div>
      </div>
      <div className="relative mt-8 z-20 text-center px-6 rotate-[-2deg]">
        <p className="font-['Dancing_Script'] text-[1.6rem] font-bold text-[#8a3324] leading-relaxed bg-[#fdfbf7]/70 backdrop-blur-sm rounded-md px-4 py-1 shadow-[0_0_15px_rgba(255,255,255,0.7)] border border-white/50">Một chút năng lượng nhỏ cho ngày 8/3</p>
      </div>
      <div className="absolute top-1/2 left-8 -translate-y-1/2 rotate-[15deg] z-10 opacity-90 drop-shadow-md scale-90">
        <div className="w-1 h-32 bg-[#6b7252] rounded-full"></div><div className="absolute top-10 -left-3 w-4 h-8 rounded-full bg-[#5a6242] rotate-[-40deg]"></div><div className="absolute top-16 left-1 w-3 h-6 rounded-full bg-[#5a6242] rotate-[30deg]"></div><div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-[#d4b5a3] mix-blend-multiply opacity-85 rotate-12"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-4 bg-white/40 backdrop-blur-[1px] rotate-[-20deg] shadow-sm" style={{ clipPath: 'polygon(5% 0, 95% 10%, 100% 90%, 0 100%)' }}></div>
      </div>
    </div>
  );
}