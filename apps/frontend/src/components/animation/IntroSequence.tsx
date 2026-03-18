"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";

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
  // Thêm tham số skipToBook để báo cho trang cha biết là nhảy thẳng tới sách
  onComplete: (skipToBook?: boolean) => void; 
}

export default function IntroSequence({ onPlayAudio, onComplete }: IntroSequenceProps) {
  const [step, setStep] = useState<"drift" | "whisper" | "fading-out">("drift");
  const [currentFrame, setCurrentFrame] = useState(0);
  const [messageOpacity, setMessageOpacity] = useState(0);

  // Xử lý khi bấm nút Play (Xem từ từ)
  const handlePlay = () => {
    onPlayAudio();
    setStep("whisper");
  };

  // ---> XỬ LÝ KHI BẤM NÚT SKIP (Nhảy thẳng tới sách) <---
  const handleSkip = () => {
    onPlayAudio(); // Vẫn bật nhạc bình thường
    setStep("fading-out");
    // Gọi onComplete với tham số true để bỏ qua bước phong bì
    setTimeout(() => onComplete(true), 1000);
  };

  // Logic chạy chữ tự động
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
        // Gọi onComplete(false) để mở phong bì tuần tự
        setTimeout(() => onComplete(false), 1000);
      }, 4000);
      
      return () => clearTimeout(endTimer);
    }
  }, [currentFrame, step, onComplete]);

  return (
    <div 
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
        <div className="text-center animate-in fade-in zoom-in duration-700">
          
          <div className="flex justify-center items-center gap-8 mb-6">
            {/* Nút 1: Mở thư cũ (Play Nhạc) */}
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

            {/* ---> NÚT 2: SKIP BỎ QUA <--- */}
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

          <p className="font-['Lora'] italic text-lg font-medium tracking-wide opacity-80 mt-4">
            Đeo tai nghe vào nhé
          </p>
          <p className="font-['Lora'] italic text-sm font-medium tracking-wide opacity-50 mt-2">
            (Xem nhiều chán rồi thì bấm Bỏ qua nhảy tới sách luôn nha!)
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