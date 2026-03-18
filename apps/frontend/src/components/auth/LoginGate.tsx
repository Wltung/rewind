"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

interface LoginGateProps {
  onSuccess: () => void;
}

export default function LoginGate({ onSuccess }: LoginGateProps) {
  const [passcode, setPasscode] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const { login } = useAuth();

  useEffect(() => {
    sessionStorage.removeItem("hasSeenDeskIntro");
    
    if (passcode.length === 4 && !isSuccess && !isError) {
      handleAuthenticate(passcode);
    }
  }, [passcode, isSuccess, isError]);

  const handleAuthenticate = async (code: string) => {
    const success = await login({ password: code });

    if (success) {
      setIsSuccess(true);
      // Đợi 0.3s để người dùng kịp nhìn thấy số đúng, sau đó bắt đầu mờ đi
      setTimeout(() => setIsFadingOut(true), 300);
      setTimeout(() => onSuccess(), 1500);
    } else {
      setIsError(true);
      setTimeout(() => {
        setIsError(false);
        setPasscode("");
        inputRef.current?.focus();
      }, 600);
    }
  };
  

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500&family=Noto+Serif:wght@500&display=swap');
        @keyframes error-shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-8px); }
          40%, 80% { transform: translateX(8px); }
        }
        .animate-error-shake {
          animation: error-shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>

      <div 
        className="fixed inset-0 z-[200] flex items-center justify-center bg-[#2C3A31] overflow-hidden"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
        </div>

        {/* HIỆU ỨNG THOÁT: Ổ khóa từ từ phóng to (scale-110), mờ đi (opacity-0) và nhòe dần (blur-md) */}
        <div className={`relative z-10 flex flex-col items-center max-w-md w-full px-6 transition-all duration-1000 ease-in-out origin-center ${
          isFadingOut ? "scale-110 opacity-0 blur-md pointer-events-none" : "scale-100 opacity-100"
        }`}>
          
          <div className="bg-[#F4EFE6] shadow-[0_4px_10px_rgba(0,0,0,0.3)] rounded-sm p-4 pb-12 mb-[-32px] relative z-0 w-64 -rotate-2 translate-y-2 border border-[#e2d5c3]">
            <div className="absolute inset-0 opacity-20 pointer-events-none rounded-sm"
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.5' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`}}>
            </div>
            <p className="font-['Caveat',_cursive] text-[#8C8477] text-[26px] text-center leading-tight pt-2 opacity-90">
              For my eyes only...
            </p>
          </div>

          <div className={`bg-[linear-gradient(135deg,#e0c89c_0%,#C5A880_40%,#a68453_100%)] p-5 rounded-md shadow-[0_10px_25px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.3)] relative z-10 border border-[#d4b992] flex flex-col items-center transition-transform ${isError ? 'animate-error-shake' : ''}`}>
            <div className="w-full flex justify-between px-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-[#8c6d40] shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)] relative flex items-center justify-center"><div className="w-full h-[1.5px] bg-[#4a3a22] rotate-45"></div></div>
              <div className="w-3 h-3 rounded-full bg-[#8c6d40] shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)] relative flex items-center justify-center"><div className="w-full h-[1.5px] bg-[#4a3a22] -rotate-12"></div></div>
            </div>

            <div className="flex gap-3 bg-[#1a1612] p-3 rounded-sm shadow-[inset_0_4px_8px_rgba(0,0,0,0.8)] border border-[#5c4a32] relative">
              <input
                ref={inputRef}
                type="tel"
                inputMode="numeric"
                maxLength={4}
                value={passcode}
                onChange={(e) => setPasscode(e.target.value.replace(/\D/g, ''))}
                disabled={isError || isSuccess}
                className="absolute opacity-0 w-0 h-0 z-[-1]"
                autoFocus
              />
              {[0, 1, 2, 3].map((index) => {
                const hasValue = index < passcode.length;
                const value = hasValue ? passcode[index] : "0";

                return (
                  <div key={index} className="relative w-12 h-16 sm:w-14 sm:h-20 bg-[#F4EFE6] rounded-sm shadow-[inset_0_4px_6px_rgba(0,0,0,0.4),inset_0_-2px_4px_rgba(255,255,255,0.5)] overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20 pointer-events-none"></div>
                    <span className={`font-['Noto_Serif',_serif] text-4xl sm:text-[40px] font-medium transition-colors ${hasValue ? "text-[#2B2724]" : "text-[#2B2724]/40"}`}>
                      {value}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="w-full flex justify-between px-2 mt-4">
              <div className="w-3 h-3 rounded-full bg-[#8c6d40] shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)] relative flex items-center justify-center"><div className="w-full h-[1.5px] bg-[#4a3a22] rotate-90"></div></div>
              <div className="w-3 h-3 rounded-full bg-[#8c6d40] shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)] relative flex items-center justify-center"><div className="w-full h-[1.5px] bg-[#4a3a22] rotate-0"></div></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}