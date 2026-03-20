"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // ---> THÊM ROUTER
import gsap from "gsap"; // ---> THÊM GSAP

// Components khung
import BookAnimation from "@/components/BookAnimation";
import EnvelopeTransition from "@/components/animation/EnvelopeTransition";
import DeskDecor from "@/components/animation/DeskDecor";
import { CoverFront, CoverBack } from "@/components/animation/BookCover";
import PageSpread from "@/components/animation/PageSpread";

// Content Module
import { FlowerFront, HeyYouBack } from "@/components/animation/content/Page1_Flower";
import { PlaneFront, MemoBack } from "@/components/animation/content/Page2_PlaneMemo";
import { BloomingCalendarPage } from "@/components/animation/content/Page3_Calendar";
import { MirrorFront, ElegantTextBack } from "@/components/animation/content/Page4_Mirror";
import { CheerfulTextBack, CheerfulSunFront } from "@/components/animation/content/Page5_Cheerful"; 
import { EncouragementTextBack, MountainFront } from "@/components/animation/content/Page6_Encouragement";
import { CelebrationTextBack, CelebrationBoxFront } from "@/components/animation/content/Page7_Celebration";
import IntroSequence from "@/components/animation/IntroSequence";

// BẢN GIAO HƯỞNG 7 TRANG
const bookPages = [
  { Front: (props: any) => <FlowerFront onNext={props.onNext} />, Back: () => <HeyYouBack /> },
  { Front: (props: any) => <PlaneFront onNext={props.onNext} isFlying={props.isFlying} />, Back: () => <MemoBack /> },
  { Front: (props: any) => <BloomingCalendarPage onNext={props.onNext} />, Back: () => <ElegantTextBack /> },
  { Front: (props: any) => <MirrorFront isShining={props.isFlying} onNext={props.onNext} />, Back: () => <CheerfulTextBack /> },
  { Front: (props: any) => <CheerfulSunFront isShining={props.isFlying} onNext={props.onNext} />, Back: () => <EncouragementTextBack /> },
  { Front: (props: any) => <MountainFront isShining={props.isFlying} onNext={props.onNext} />, Back: () => <CelebrationTextBack /> },
  { 
    Front: (props: any) => <CelebrationBoxFront isShining={props.isFlying} />, 
    Back: () => <PageSpread side="left"><div/></PageSpread> 
  }
];

