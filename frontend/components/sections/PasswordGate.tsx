"use client";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { shakeVariant } from "@/lib/animation";

export default function PasswordGate({ correctPassword, onUnlock }: { correctPassword: string; onUnlock: () => void }) {
  const [digits, setDigits] = useState(["0", "0", "0", "0"]);
  const [isError, setIsError] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value || "0";
    setDigits(newDigits);
    
    // Tự động chuyển sang ô tiếp theo
    if (value && index < 3) inputRefs.current[index + 1]?.focus();
  };

  const handleVerify = () => {
    if (digits.join("") === correctPassword) {
      onUnlock();
    } else {
      setIsError(true);
      setTimeout(() => setIsError(false), 500);
    }
  };

  return (
    <motion.div 
      variants={shakeVariant}
      animate={isError ? "shake" : "idle"}
      className="w-20 h-52 bg-gradient-to-br from-zinc-200 to-zinc-400 rounded-sm shadow-[inset_2px_2px_6px_rgba(255,255,255,0.8),_8px_10px_20px_rgba(0,0,0,0.7)] flex flex-col items-center justify-between py-4 border border-zinc-500 z-30"
    >
      {/* Vít trang trí */}
      <div className="w-3 h-3 rounded-full bg-zinc-500 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.6)] flex items-center justify-center">
        <div className="w-full h-px bg-zinc-700 rotate-45"></div>
      </div>

      {/* Cụm ô nhập mã */}
      <div className="flex flex-col gap-1.5 bg-zinc-900 p-2 rounded shadow-[inset_0_3px_6px_rgba(0,0,0,0.8)] w-14 border border-zinc-700">
        {digits.map((digit, i) => (
          <div key={i} className="relative w-full h-8">
            <input
              ref={(el) => {
                inputRefs.current[i] = el
              }}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              className="w-full h-full text-center text-xl font-bold font-mono bg-gradient-to-b from-zinc-400 via-zinc-200 to-zinc-400 text-zinc-900 border-none rounded-sm focus:ring-1 focus:ring-yellow-500/50 outline-none p-0 select-all"
            />
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_5px_5px_-5px_rgba(0,0,0,0.8),inset_0_-5px_5px_-5px_rgba(0,0,0,0.8)]"></div>
          </div>
        ))}
      </div>

      {/* Nút bấm xác nhận */}
      <button 
        onClick={handleVerify}
        className="w-12 h-6 bg-zinc-400 rounded-sm shadow-[0_2px_4px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.8)] border border-zinc-500 active:translate-y-0.5 active:shadow-inner transition-all flex items-center justify-center"
      >
        <div className="w-6 h-1 bg-zinc-500 rounded-full"></div>
      </button>
    </motion.div>
  );
}