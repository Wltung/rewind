import React from "react";

interface MiniCassetteProps {
  currentTrack: any;
  isPlaying: boolean;
  onOpen: () => void;
}

export function MiniCassette({ currentTrack, isPlaying, onOpen }: MiniCassetteProps) {
  return (
    <button 
      onClick={onOpen}
      className="hover-lift group absolute bottom-0 left-4 lg:bottom-8 lg:left-12 xl:bottom-16 xl:left-24 z-20 w-[260px] lg:w-[300px] h-36 lg:h-40 bg-[#333] rounded-lg shadow-xl p-3 flex flex-col items-center justify-center transform -rotate-3 cursor-pointer border border-gray-700" 
      style={{ '--hover-rotate': '-5deg' } as React.CSSProperties}
    >
      <div className="absolute inset-0 bg-white/5 rounded-lg pointer-events-none" />
      <div className="w-full h-full bg-[#eee] rounded px-4 py-2 flex flex-col relative overflow-hidden">
        <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-gray-400 flex items-center justify-center"><div className="w-1 h-[1px] bg-gray-600 rotate-45" /></div>
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-gray-400 flex items-center justify-center"><div className="w-1 h-[1px] bg-gray-600 rotate-45" /></div>
        <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-gray-400 flex items-center justify-center"><div className="w-1 h-[1px] bg-gray-600 rotate-45" /></div>
        <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-gray-400 flex items-center justify-center"><div className="w-1 h-[1px] bg-gray-600 rotate-45" /></div>
        
        <div className="w-full bg-primary/10 border-b-2 border-primary/20 mb-2 mt-1 px-2">
          <h3 className="font-hand font-semibold text-lg lg:text-xl text-ink text-center transform -rotate-1 flex items-center justify-center gap-2 truncate">
            {currentTrack.title} {isPlaying ? <span className="animate-pulse">🎵</span> : <span>🎵</span>}
          </h3>
        </div>
        
        <div className="flex-1 bg-gray-200 rounded-sm border border-gray-300 flex items-center justify-center gap-4 relative shadow-inner">
          <div className={`w-10 h-10 rounded-full border-4 border-white bg-gray-800 ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}><div className="w-full h-full border-2 border-dashed border-gray-500 rounded-full" /></div>
          <div className="w-16 h-8 bg-transparent border-t-2 border-b-2 border-transparent" /> 
          <div className={`w-10 h-10 rounded-full border-4 border-white bg-gray-800 ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}><div className="w-full h-full border-2 border-dashed border-gray-500 rounded-full" /></div>
        </div>
        <div className="absolute bottom-1 right-5 text-[10px] font-mono text-gray-500">SIDE A</div>
      </div>
    </button>
  );
}