export default function Home() {
  const router = useRouter(); // ---> KHỞI TẠO ROUTER
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const [stage, setStage] = useState<0 | 1 | 2 | 3>(0); 
  const [isFlipped, setIsFlipped] = useState(false); 
  const [isBookFullyOpen, setIsBookFullyOpen] = useState(false); 
  const [currentPage, setCurrentPage] = useState(0); 

  const [scale, setScale] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [isBookOpening, setIsBookOpening] = useState(false);
  const [isLandscapeReady, setIsLandscapeReady] = useState(false);
  const [isCameraZoomingOut, setIsCameraZoomingOut] = useState(true);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      const scaleX = window.innerWidth / 1024;
      const scaleY = window.innerHeight / 750;
      setScale(Math.min(scaleX, scaleY, 1));

      if (window.innerWidth > window.innerHeight || window.innerWidth >= 768) {
         setIsLandscapeReady(true);
      }
    };
    
    handleResize(); 
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (stage === 2) {
       const timer = setTimeout(() => setIsCameraZoomingOut(false), 50);
       return () => clearTimeout(timer);
    }
  }, [stage]);

  const handleOpenBook = () => {
    if (isFlipped) return;
    setIsFlipped(true);
    setIsBookOpening(true);

    if (audioRef.current) audioRef.current.play().catch((e) => console.log("Lỗi phát nhạc:", e));
    setTimeout(() => setIsBookFullyOpen(true), 1200);
  };

  // ---> HÀM GSAP KÉO RÈM TÍM VÀ QUAY VỀ DESK <---
  const handleReturnToDesk = () => {
    // 1. Tạo màn che màu Tím Nhạt (Khớp với màu của Desk)
    const exitOverlay = document.createElement("div");
    exitOverlay.className = "fixed inset-0 bg-[#E6E6FA] z-[9999] opacity-0 pointer-events-none";
    document.body.appendChild(exitOverlay);

    // 2. Kéo rèm kín màn hình
    gsap.to(exitOverlay, {
      opacity: 1,
      duration: 0.4,
      ease: "power2.inOut",
      onComplete: () => {
        // Tắt nhạc nền của trang sách (nếu audioRef của bạn tên khác thì đổi lại nhé)
        if (audioRef.current) {
          audioRef.current.pause();
        }

        // 3. Đẩy về Desk kèm cờ "envelope"
        router.push("/?from=envelope");
        
        // 4. Mờ dần màn che để lộ Desk
        gsap.to(exitOverlay, { 
          opacity: 0, 
          duration: 0.6, 
          delay: 0.2, 
          ease: "power2.inOut", 
          onComplete: () => exitOverlay.remove() 
        });
      }
    });
  };

  return (
    <main className="min-h-screen relative overflow-hidden flex items-center justify-center selection:bg-yellow-200 bg-[#c2a77d]"
          style={{ backgroundImage: "repeating-linear-gradient(to right, rgba(0,0,0,0.03) 0px, rgba(0,0,0,0.03) 2px, transparent 2px, transparent 15px), repeating-linear-gradient(to bottom, rgba(0,0,0,0.02) 0px, rgba(0,0,0,0.02) 1px, transparent 1px, transparent 30px)" }}>
      
      <audio ref={audioRef} src="/music/In_Love.mp3" loop />
      <div className="absolute inset-0 golden-hour-overlay pointer-events-none z-0"></div>
      <div className="absolute inset-0 noise-overlay pointer-events-none z-0"></div>

      {/* ---> NÚT BACK TO DESK (Chỉ hiện khi đã vào tới sách để không phá vỡ Intro) <--- */}
      <div className="fixed top-4 left-4 md:top-6 md:left-6 z-[9999]">
        <button 
          onClick={handleReturnToDesk} // ---> Gắn hàm vào đây
          className="pointer-events-auto group flex items-center gap-2 bg-[#FDFBF7]/90 backdrop-blur-sm px-2 py-1 text-sm shadow-[2px_2px_0px_rgba(0,0,0,0.15)] transform -rotate-1 hover:rotate-0 hover:scale-105 transition-[transform,shadow] duration-300 border border-[#d4c5a3]"
        >
          <span className="material-symbols-outlined text-lg md:text-xl text-[#4a3a22]">arrow_back</span>
          <span className="font-display font-bold text-xs md:text-sm tracking-wide text-[#4a3a22]">BACK TO DESK</span>
        </button>
      </div>

      {stage === 0 && (
        <IntroSequence
          onPlayAudio={() => {
            if (audioRef.current) {
              audioRef.current.play().catch((e) => console.log("Lỗi phát nhạc:", e));
            }
          }}
          onComplete={() => setStage(1)} 
        />
      )}

      {stage === 1 && isLandscapeReady && <EnvelopeTransition onComplete={() => setStage(2)} />}

      {stage >= 2 && (
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none z-10">
          
          <div className="relative w-[1024px] h-[750px] flex items-center justify-center pointer-events-auto"
               style={{ 
                 transform: mounted ? `scale(${isCameraZoomingOut ? scale * 1.4 : scale})` : "scale(1)", 
                 transformOrigin: "center center", 
                 transition: "transform 1.5s cubic-bezier(0.22, 1, 0.36, 1)" 
               }}>
            
            <DeskDecor />

            <BookAnimation 
               front={<CoverFront isFlipped={isFlipped} />} 
               back={<CoverBack />} 
               underneath={<PageSpread side="right"><div/></PageSpread>} 
               isFlipped={isFlipped}
               onFlip={handleOpenBook}
            />

            {isBookOpening && (
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[100]" style={{ transform: "translateZ(10px)", opacity: isBookFullyOpen ? 1 : 0, transition: "opacity 0.4s ease" }}>
                  <div className="relative w-[800px] md:w-[900px] h-[550px] md:h-[600px] perspective-[2500px]">
                      
                      {bookPages.map((PageObj, index) => {
                         if (index < currentPage - 2 || index > currentPage + 1) return null;

                         const isPageFlipped = currentPage > index;
                         const zIndex = isPageFlipped ? 50 + index : 100 - index;

                         return (
                            <div
                               key={index}
                               className="absolute top-0 right-0 w-[400px] md:w-[450px] h-full origin-left preserve-3d pointer-events-auto"
                               style={{ 
                                  transform: isPageFlipped ? "rotateY(-180deg)" : "rotateY(0deg)",
                                  zIndex: zIndex,
                                  transition: isPageFlipped 
                                      ? "transform 1.2s cubic-bezier(0.645, 0.045, 0.355, 1), z-index 0s 0.6s" 
                                      : "transform 1.2s cubic-bezier(0.645, 0.045, 0.355, 1), z-index 0s 0s",
                                  willChange: "transform, z-index"
                               }}
                            >
                               <div className="absolute inset-0 backface-hidden" style={{ transform: "translateZ(2px)" }}>
                                  <PageObj.Front 
                                     onNext={() => setCurrentPage(index + 1)} 
                                     isFlying={currentPage === index} 
                                  />
                               </div>
                               
                               <div className="absolute inset-0 backface-hidden" style={{ transform: "rotateY(180deg) translateZ(2px)" }}>
                                  <PageObj.Back />
                               </div>
                            </div>
                         )
                      })}

                  </div>
               </div>
            )}

          </div>
        </div>
      )}
    </main>
  );
}