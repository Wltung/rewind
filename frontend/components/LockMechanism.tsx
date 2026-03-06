"use client";
import { useState, useEffect } from "react";

interface LockMechanismProps {
  correctPassword: string;
  onUnlock: () => void;
}

export default function LockMechanism({ correctPassword, onUnlock }: LockMechanismProps) {
  const [digits, setDigits] = useState([0, 0, 0, 0]);

  const updateDigit = (index: number) => {
    const newDigits = [...digits];
    newDigits[index] = (newDigits[index] + 1) % 10;
    setDigits(newDigits);
  };

  useEffect(() => {
    if (digits.join("") === correctPassword) {
      setTimeout(onUnlock, 500); // Đợi một chút để người dùng thấy số đúng
    }
  }, [digits, correctPassword, onUnlock]);

  return (
    <div className="flex gap-2 bg-gray-300 p-2 rounded shadow-inner border-t-2 border-gray-400">
      {digits.map((digit, idx) => (
        <button
          key={idx}
          onClick={() => updateDigit(idx)}
          className="w-8 h-12 bg-white flex items-center justify-center text-xl font-bold border-2 border-gray-400 rounded text-black hover:bg-gray-100 transition-colors"
        >
          {digit}
        </button>
      ))}
    </div>
  );
}