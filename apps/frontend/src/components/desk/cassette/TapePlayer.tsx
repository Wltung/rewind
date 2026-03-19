import React from "react";

interface TapePlayerProps {
  currentTrack: any;
  isPlaying: boolean;
  progress: number;
  currentTime: number;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  onToggleMusic: (e?: React.SyntheticEvent) => void;
  onNext: (e?: React.SyntheticEvent) => void;
  onPrev: (e?: React.SyntheticEvent) => void;
  onRewind: (e?: React.SyntheticEvent) => void;
  onOpenUpload: () => void;
  onEject: () => void; // ---> THÊM PROP NÀY <---
  nextTrack1?: any;
  nextTrack2?: any;
}

const formatTime = (time: number) => {
  if (!time || isNaN(time)) return "00:00";
  const m = Math.floor(time / 60).toString().padStart(2, '0');
  const s = Math.floor(time % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

export function TapePlayer({ 
  currentTrack, isPlaying, progress, audioRef, currentTime, 
  onToggleMusic, onNext, onPrev, onRewind, onOpenUpload, onEject, // Nhận prop onEject
  nextTrack1, nextTrack2 
}: TapePlayerProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-start w-full max-w-[460px] mx-auto">
      {/* Vỏ Cassette (Phần phía trên giữ nguyên không đổi) */}
      <div className="relative w-full aspect-[3/2] bg-[#333] rounded-xl shadow-2xl p-4 flex flex-col border-b-4 border-r-4 border-black/40">
        <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-[#555] flex items-center justify-center"><div className="w-1.5 h-0.5 bg-[#222] rotate-45" /></div>
        <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-[#555] flex items-center justify-center"><div className="w-1.5 h-0.5 bg-[#222] rotate-45" /></div>
        <div className="absolute bottom-2 left-2 w-3 h-3 rounded-full bg-[#555] flex items-center justify-center"><div className="w-1.5 h-0.5 bg-[#222] rotate-45" /></div>
        <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-[#555] flex items-center justify-center"><div className="w-1.5 h-0.5 bg-[#222] rotate-45" /></div>
        
        <div className="w-full h-1/2 bg-[#eee] rounded-t-md relative overflow-hidden border-b border-gray-300">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/noise.png')]" />
          <div className="absolute top-4 left-0 w-full h-2 bg-primary/20" />
          <div className="absolute top-7 left-0 w-full h-1 bg-primary/40" />
          
          <div className="absolute top-2 left-4 right-4 flex justify-between items-start">
            <div className="flex flex-col items-start -rotate-1 transform origin-left truncate pr-2 max-w-[70%]">
              <span className="font-hand text-2xl lg:text-3xl font-bold text-ink leading-none truncate w-full">
                {currentTrack.title}
              </span>
              {currentTrack.artist && (
                <span className="font-hand text-sm lg:text-base text-gray-600 leading-tight truncate w-full mt-0.5">
                  {currentTrack.artist}
                </span>
              )}
            </div>
            
            <div className="font-mono text-[10px] md:text-xs text-gray-500 border border-gray-400 px-1.5 py-0.5 rounded bg-white/50 whitespace-nowrap shadow-sm mt-1">
              {formatTime(currentTime)} / {currentTrack.duration}
            </div>
          </div>
          <div className="absolute bottom-4 left-4 right-4 space-y-2">
            <div className="h-px w-full bg-gray-300" />
            <div className="h-px w-full bg-gray-300" />
          </div>
        </div>

        <div className="flex-1 bg-[#222] relative flex items-center justify-center px-8 py-2">
          <div className="w-full h-full bg-[#444] rounded-md border border-[#555] relative overflow-hidden flex items-center justify-center gap-4 lg:gap-12 px-4 shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.25)]">
            {/* ---> CHÍNH THỨC HÓA: DẢI BĂNG (TAPE BELT) NỐI 2 BÁNH XE <--- */}
            {/* Độc lập hoàn toàn, nằm dưới cùng (z-0) để không bao giờ bị mất */}
            <div className="absolute inset-[4px] md:inset-[8px] rounded-full border-[8px] md:border-[10px] border-[#5a4a42] pointer-events-none z-0 opacity-90 shadow-inner" />

            {/* BÁNH XE TRÁI (Thêm relative z-10 để giữ lõi băng của riêng nó) */}
            <div className={`relative z-10 w-24 h-24 rounded-full border-4 border-white/80 bg-transparent flex items-center justify-center shadow-lg ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center relative">
                <div className="w-3 h-3 bg-black rounded-full absolute top-2" />
                <div className="w-3 h-3 bg-black rounded-full absolute bottom-2" />
                <div className="w-3 h-3 bg-black rounded-full absolute left-2" />
                <div className="w-3 h-3 bg-black rounded-full absolute right-2" />
                <div className="w-6 h-6 bg-black/20 rounded-full absolute" />
              </div>
              {/* Lõi băng bên trái (nhỏ dần) */}
              <div className="absolute inset-0 rounded-full border-[#5a4a42] transition-all duration-1000" style={{ borderWidth: `${10 - (progress / 10)}px` }} />
            </div>

            {/* TRỤC GIỮA */}
            <div className="relative z-10 flex flex-col gap-1 items-center opacity-40">
              <div className="w-12 h-8 border border-white/30 rounded-sm bg-black/20" />
            </div>

            {/* BÁNH XE PHẢI (Thêm relative z-10) */}
            <div className={`relative z-10 w-24 h-24 rounded-full border-4 border-white/80 bg-transparent flex items-center justify-center shadow-lg ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center relative">
                <div className="w-3 h-3 bg-black rounded-full absolute top-2" />
                <div className="w-3 h-3 bg-black rounded-full absolute bottom-2" />
                <div className="w-3 h-3 bg-black rounded-full absolute left-2" />
                <div className="w-3 h-3 bg-black rounded-full absolute right-2" />
                <div className="w-6 h-6 bg-black/20 rounded-full absolute" />
              </div>
              {/* Lõi băng bên phải (to dần) */}
              <div className="absolute inset-0 rounded-full border-[#5a4a42] transition-all duration-1000" style={{ borderWidth: `${10 - (progress / 10)}px` }} />
            </div>
          </div>
        </div>

        <div className="h-8 w-full bg-[#2a2a2a] rounded-b-lg flex justify-center items-center gap-12 relative">
          <div className="w-2/3 h-full bg-[#252525] border-t border-gray-600 flex justify-center items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-black" />
            <div className="w-2 h-2 rounded-full bg-black" />
          </div>
        </div>
      </div>

      {/* Điều khiển Nhạc - ĐÃ THÊM NÚT EJECT */}
      <div className="w-full mt-5 flex flex-col gap-5">
        <div 
          className="relative w-full h-8 flex items-center cursor-pointer"
          onClick={(e) => {
            if(audioRef.current) {
              const rect = e.currentTarget.getBoundingClientRect();
              const percent = (e.clientX - rect.left) / rect.width;
              audioRef.current.currentTime = percent * audioRef.current.duration;
            }
          }}
        >
          <div className="absolute w-full h-1 bg-white/20 rounded-full" />
          <div className="absolute h-1 bg-white/60 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-300" style={{ width: `${progress}%` }} />
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transform rotate-12 drop-shadow-lg transition-all duration-300" style={{ left: `${progress}%` }}>
            <span className="material-symbols-outlined text-4xl text-[#fcd34d] drop-shadow-md" style={{ fontVariationSettings: "'FILL' 1" }}>edit</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-2 sm:gap-3">
            {/* ---> NÚT EJECT (MÀU ĐỎ NỔI BẬT) <--- */}
            <button onClick={onEject} title="Nhả băng / Tìm bài" className="w-12 sm:w-14 md:w-16 h-12 bg-[#FF5A5A] rounded shadow-[0_4px_0_#990000] hover:bg-[#e04848] active:shadow-none active:translate-y-[4px] transition-all flex items-center justify-center border-b border-r border-red-900 group mr-2">
              <span className="material-symbols-outlined text-white font-bold group-active:scale-95">eject</span>
            </button>

            <button onClick={onRewind} className="w-12 sm:w-14 md:w-16 h-12 bg-[#e2e2e2] rounded shadow-[0_4px_0_#999] hover:bg-white active:shadow-none active:translate-y-[4px] transition-all flex items-center justify-center border-b border-r border-gray-300">
              <span className="material-symbols-outlined text-gray-700">fast_rewind</span>
            </button>
            <button onClick={onPrev} className="w-12 sm:w-14 md:w-16 h-12 bg-[#e2e2e2] rounded shadow-[0_4px_0_#999] hover:bg-white active:shadow-none active:translate-y-[4px] transition-all flex items-center justify-center border-b border-r border-gray-300">
              <span className="material-symbols-outlined text-gray-700">skip_previous</span>
            </button>
            <button onClick={onToggleMusic} className="w-12 sm:w-14 md:w-16 h-12 bg-primary rounded shadow-[0_4px_0_#0d5a9c] hover:bg-[#1582ed] active:shadow-none active:translate-y-[4px] transition-all flex items-center justify-center border-b border-r border-blue-900 group">
              <span className="material-symbols-outlined text-white group-active:scale-95">{isPlaying ? 'pause' : 'play_arrow'}</span>
            </button>
            <button onClick={onNext} className="w-12 sm:w-14 md:w-16 h-12 bg-[#e2e2e2] rounded shadow-[0_4px_0_#999] hover:bg-white active:shadow-none active:translate-y-[4px] transition-all flex items-center justify-center border-b border-r border-gray-300">
              <span className="material-symbols-outlined text-gray-700">skip_next</span>
            </button>
          </div>

          <div className="flex-1 max-w-[100px] md:max-w-[120px] h-12 bg-[#222] rounded border-2 border-[#444] relative overflow-hidden flex items-end justify-center pb-1 shadow-inner md:flex">
            <div className="absolute top-1 left-0 right-0 text-[8px] text-gray-400 flex justify-between px-2 font-mono"><span>L</span><span>R</span></div>
            <div className="w-20 h-8 border-t border-gray-500 rounded-t-full relative">
              <div className={`absolute bottom-0 left-1/2 w-0.5 h-8 bg-red-500 origin-bottom ${isPlaying ? 'animate-[bounce_0.2s_infinite]' : ''} rotate-[-20deg]`} />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 3 Thẻ Playlist / Upload (Giữ nguyên) */}
      <div className="relative w-full h-40 mt-6 flex justify-center sm:flex">
        {/* Upload Card */}
        <div 
          onClick={onOpenUpload}
          className="absolute top-0 -left-2 md:-left-8 w-36 md:w-40 h-20 md:h-24 bg-[#FCEA7A] rounded-md border-[3px] border-[#1a1a1a] shadow-[4px_4px_0_rgba(0,0,0,0.8)] transform -rotate-3 flex flex-col items-center justify-center cursor-pointer hover:-translate-y-2 hover:rotate-0 hover:shadow-[6px_6px_0_rgba(0,0,0,0.8)] transition-all z-20"
        >
          <span className="font-hand font-bold text-ink text-lg md:text-xl leading-none text-center mb-1">ORDER<br/>YOUR SONG</span>
          <div className="w-6 h-6 bg-[#1877F2] rounded-full flex items-center justify-center text-white border-2 border-[#1a1a1a]">
            <span className="material-symbols-outlined text-[16px] font-bold">add</span>
          </div>
        </div>

        {/* Next Track 1 */}
        {nextTrack1 && (
          <div 
            onClick={onNext}
            className="absolute top-4 -right-2 md:-right-8 w-36 md:w-40 h-20 md:h-24 bg-[#F8F9FA] rounded-md border-[3px] border-[#1a1a1a] shadow-[4px_4px_0_rgba(0,0,0,0.8)] transform rotate-3 flex flex-col justify-between p-2 md:p-3 cursor-pointer hover:-translate-y-2 hover:rotate-0 hover:shadow-[6px_6px_0_rgba(0,0,0,0.8)] transition-all z-10"
          >
            <span className="font-hand font-bold text-ink text-sm md:text-base leading-tight line-clamp-2 w-full">{nextTrack1.title}</span>
            <div className="flex justify-between items-end w-full mt-1">
              <div className="w-4 h-4 rounded-full border-[2px] border-[#1a1a1a] flex items-center justify-center"><div className="w-1.5 h-1.5 bg-[#1a1a1a] rounded-full" /></div>
              <span className="text-[9px] font-mono font-bold text-gray-500 uppercase">Next Track</span>
            </div>
          </div>
        )}

        {/* Next Track 2 */}
        {nextTrack2 && (
          <div 
            onClick={() => { onNext(); setTimeout(onNext, 50); }}
            className="absolute top-20 md:top-20 left-[25%] md:left-[30%] w-36 md:w-40 h-20 md:h-24 bg-[#E0F2FE] rounded-md border-[3px] border-[#1a1a1a] shadow-[4px_4px_0_rgba(0,0,0,0.8)] transform -rotate-2 flex flex-col justify-between p-2 md:p-3 cursor-pointer hover:-translate-y-2 hover:rotate-0 hover:shadow-[6px_6px_0_rgba(0,0,0,0.8)] transition-all z-30 opacity-95 hover:opacity-100"
          >
            <span className="font-hand font-bold text-ink text-sm md:text-base leading-tight line-clamp-2 w-full">{nextTrack2.title}</span>
            <div className="flex justify-between items-end w-full mt-1">
              <div className="w-4 h-4 rounded-full border-[2px] border-[#1a1a1a] flex items-center justify-center"><div className="w-1 h-1 bg-transparent rounded-full" /></div>
              <span className="text-[9px] font-mono font-bold text-gray-500 uppercase">In Queue</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}