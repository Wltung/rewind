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
  onComplete: () => void;
}

export default function IntroSequence({ onPlayAudio, onComplete }: IntroSequenceProps) {
  const [step, setStep] = useState<"gate" | "drift" | "whisper" | "fading-out">("gate");
  const [currentFrame, setCurrentFrame] = useState(0);
  const [messageOpacity, setMessageOpacity] = useState(0);

  // Xử lý khi nhập đúng mật khẩu
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "3001") {
      setTimeout(() => setStep("drift"), 500);
    }
  };

  // Xử lý khi bấm nút Play
  const handlePlay = () => {
    onPlayAudio();
    setStep("whisper");
  };

  // Logic chạy chữ tự động
  useEffect(() => {
    if (step !== "whisper") return;

    if (currentFrame < MESSAGES.length) {
      // Fade in chữ
      setMessageOpacity(1);

      // Đợi 3.5s rồi fade out chữ để chuẩn bị đổi câu
      const fadeOutTimer = setTimeout(() => {
        setMessageOpacity(0);
      }, 3500);

      // Đổi sang câu tiếp theo sau 4s
      const nextFrameTimer = setTimeout(() => {
        setCurrentFrame((prev) => prev + 1);
      }, 4000);

      return () => {
        clearTimeout(fadeOutTimer);
        clearTimeout(nextFrameTimer);
      };
    } else {
      // Khi đã chạy hết mảng chữ
      setMessageOpacity(1);
      
      // Đợi 4 giây hiển thị câu chốt rồi bắt đầu fade out toàn bộ Intro
      const endTimer = setTimeout(() => {
        setStep("fading-out");
        // Sau 1s mờ dần thì gọi onComplete để mở Sổ tay
        setTimeout(onComplete, 1000);
      }, 4000);
      
      return () => clearTimeout(endTimer);
    }
  }, [currentFrame, step, onComplete]);

  return (
    <div 
      // Xóa bg-[#E6E6FA] ở đây để lớp khung không bị giới hạn bởi viền an toàn nữa
      className={`fixed inset-0 z-[150] flex items-center justify-center font-body text-[#4A4A6A] transition-opacity duration-1000 ${
        step === "fading-out" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* 💥 HACK SAFARI: Tấm nền siêu to khổng lồ bành trướng ra ngoài 500px để che đứt mọi khe hở */}
      <div className="absolute -inset-[500px] bg-[#E6E6FA] -z-20"></div>

      {/* Background Mesh (Hai khối màu di chuyển mờ ảo ở -z-10, nổi trên nền tím) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 blur-[80px] opacity-60">
        <div className="absolute top-[10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#FFD1DC] animate-blob"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#B0E0E6] animate-blob-delayed"></div>
      </div>

      {/* STEP 1: Cổng Mật Khẩu */}
      {step === "gate" && (
        <div className="glass-panel p-10 rounded-[30px] text-center transition-all duration-800 animate-in fade-in zoom-in-95">
          <p className="font-['Lora'] italic text-lg opacity-80 font-medium tracking-wide mb-2">Một ngày đặc biệt của tháng 1...</p>
          <input
            type="text"
            onChange={handlePasswordChange}
            placeholder="DDMM"
            maxLength={4}
            className="bg-transparent border-b-2 border-[#4A4A6A]/30 font-mono text-3xl text-[#4A4A6A] text-center w-[150px] outline-none my-5 tracking-[8px] placeholder:text-[#4A4A6A]/20 transition-colors focus:border-[#4A4A6A]/80"
          />
        </div>
      )}

      {/* STEP 2: Lựa chọn Hành động (Drift) */}
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
              {/* <p className="font-['Lora'] italic text-sm font-medium tracking-wide opacity-80">Mở thư</p> */}
            </div>

            {/* NÚT 2: ĐÃ ĐƯỢC KHÓA LẠI (TẠM ẨN) */}
            {/* KHÔNG XÓA - CHỈ ẨN ĐI BẰNG CẶP DẤU {/* VÀ */} 
            {/* <div className="flex flex-col items-center gap-3">
              <Link href="/chapter-18">
                <button className="w-20 h-20 rounded-full border border-white/50 glass-panel flex justify-center items-center hover:scale-110 hover:bg-white/20 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.5)]">
                  <span className="material-symbols-outlined text-[32px] text-[#4A4A6A]">filter_vintage</span>
                </button>
              </Link>
              <p className="font-['Lora'] italic text-sm font-medium tracking-wide opacity-80">Hoa nở</p>
            </div> 
            */}

          </div>

          <p className="font-['Lora'] italic text-lg font-medium tracking-wide opacity-80 mt-4">Đeo tai nghe vào nhé</p>
        </div>
      )}

      {/* STEP 3: Dòng chảy tin nhắn (Whisper) */}
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