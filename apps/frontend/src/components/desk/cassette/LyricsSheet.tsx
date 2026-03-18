import React, { useMemo, useEffect, useRef } from "react";

interface LyricsSheetProps {
  currentTrack: any;
  currentTime: number;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  isPlaying: boolean;
  onToggleMusic: () => void;
}

export function LyricsSheet({ currentTrack, currentTime, audioRef, isPlaying, onToggleMusic }: LyricsSheetProps) {
  const activeLyricRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const activeLyricIndex = useMemo(() => {
    if (!currentTrack.lyrics || currentTrack.lyrics.length === 0) return -1;
    const index = [...currentTrack.lyrics].reverse().findIndex((lyric: any) => lyric.time <= currentTime);
    return index >= 0 ? currentTrack.lyrics.length - 1 - index : 0;
  }, [currentTime, currentTrack]);

  useEffect(() => {
    // THAY ĐỔI QUAN TRỌNG: Tự tính toán vị trí cuộn thay vì dùng scrollIntoView
    // Điều này ngăn chặn việc trình duyệt tự động đẩy cả Modal lên trên
    if (activeLyricRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const activeEl = activeLyricRef.current;
      
      const scrollPos = activeEl.offsetTop - (container.clientHeight / 2) + (activeEl.clientHeight / 2);
      container.scrollTo({ top: scrollPos, behavior: 'smooth' });
    }
  }, [activeLyricIndex]);

  return (
    <div className="flex-1 w-full max-w-[500px] mx-auto lg:h-[560px] relative mt-8 lg:mt-0 flex flex-col">
      <style>{`
        .lined-paper {
          background-color: #FDFBF7;
          background-image: linear-gradient(#e5e5e5 1px, transparent 1px);
          background-size: 100% 2.5rem;
          line-height: 2.5rem;
        }
        .lyrics-scroll::-webkit-scrollbar {
          width: 0px; 
          background: transparent;
        }
      `}</style>
      
      {/* Lớp bóng đổ giấy */}
      <div className="absolute inset-0 bg-[#FDFBF7] shadow-lg transform rotate-1 rounded-sm border border-gray-200">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/noise.png')]" />
      </div>
      
      {/* Lớp nền giấy thực sự */}
      <div className="relative z-10 w-full h-full bg-transparent flex flex-col lined-paper rounded-sm overflow-hidden border border-gray-100">
        
        {/* Lỗ còng sắt bên trái (Được fix cứng tuyệt đối) */}
        <div className="absolute left-4 top-0 bottom-0 w-8 flex flex-col justify-evenly pointer-events-none z-20">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="w-4 h-4 rounded-full bg-black/60 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]" />
          ))}
        </div>
        
        {/* Đường kẻ đỏ lề trái */}
        <div className="absolute left-16 top-0 bottom-0 w-px bg-red-300/60 pointer-events-none z-20" />

        {/* HEADER: Tiêu đề cố định (Tách ra khỏi khung cuộn để không bị đè) */}
        <div className="pl-20 pr-6 pt-6 pb-2 relative z-20 bg-[#FDFBF7]/90 backdrop-blur-sm border-b border-gray-200/50">
           <h3 className="font-mono font-bold text-xl text-ink">
            "{currentTrack.title}" - The Lyrics
          </h3>
        </div>

        {/* BODY: Khung cuộn chứa lời bài hát */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 pl-20 pr-6 overflow-y-auto lyrics-scroll relative pb-32 pt-4"
        >
          <div className="space-y-0 font-mono text-base md:text-lg text-gray-400 transition-all duration-500">
            {currentTrack.lyrics?.map((lyric: any, index: number) => {
              const isActive = index === activeLyricIndex;
              return (
                <div 
                  key={index} 
                  ref={isActive ? activeLyricRef : null}
                  className={`relative py-1 my-2 transition-all duration-300 ${isActive ? 'scale-105' : ''}`}
                  onClick={() => {
                    if(audioRef.current) {
                      audioRef.current.currentTime = lyric.time;
                      if (!isPlaying) onToggleMusic();
                    }
                  }}
                >
                  {isActive && (
                    <span className="absolute -left-6 top-1/2 -translate-y-1/2 text-primary material-symbols-outlined text-sm animate-pulse">
                      arrow_right
                    </span>
                  )}
                  <p className={`cursor-pointer ${isActive ? 'text-primary font-bold bg-primary/5 inline px-1 -mx-1 rounded' : 'hover:text-gray-500'}`}>
                    {lyric.text}
                  </p>
                </div>
              );
            })}
            
            {/* Hiển thị khi bài hát chưa có lời */}
            {(!currentTrack.lyrics || currentTrack.lyrics.length === 0) && (
               <p className="italic text-gray-400 mt-4">Chưa có lời bài hát...</p>
            )}
          </div>
        </div>

        {/* Gradient che mờ ở dưới đáy để chữ chìm từ từ khi cuộn lên */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#FDFBF7] to-transparent pointer-events-none z-10" />
      </div>

      {/* Sticky Note Hồng (Đẩy z-index lên 30 để luôn nằm trên cùng) */}
      {currentTrack.quote && (
        <div className="absolute -top-4 -right-4 w-28 h-28 bg-[#FFC1CC] shadow-[4px_8px_20px_rgba(0,0,0,0.3)] transform rotate-[8deg] flex items-center justify-center p-3 text-center z-30 transition-all hover:rotate-0 hover:scale-110">
          {/* Ghim nhỏ trang trí */}
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-red-500 shadow-sm border border-red-700/50" />
          
          <p className="font-hand text-ink text-[16px] leading-snug rotate-[-4deg] break-words line-clamp-4">
            {currentTrack.quote}
          </p>
        </div>
      )}
    </div>
  );
}