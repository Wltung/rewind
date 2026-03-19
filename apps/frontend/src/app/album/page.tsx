"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { memoryService } from "@/services/memory.service";
import { Memory } from "@/types/memory";

const BACKEND_URL = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:9001/api").replace('/api', '');

const NOTE_COLORS = ["bg-[#E8F08C]", "bg-[#FFC1CC]", "bg-[#C1E4FF]"];
const ROTATIONS = ["rotate-2", "-rotate-2", "rotate-3", "-rotate-3", "rotate-1", "-rotate-1"];
const TAPES = ["bg-yellow-200/50", "bg-blue-200/50", "bg-pink-200/50"];

export default function AlbumPage() {
  const router = useRouter();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const data = await memoryService.getAllMemories();
        setMemories(data);
      } catch (error) {
        console.error("Lỗi lấy ảnh:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMemories();
  }, []);

  // ---> HIỆU ỨNG RƠI ẢNH (CHỐNG LỖI TÀNG HÌNH & CHỐNG LAG) <---
  useGSAP(() => {
    if (!isLoading && memories.length > 0) {
      gsap.fromTo(".memory-item", 
        { y: -100, opacity: 0 },
        {
          y: 0,
          opacity: 1, 
          duration: 0.7, 
          stagger: 0.05, 
          ease: "back.out(1)",
          clearProps: "y,transform", // Dọn dẹp sau khi rơi
          force3D: true // Ép phần cứng GPU xử lý
        }
      );
    }
  }, { scope: mainRef, dependencies: [isLoading, memories] });

  // ---> HIỆU ỨNG QUAY VỀ MẶT BÀN (MÀN CHE TRÌ HOÃN) <---
  const handleBackToDesk = () => {
    // 1. Tạo màn che cùng màu với mặt bàn (Đổi bg-[#2C3A31] thành bg-[#D7C9AA])
    const deskOverlay = document.createElement("div");
    deskOverlay.className = "fixed inset-0 bg-[#D7C9AA] z-[9999] opacity-0 pointer-events-none";
    document.body.appendChild(deskOverlay);

    // 2. Làm mờ mọi thứ vào mặt bàn
    gsap.to(deskOverlay, {
      opacity: 1,
      duration: 0.4,
      ease: "power2.inOut",
      onComplete: () => {
        // 3. Đã che kín -> Push về Desk
        router.push("/?from=album");
        
        // 4. Mờ dần màn che để lộ đồ vật trên Desk
        gsap.to(deskOverlay, { 
          opacity: 0, 
          duration: 0.6, 
          delay: 0.2, 
          ease: "power2.inOut", 
          onComplete: () => deskOverlay.remove() 
        });
      }
    });
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (evt: WheelEvent) => {
      // Chỉ can thiệp (chuyển dọc thành ngang) nếu người dùng đang lăn chuột DỌC
      if (Math.abs(evt.deltaY) > Math.abs(evt.deltaX)) {
        evt.preventDefault();
        container.scrollLeft += evt.deltaY;
      }
      // NẾU NGƯỜI DÙNG CUỘN NGANG (Touchpad 2 ngón, Shift + Scroll chuột):
      // -> Không làm gì cả (Không preventDefault). Để trình duyệt tự cuộn ngang một cách mượt mà theo bản năng của nó!
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [isLoading]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  };

  return (
    <main ref={mainRef} className="min-h-screen overflow-hidden flex flex-col font-display selection:bg-[#E8F08C] selection:text-ink relative bg-[#D7C9AA]">
      <style>{`
        .bg-texture-wood { background-image: repeating-linear-gradient(90deg, rgba(139,69,19,0.05) 0px, rgba(139,69,19,0.05) 1px, transparent 1px, transparent 20px), repeating-linear-gradient(0deg, rgba(139,69,19,0.03) 0px, rgba(139,69,19,0.03) 1px, transparent 1px, transparent 40px); }
        .washi-tape { background-color: rgba(255, 255, 255, 0.4); backdrop-filter: blur(2px); box-shadow: 0 1px 2px rgba(0,0,0,0.1); }
        .washi-tape-patterned { background-image: repeating-linear-gradient(-45deg, transparent, transparent 5px, rgba(255,255,255,0.4) 5px, rgba(255,255,255,0.4) 10px); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Decor */}
      <div className="absolute inset-0 bg-texture-wood pointer-events-none z-0 transform-gpu" />
      <div className="absolute bottom-10 left-20 w-64 h-64 rounded-full border-[12px] border-[#8B4513]/10 blur-sm pointer-events-none z-0 transform-gpu hidden md:block" />
      <div className="absolute top-20 right-40 w-48 h-48 rounded-full border-[8px] border-[#8B4513]/5 blur-md pointer-events-none z-0 transform-gpu hidden md:block" />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 p-4 md:p-6 flex justify-between items-start pointer-events-none transform-gpu">
        <button 
          onClick={handleBackToDesk} // ---> Gắn sự kiện quay về
          className="pointer-events-auto group flex items-center gap-2 bg-[#FDFBF7] px-3 md:px-4 py-2 shadow-[2px_2px_0px_rgba(0,0,0,0.1)] transform -rotate-1 hover:rotate-0 hover:scale-105 transition-[transform,shadow] duration-300 border border-gray-200 will-change-transform"
        >
          <span className="material-symbols-outlined text-lg md:text-xl text-ink">arrow_back</span>
          <span className="font-display font-bold text-xs md:text-sm tracking-wide text-ink">BACK TO DESK</span>
        </button>

        <div className="hidden md:flex flex-col items-end pointer-events-auto">
          <div className="bg-white px-4 py-3 shadow-[2px_2px_0px_rgba(0,0,0,0.1)] rotate-1 border border-gray-100 max-w-xs relative transform-gpu">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 washi-tape bg-[#C1E4FF]/70 opacity-80 rotate-2" />
            <h1 className="font-stamp text-xl text-ink mb-1">Memories of You</h1>
            <p className="font-hand text-gray-500 text-lg leading-none text-right">~ Since 2026 ~</p>
          </div>
        </div>
      </header>

      {/* Nút lướt (ẩn khi đang tải) */}
      {!isLoading && memories.length > 0 && (
        <>
          <button onClick={() => scrollContainerRef.current?.scrollBy({ left: -400, behavior: 'smooth' })} className="fixed left-4 md:left-8 top-1/2 -translate-y-1/2 z-50 hidden md:flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-[#FDFBF7] border border-gray-200 shadow-[0_4px_15px_rgba(0,0,0,0.15)] rounded-full hover:bg-white hover:scale-110 hover:shadow-xl transition-[transform,shadow,background-color] group will-change-transform transform-gpu">
            <span className="material-symbols-outlined text-3xl md:text-4xl text-ink/70 group-hover:text-ink transition-colors">chevron_left</span>
          </button>
          <button onClick={() => scrollContainerRef.current?.scrollBy({ left: 400, behavior: 'smooth' })} className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 hidden md:flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-[#FDFBF7] border border-gray-200 shadow-[0_4px_15px_rgba(0,0,0,0.15)] rounded-full hover:bg-white hover:scale-110 hover:shadow-xl transition-[transform,shadow,background-color] group will-change-transform transform-gpu">
            <span className="material-symbols-outlined text-3xl md:text-4xl text-ink/70 group-hover:text-ink transition-colors">chevron_right</span>
          </button>
        </>
      )}

      {/* Vùng Cuộn Chứa Ảnh */}
      <div className="flex-1 flex items-center relative w-full h-screen z-10">
        <div ref={scrollContainerRef} className="w-full h-full overflow-x-auto overflow-y-hidden no-scrollbar flex items-center px-[5vw] md:px-[10vw] gap-12 md:gap-32 snap-x snap-mandatory py-10 will-change-scroll transform-gpu">
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center w-full gap-4 text-ink/50 opacity-80">
               <span className="material-symbols-outlined text-4xl animate-spin">hourglass_empty</span>
               <div className="font-mono tracking-widest animate-pulse">Đang tìm lại ký ức...</div>
            </div>
          ) : memories.length === 0 ? (
            <div className="flex w-full justify-center text-ink/50 font-hand text-2xl">Album này vẫn còn trống... Hãy chụp thêm vài bức ảnh nhé!</div>
          ) : (
            memories.map((mem, index) => {
              const rotateClass = ROTATIONS[index % ROTATIONS.length];
              
              if (mem.image_url) {
                const tapeColor = TAPES[index % TAPES.length];
                return (
                  // Gắn class memory-item và opacity-0 cho GSAP điều khiển
                  <div key={mem.id} className="memory-item snap-center shrink-0 relative group flex justify-center items-center opacity-0 will-change-transform transform-gpu">
                    <div className={`relative bg-white p-3 md:p-4 pb-12 md:pb-16 shadow-[5px_5px_15px_rgba(0,0,0,0.15)] transform ${rotateClass} group-hover:rotate-0 group-hover:scale-[1.02] transition-[transform,scale] duration-500 ease-out border border-gray-100 inline-block`}>
                      <div className={`absolute -top-4 left-1/2 -translate-x-1/2 w-20 md:w-24 h-6 md:h-8 washi-tape ${tapeColor} -rotate-2 z-10`} />
                      
                      <div className="bg-gray-100 overflow-hidden mb-3 md:mb-4 grayscale-[0.2] group-hover:grayscale-0 transition-[filter] duration-700 flex justify-center items-center transform-gpu">
                      <img 
                        src={mem.image_url.startsWith('http') ? mem.image_url : `${BACKEND_URL}${mem.image_url}`} 
                        alt="Memory" 
                        loading="lazy" 
                        decoding="async" 
                        className="w-auto h-auto max-w-[80vw] md:max-w-[400px] max-h-[50vh] md:max-h-[60vh] object-contain block transform-gpu" 
                      />
                      </div>
                      
                      <div className="font-hand text-xl md:text-2xl text-ink text-center leading-tight px-2 break-words break-all max-w-[80vw] md:max-w-[400px]">{mem.caption}</div>
                      <div className="font-stamp text-[10px] md:text-xs text-gray-400 absolute bottom-2 right-3 md:bottom-3 md:right-4">{formatDate(mem.memory_date)}</div>
                    </div>
                  </div>
                );
              } else {
                const noteColor = NOTE_COLORS[index % NOTE_COLORS.length];
                return (
                  <div key={mem.id} className="memory-item snap-center shrink-0 relative pt-12 opacity-0 will-change-transform transform-gpu">
                    <div className={`${noteColor} shadow-[2px_2px_0px_rgba(0,0,0,0.1)] w-[240px] md:w-[280px] min-h-[240px] p-6 flex flex-col justify-center items-center transform ${rotateClass} hover:rotate-0 transition-transform duration-300 relative`}>
                      <div className="absolute -top-3 right-8 w-16 h-6 washi-tape washi-tape-patterned rotate-45 opacity-80" />
                      <p className="font-hand text-2xl md:text-3xl text-ink text-center leading-relaxed whitespace-pre-line break-words break-all max-w-full">"{mem.caption}"</p>
                      <div className="mt-6 w-full text-right font-stamp text-[10px] md:text-xs text-gray-500 opacity-70">{formatDate(mem.memory_date)}</div>
                    </div>
                  </div>
                );
              }
            })
          )}
          
          <div className="shrink-0 w-[5vw] md:w-[10vw]" />
        </div>
      </div>
    </main>
  );
}