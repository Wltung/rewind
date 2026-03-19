"use client";

import Link from "next/link";
import React, { useState, useEffect, useRef } from "react"; // ---> THÊM USEREF
import gsap from "gsap"; // ---> IMPORT GSAP
import { useGSAP } from "@gsap/react"; // ---> IMPORT USEGSAP

const MESSAGES = [
  "Hey, cô bạn nhỏ.",
  "Dạo này thế nào rồi?",
  "Chắc là mệt lắm đúng không.",
  "Thấy đèn học bật muộn mãi...",
  "Nhưng mà nè...",
  "Em đang làm rất tốt.",
  "Thật đấy.",
  "Đừng quá khắt khe với bản thân nhé.",
  "Thi cử quan trọng thật...",
  "Nhưng sức khỏe thì quan trọng hơn.",
  "Ngủ sớm một chút.",
  "Ăn ngon một chút.",
  "Và nhớ là...",
  "Luôn có người ở đây ủng hộ mà.",
  "8/3 vui vẻ nhé, Nàng Thơ."
];

interface IntroSequenceProps {
  onPlayAudio: () => void;
  // Sửa complete nhảy stage 2
  onComplete: () => void; 
}

export default function IntroSequence({ onPlayAudio, onComplete }: IntroSequenceProps) {
  const [step, setStep] = useState<"drift" | "whisper" | "fading-out">("drift");
  const [currentFrame, setCurrentFrame] = useState(0);
  const [messageOpacity, setMessageOpacity] = useState(0);

  // ---> THÊM REFS CHUYỂN CẢNH <---
  const containerRef = useRef<HTMLDivElement>(null);
  const driftRef = useRef<HTMLDivElement>(null);

  const handlePlay = () => {
    onPlayAudio();
    setStep("whisper");
  };

  // ---> HÀM BỎ QUA <---
  const handleSkip = () => {
    onPlayAudio(); // Vẫn bật nhạc
    setStep("fading-out");
    setTimeout(() => onComplete(), 1000); // nhảy thẳng stage 2
  };

  // ---> HIỆU ỨNG NÚT DRIFT XUẤT HIỆN TỪ TỪ <---
  useGSAP(() => {
    if (step === "drift") {
      // 1. Giấu division drift đi trước
      gsap.set(driftRef.current, { opacity: 0, scale: 0.95 });

      // 2. Fade in chậm rãi với độ trễ (delay)
      gsap.to(driftRef.current, {
        opacity: 1,
        scale: 1,
        duration: 1.25, // Tăng thời gian fade-in (2.5s) cho lãng mạn
        ease: "power2.inOut",
        delay: 0.8, // Đợi Next.js load xongDOM (0.6s) + rèm mờ dần (0.2s)
      });
    }
  }, { scope: containerRef, dependencies: [step] }); // Thêm dep step để hook chạy lại khi chuyển drift

  // Logic chạy chữ whisper giữ nguyên
  useEffect(() => {
    if (step !== "whisper") return;

    if (currentFrame < MESSAGES.length) {
      setMessageOpacity(1);

      const fadeOutTimer = setTimeout(() => {
        setMessageOpacity(0);
      }, 3500);

      const nextFrameTimer = setTimeout(() => {
        setCurrentFrame((prev) => prev + 1);
      }, 4000);

      return () => {
        clearTimeout(fadeOutTimer);
        clearTimeout(nextFrameTimer);
      };
    } else {
      setMessageOpacity(1);
      
      const endTimer = setTimeout(() => {
        setStep("fading-out");
        setTimeout(() => onComplete(), 1000);
      }, 4000);
      
      return () => clearTimeout(endTimer);
    }
  }, [currentFrame, step, onComplete]);

  return (
    <div 
      ref={containerRef} // ---> GẮN CONTAINERREF
      className={`fixed inset-0 z-[150] flex items-center justify-center font-body text-[#4A4A6A] transition-opacity duration-1000 ${
        step === "fading-out" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="absolute -inset-[500px] bg-[#E6E6FA] -z-20"></div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 blur-[80px] opacity-60">
        <div className="absolute top-[10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#FFD1DC] animate-blob"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#B0E0E6] animate-blob-delayed"></div>
      </div>

      {step === "drift" && (
        // ---> ĐÃ XÓA TẤT CẢ ANIMATION TAILWIND VÀ GẮN DRIFTREF Ở ĐÂY <---
        <div ref={driftRef} className="text-center">
          
          <div className="flex justify-center items-center gap-8 mb-6">
            <div className="flex flex-col items-center gap-3">
              <button
                onClick={handlePlay}
                className="w-20 h-20 rounded-full border border-white/50 glass-panel flex justify-center items-center hover:scale-110 hover:bg-white/20 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.5)]"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#4A4A6A" className="ml-1">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
              <p className="font-['Lora'] italic text-sm font-medium tracking-wide opacity-80">Mở thư</p>
            </div>

            <div className="flex flex-col items-center gap-3">
              <button
                onClick={handleSkip}
                className="w-20 h-20 rounded-full border border-white/50 glass-panel flex justify-center items-center hover:scale-110 hover:bg-white/20 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.5)]"
              >
                <span className="material-symbols-outlined text-[32px] text-[#4A4A6A]">skip_next</span>
              </button>
              <p className="font-['Lora'] italic text-sm font-medium tracking-wide opacity-80">Bỏ qua</p>
            </div>

          </div>

          <p className="font-['Lora'] italic text-sm font-medium tracking-wide opacity-50 mt-2">
            (Bấm Bỏ qua nhảy tới sách luôn nha!)
          </p>
        </div>
      )}

      {step === "whisper" && (
        <div className="text-center max-w-2xl px-6 w-full">
          {currentFrame < MESSAGES.length ? (
            <div
              className="font-['Lora'] text-3xl md:text-4xl italic transition-all duration-1000 ease-in-out text-[#4A4A6A]"
              style={{
                opacity: messageOpacity,
                transform: `translateY(${messageOpacity === 1 ? "0" : "20px"})`,
              }}
            >
              {MESSAGES[currentFrame]}
            </div>
          ) : (
            <div
              className="transition-all duration-1000 ease-in-out"
              style={{
                opacity: messageOpacity,
                transform: `translateY(${messageOpacity === 1 ? "0" : "20px"})`,
              }}
            >
              <h2 className="font-['Lora'] text-3xl md:text-4xl italic mb-4 text-[#4A4A6A]">Hãy cười nhiều lên nhé.</h2>
              <p className="font-['Baloo_2'] text-xl font-medium text-[#4A4A6A]/80">Cố lên! You got this.</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
}