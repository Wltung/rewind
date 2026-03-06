"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onComplete: () => void;
}

export default function EnvelopeTransition({ onComplete }: Props) {
  // Thêm trạng thái "breaking-seal" để tách biệt 2 hành động: Vỡ sáp -> Mở nắp
  const [sequence, setSequence] = useState<"arrival" | "breaking-seal" | "opening" | "revealing-book" | "completed">("arrival");

  useEffect(() => {
    // 1. Phong bì trượt vào bàn (chờ 1.5s)
    const t1 = setTimeout(() => setSequence("breaking-seal"), 1500);
    // 2. Dấu sáp biến mất (chờ 0.6s cho animation vỡ sáp chạy xong)
    const t2 = setTimeout(() => setSequence("opening"), 2100);
    // 3. Nắp thư lật lên 180 độ (chờ 1.1s cho nắp mở xong)
    const t3 = setTimeout(() => setSequence("revealing-book"), 3200);
    // 4. Sách chui ra ngoài, phóng to, phong bì rớt xuống
    const t4 = setTimeout(() => {
      setSequence("completed");
      setTimeout(onComplete, 100); 
    }, 5400);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onComplete]);

  // Texture nhiễu giấy
  const paperNoise = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJmIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjY1IiBudW1PY3RhdmVzPSIzIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2YpIiBvcGFjaXR5PSIu0DUiLz48L3N2Zz4=";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center perspective-[2500px] pointer-events-none">
      
      {/* KHỐI TỔNG: Trượt vào */}
      <motion.div
        className="relative w-[340px] h-[220px] md:w-[500px] md:h-[320px]"
        initial={{ y: "100vh", rotateZ: -5 }}
        animate={{ y: 0, rotateZ: 0 }}
        transition={{ duration: 1.2, type: "spring", bounce: 0.2 }}
      >
        
        {/* ========================================================== */}
        {/* LỚP Z-0: HÌNH CHỮ NHẬT LƯNG PHONG BÌ                           */}
        {/* ========================================================== */}
        <motion.div
          className="absolute inset-0 bg-[#ebdcc2] rounded-sm shadow-xl border border-[#d4c5b0] z-0"
          style={{ backgroundImage: `url(${paperNoise})` }}
          animate={ sequence === "revealing-book" || sequence === "completed" ? { y: "100vh", opacity: 0, rotateZ: -15 } : { y: 0, opacity: 1, rotateZ: 0 } }
          transition={{ duration: 1.2, ease: "easeInOut", delay: sequence === "revealing-book" ? 0.8 : 0 }} 
        ></motion.div>


        {/* ========================================================== */}
        {/* LỚP Z-10: CUỐN SÁCH NẰM GỌN GÀNG Ở TRONG                     */}
        {/* ========================================================== */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-[400px] md:w-[450px] h-[550px] md:h-[600px] bg-gradient-to-br from-[#5c3a21] to-[#3a2210] rounded-r-2xl rounded-l-sm border-l-[12px] border-[#2a170a] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center"
          initial={{ x: "-50%", y: "-50%", scale: 0.35, zIndex: 10 }}
          animate={
            sequence === "revealing-book" || sequence === "completed" ?
            { 
              y: ["-50%", "-150%", "-50%"], // Nhảy vọt lên trên khỏi miệng phong bì, rồi đáp xuống giữa lại
              scale: [0.35, 1, 1],       // Giữ nhỏ khi chui qua miệng, thoát ra rồi mới bự lên
              zIndex: [10, 50, 20]          // CÚ LỪA THỊ GIÁC: Khi sách nhảy lên điểm cao nhất, Z-Index lập tức nhảy lên 50 để lúc rớt xuống nó nằm ngoài phong bì!
            } : 
            { x: "-50%", y: "-50%", scale: 0.35, zIndex: 10 }
          }
          transition={{ duration: 2, times: [0, 0.4, 1], ease: "easeInOut" }}
        >
          {/* Giao diện bìa sổ */}
          <div className="absolute inset-0 rounded-r-2xl opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8Y2lyY2xlIGN4PSIyIiBjeT0iMiIgcj0iMSIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjEiLz4KPC9zdmc+')]"></div>
          <div className="absolute inset-2 md:inset-4 border border-dashed border-[#8b5a33] rounded-r-xl opacity-40"></div>
          <div className="absolute bottom-20 left-10 md:left-16 w-60 min-h-[160px] bg-[#fdf08c] shadow-[4px_5px_15px_rgba(0,0,0,0.4)] -rotate-3 p-5 flex flex-col justify-center border border-[#e8df7b] z-20 backface-hidden">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-20 h-8 bg-white/40 backdrop-blur-[2px] shadow-sm rotate-[4deg] border border-white/20" style={{ clipPath: "polygon(0 10%, 100% 0, 95% 100%, 5% 90%)" }}></div>
            <p className="text-[#2c3e50] text-xl md:text-2xl text-center font-['Caveat'] font-bold leading-relaxed">Chạm nhẹ vào đây để mở món quà nhỏ dành riêng cho em</p>
            <div className="absolute bottom-2 right-2 text-[#d14f4f] opacity-80"><span className="material-symbols-outlined text-2xl">favorite</span></div>
          </div>
          <div className="absolute top-1/2 -right-8 -translate-y-1/2 w-12 h-16 bg-gradient-to-r from-[#3a2210] to-[#2a1a10] shadow-lg rounded-r-md -z-10 border-y border-black backface-hidden"></div>
          <div className="absolute top-1/2 right-2 md:right-4 -translate-y-1/2 w-16 h-16 bg-[#2a1a10] rounded-full shadow-[inset_2px_2px_6px_rgba(255,255,255,0.1),_4px_5px_10px_rgba(0,0,0,0.6)] flex items-center justify-center border border-[#1a0f07] backface-hidden">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-300 to-zinc-500 shadow-[inset_1px_1px_3px_rgba(255,255,255,0.8),_2px_2px_5px_rgba(0,0,0,0.8)] border border-zinc-600 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-zinc-400 to-zinc-600 shadow-inner"></div>
            </div>
          </div>
        </motion.div>


        {/* ========================================================== */}
        {/* LỚP Z-20: 3 TAM GIÁC MẶT TRƯỚC (Che khuất cuốn sách)         */}
        {/* ========================================================== */}
        <motion.div
          className="absolute inset-0 z-20"
          animate={ sequence === "revealing-book" || sequence === "completed" ? { y: "100vh", opacity: 0, rotateZ: -15 } : { y: 0, opacity: 1, rotateZ: 0 } }
          transition={{ duration: 1.2, ease: "easeInOut", delay: sequence === "revealing-book" ? 0.8 : 0 }}
        >
          {/* Tam giác trái */}
          <div className="absolute inset-0 bg-[#e8eed2] drop-shadow-sm border-r border-[#d4c5b0]" style={{ backgroundImage: `url(${paperNoise})`, clipPath: "polygon(0 0, 0 100%, 50% 50%)" }}></div>
          {/* Tam giác phải */}
          <div className="absolute inset-0 bg-[#e8eed2] drop-shadow-sm border-l border-[#d4c5b0]" style={{ backgroundImage: `url(${paperNoise})`, clipPath: "polygon(100% 0, 100% 100%, 50% 50%)" }}></div>
          {/* Tam giác dưới */}
          <div className="absolute inset-0 bg-[#fcf9f2] drop-shadow-md border-t border-[#d4c5b0]" style={{ backgroundImage: `url(${paperNoise})`, clipPath: "polygon(0 100%, 100% 100%, 50% 50%)" }}></div>

        </motion.div>
        {/* ========================================================== */}
          {/* LỚP Z-30: TAM GIÁC NẮP TRÊN (MỞ 180 ĐỘ)                      */}
          {/* ========================================================== */}
          <motion.div
            className="absolute top-0 left-0 w-full h-[60%] origin-top preserve-3d z-10"
            initial={{ rotateX: 0, y: 0, opacity: 1, rotateZ: 0 }}
            animate={{
              rotateX:
                sequence === "opening" ||
                sequence === "revealing-book" ||
                sequence === "completed"
                  ? 180
                  : 0,

              y:
                sequence === "revealing-book" || sequence === "completed"
                  ? "100vh"
                  : 0,

              opacity:
                sequence === "revealing-book" || sequence === "completed"
                  ? 0
                  : 1,

              rotateZ:
                sequence === "revealing-book" || sequence === "completed"
                  ? -15
                  : 0
            }}
            transition={{
              rotateX: { duration: 1, ease: "easeInOut" },
              y: {
                duration: 1.2,
                ease: "easeInOut",
                delay: sequence === "revealing-book" ? 0.8 : 0
              },
              opacity: {
                duration: 1.2,
                delay: sequence === "revealing-book" ? 0.8 : 0
              },
              rotateZ: {
                duration: 1.2,
                delay: sequence === "revealing-book" ? 0.8 : 0
              }
            }}
          >
            {/* MẶT NGOÀI NẮP TRÊN (Tam giác chĩa xuống) */}
            <div className="absolute inset-0 bg-[#f5e6e7] backface-hidden border-b border-[#e8dfcc]" style={{ backgroundImage: `url(${paperNoise})`, clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}></div>

            {/* MẶT TRONG NẮP TRÊN (Lúc lật ngược lên thì sẽ thành hình tam giác chĩa lên trời) */}
            <div className="absolute inset-0 bg-[#ebdcc2] backface-hidden" style={{ backgroundImage: `url(${paperNoise})`, clipPath: "polygon(0 0, 100% 0, 50% 100%)", transform: "rotateY(180deg)" }}></div>
          </motion.div>

        {/* ========================================================== */}
        {/* LỚP Z-40: DẤU SÁP (Nằm đè lên che hết cả 4 đỉnh tam giác)    */}
        {/* ========================================================== */}
        <AnimatePresence>
          {sequence === "arrival" && (
            <div className="absolute inset-0 flex items-center justify-center z-40">
              <motion.div
                className="w-16 h-16 md:w-20 md:h-20 bg-[#9b2c2c] rounded-full shadow-[inset_0_0_12px_rgba(0,0,0,0.6),_0_5px_10px_rgba(0,0,0,0.4)] flex items-center justify-center border-[1.5px] border-[#7a0d17] z-40 overflow-hidden"
                initial={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.5, filter: "blur(5px)", transition: { duration: 0.5 } }}
              >
                <div className="w-[85%] h-[85%] border-2 border-dashed border-[#7a0d17]/50 rounded-full flex items-center justify-center">
                  <span className="text-[#f4a4ad]/80 font-serif font-extrabold italic text-3xl md:text-5xl leading-none relative -top-0.5 md:-top-1">N</span>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
}