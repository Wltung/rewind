"use client";
import React, { useState, useEffect } from "react";
import { memoryService } from "@/services/memory.service";
import { Memory } from "@/types/memory";

export function PolaroidGacha() {
  const [isGachaOpen, setIsGachaOpen] = useState(false);
  const [currentMemory, setCurrentMemory] = useState<Memory | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const drawNewPhoto = async () => {
    if (isLoading) return;
    setIsFlipped(false);
    setIsAnimating(true);
    setIsLoading(true);

    try {
      // ---> TRUYỀN ID CỦA ẢNH HIỆN TẠI XUỐNG BE ĐỂ CHỐNG LẶP <---
      const memory = await memoryService.getRandomMemory(currentMemory?.id);
      
      setTimeout(() => {
        setCurrentMemory(memory);
        setIsAnimating(false);
        setIsLoading(false);
      }, 600);

    } catch (error) {
      console.error("Lỗi rút ảnh:", error);
      setIsLoading(false);
      setIsAnimating(false);
    }
  };

  useEffect(() => {
    if (isGachaOpen && !currentMemory) {
      drawNewPhoto();
    }
  }, [isGachaOpen]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  };

  return (
    <>
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .flip-transition { transition: transform 0.8s cubic-bezier(0.4, 0.2, 0.2, 1); }
      `}</style>

      {/* ICON TRÊN MẶT BÀN */}
      <div onClick={() => setIsGachaOpen(true)} className="absolute top-16 left-8 md:top-24 md:left-32 w-28 h-32 md:w-32 md:h-36 z-20 cursor-pointer hidden lg:block group">
        <div className="absolute inset-0 bg-white p-2 shadow-md transform -rotate-12 border border-gray-200">
          <div className="w-full h-[75%] bg-gray-200 opacity-50" />
        </div>
        <div className="absolute inset-0 bg-white p-2 shadow-lg transform rotate-6 border border-gray-200 group-hover:rotate-12 group-hover:-translate-y-2 transition-all duration-300">
          <div className="w-full h-[75%] bg-gradient-to-br from-blue-100 to-pink-100 relative overflow-hidden">
             <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/noise.png')]" />
          </div>
          <div className="absolute bottom-2 right-2 text-xl drop-shadow-sm">📸</div>
        </div>
      </div>

      {/* OVERLAY MODAL */}
      {isGachaOpen && (
        <div className="fixed inset-0 z-[500] flex flex-col items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative flex flex-col items-center justify-center perspective-1000 w-full">
            
            {/* CONTAINER BỨC ẢNH CHÍNH */}
            <div 
              onClick={() => { if (currentMemory?.secret_message) setIsFlipped(!isFlipped); }}
              // ---> SỬA Ở ĐÂY: Dùng inline-block để shrink-wrap, xóa aspect-[3/4] <---
              className={`relative inline-block preserve-3d flip-transition cursor-pointer shadow-2xl ${
                isFlipped ? 'rotate-y-180' : ''
              } ${isAnimating ? 'translate-y-20 opacity-0 scale-95' : 'translate-y-0 opacity-100 scale-100'}`}
            >
              
              {/* === MẶT TRƯỚC === */}
              <div className="absolute inset-0 backface-hidden bg-white p-4 pb-16 md:pb-20 border border-gray-200 flex flex-col shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                {/* Lớp nền này sẽ ẩn đi khi ảnh đè lên */}
              </div>

              {/* KHỐI ẢNH (Render thẳng ra ngoài để khung trắng tự phình theo) */}
              <div className="relative backface-hidden bg-white p-3 md:p-4 pb-16 md:pb-20 border border-gray-200 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center">
                {isLoading ? (
                  <div className="w-[280px] h-[300px] flex items-center justify-center bg-gray-100">
                    <span className="material-symbols-outlined text-4xl text-gray-400 animate-spin">refresh</span>
                  </div>
                ) : currentMemory?.image_url && (
                  // Bức ảnh gốc giữ nguyên tỷ lệ, bị giới hạn bởi max-width/max-height
                  <img 
                    src={currentMemory.image_url} 
                    alt="Memory" 
                    className="w-auto h-auto max-w-[85vw] md:max-w-[400px] max-h-[50vh] object-contain block grayscale-[0.1]" 
                  />
                )}

                {/* Caption mặt trước */}
                <p className="absolute bottom-5 left-4 right-4 text-center font-hand text-2xl md:text-3xl text-ink truncate px-4">
                  {currentMemory?.caption}
                </p>

                {/* Gợi ý lật */}
                {currentMemory?.secret_message && !isLoading && (
                  <div className="absolute bottom-4 right-4 flex items-center gap-1 text-gray-400 opacity-60 animate-bounce">
                    <span className="text-[10px] font-mono uppercase font-bold tracking-widest">Flip</span>
                    <span className="material-symbols-outlined text-sm">360</span>
                  </div>
                )}
              </div>

              {/* === MẶT SAU === */}
              {/* Mặt sau cũng sẽ tự động to bằng mặt trước nhờ absolute inset-0 */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 bg-[#FDFBF7] p-6 md:p-8 border border-gray-300 flex flex-col shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/noise.png')]" />
                <div className="absolute top-4 left-4 w-12 h-12 opacity-[0.03] bg-black rounded-full blur-[2px]" />

                <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
                  <p className="font-hand text-2xl md:text-4xl text-ink leading-[1.4] text-center whitespace-pre-line rotate-[-2deg]">
                    {currentMemory?.secret_message}
                  </p>
                </div>

                <div className="absolute bottom-4 right-6 font-display text-[10px] text-gray-400 tracking-widest">
                  {formatDate(currentMemory?.memory_date)}
                </div>
              </div>

            </div>

            {/* BẢNG ĐIỀU KHIỂN */}
            <div className={`mt-12 flex items-center gap-6 transition-opacity duration-500 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
              <button onClick={() => setIsGachaOpen(false)} className="px-6 py-2 rounded-full border border-white/30 text-white/70 font-mono text-xs uppercase tracking-widest hover:bg-white/10 transition-colors">
                Cất đi
              </button>
              
              <button onClick={drawNewPhoto} disabled={isLoading} className="group relative px-8 py-3 bg-white text-ink font-bold font-mono text-sm uppercase tracking-widest rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 transition-all flex items-center gap-2 overflow-hidden">
                <div className="absolute inset-0 bg-blue-100 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <span className="material-symbols-outlined relative z-10 group-hover:rotate-180 transition-transform duration-700">change_circle</span>
                <span className="relative z-10">Rút tấm khác</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}