"use client";

import React from "react";
import { motion } from "framer-motion";

interface BookAnimationProps {
  front: React.ReactNode;
  back: React.ReactNode;
  underneath: React.ReactNode;
  isFlipped: boolean;
  onFlip?: () => void;
}

export default function BookAnimation({ front, back, underneath, isFlipped, onFlip }: BookAnimationProps) {
  return (
    <motion.div
      className="relative flex z-10"
      initial={{ x: "-25%" }} 
      animate={{ x: isFlipped ? "0%" : "-25%" }}
      transition={{ duration: 1.2, ease: [0.645, 0.045, 0.355, 1] }}
    >
      <div className="relative w-[800px] md:w-[900px] h-[550px] md:h-[600px] perspective-[2000px]">
        
        {/* TRANG NẰM CHỜ Ở DƯỚI */}
        <div className="absolute top-0 right-0 w-[400px] md:w-[450px] h-full z-0">
          {underneath}
        </div>

        {/* TRANG CÓ THỂ LẬT ĐƯỢC */}
        <motion.div
          onClick={!isFlipped ? onFlip : undefined}
          className={`absolute top-0 right-0 w-[400px] md:w-[450px] h-full z-10 origin-left preserve-3d ${!isFlipped ? 'cursor-pointer' : ''}`}
          initial={{ rotateY: 0 }}
          animate={{ rotateY: isFlipped ? -180 : 0 }}
          transition={{ duration: 1.2, ease: [0.645, 0.045, 0.355, 1] }}
        >
          {/* MẶT TRƯỚC CỦA TRANG */}
          <div 
            className="absolute inset-0" 
            style={{ 
              backfaceVisibility: "hidden", 
              WebkitBackfaceVisibility: "hidden", // Bắt buộc cho iOS/Safari
              transform: "translateZ(1px)" // Đẩy mặt trước lên 1px để không bị xuyên thấu
            }}
          >
            {front}
          </div>

          {/* MẶT SAU CỦA TRANG */}
          <div 
            className="absolute inset-0" 
            style={{ 
              backfaceVisibility: "hidden", 
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg) translateZ(1px)" // Đẩy mặt sau lên 1px để không bị xuyên thấu
            }}
          >
            {back}
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}