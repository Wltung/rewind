import React from "react";

export function Notebook() {
  return (
    <div className="relative md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full max-w-2xl bg-[#FDFBF7] shadow-paper rounded-sm p-8 md:p-12 rotate-1 z-10">
      <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-red-200/50" />
      <div className="relative flex flex-col gap-6 font-hand text-ink">
        <div className="flex justify-between items-start border-b border-primary/20 pb-2">
          <span className="font-typewriter text-sm text-gray-500">Date: 08.03.2026</span>
          <span className="font-typewriter text-sm text-gray-500">Class: 12A5</span>
        </div>
        <div className="space-y-4 text-2xl md:text-3xl leading-relaxed pl-8" style={{ backgroundImage: "repeating-linear-gradient(transparent, transparent 31px, #e5e7eb 32px)", lineHeight: "32px", paddingBottom: "4px" }}>
          <p className="text-primary font-bold">Hello cô gái!</p>
          <p>Một chút niềm vui nhỏ cho em...</p>
          <p>Hy vọng em sẽ thích nó.</p>
          <p className="text-xl text-gray-500 mt-4">- Nhớ bật loa lên nhé! 🎧</p>
        </div>
        <div className="absolute bottom-4 right-8 transform rotate-12 opacity-80">
          <span className="material-symbols-outlined text-4xl text-primary">sentiment_satisfied</span>
        </div>
      </div>
      <div className="absolute left-[-10px] top-10 w-6 h-6 rounded-full border-4 border-gray-400 bg-[#FDFBF7]" />
      <div className="absolute left-[-10px] bottom-10 w-6 h-6 rounded-full border-4 border-gray-400 bg-[#FDFBF7]" />
      <div className="absolute left-[-10px] top-1/2 w-6 h-6 rounded-full border-4 border-gray-400 bg-[#FDFBF7] -translate-y-1/2" />
    </div>
  );
}