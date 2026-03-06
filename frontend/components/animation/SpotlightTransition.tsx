"use client";

import React, { useEffect, useState } from "react";

interface SpotlightTransitionProps {
  onComplete: () => void;
}

export default function SpotlightTransition({ onComplete }: SpotlightTransitionProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    // Phase 0: Bóng tối hoàn toàn (kéo dài 1.5s để người xem làm quen)
    const t1 = setTimeout(() => setPhase(1), 1500);
    // Phase 1: Đèn bật lên và lướt qua cây bút chì
    const t2 = setTimeout(() => setPhase(2), 3000);
    // Phase 2: Đèn di chuyển sang soi tấm ảnh Polaroid
    const t3 = setTimeout(() => setPhase(3), 4500);
    // Phase 3: Đèn lùi về trung tâm, chiếu sáng cuốn nhật ký
    const t4 = setTimeout(() => setPhase(4), 6500);
    // Phase 4: Ánh sáng lan tỏa ra toàn không gian rồi biến mất
    const t5 = setTimeout(() => {
      setPhase(5);
      onComplete();
    }, 8000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [onComplete]);

  // Nếu đã xong, ẩn component này đi
  if (phase === 5) return null;

  // Trạng thái bóng tối hoàn toàn hoặc đang mờ dần đi
  const isPitchBlack = phase === 0;
  const isFadingOut = phase === 4;

  // Cấu hình vị trí và kích thước luồng sáng cho từng Phase
  let x = "50%";
  let y = "50%";
  let size = "0px"; 

  if (phase === 1) {
    x = "30%"; // Vị trí gần cây bút chì
    y = "80%";
    size = "250px";
  } else if (phase === 2) {
    x = "25%"; // Vị trí tấm ảnh Polaroid
    y = "25%";
    size = "300px";
  } else if (phase === 3) {
    x = "50%"; // Trung tâm cuốn sổ
    y = "50%";
    size = "550px";
  } else if (phase === 4) {
    x = "50%";
    y = "50%";
    size = "150vw"; // Mở rộng chùm sáng ra toàn màn hình để fade out
  }

  return (
    <div
      className={`fixed inset-0 z-50 pointer-events-none overflow-hidden transition-opacity duration-1000 ${
        isFadingOut ? "opacity-0" : "opacity-100"
      }`}
      style={{ background: isPitchBlack ? "black" : "transparent" }}
    >
      {!isPitchBlack && (
        <>
          {/* Lớp áo tạo luồng sáng đèn (Spotlight Mask) */}
          <div
            className="absolute rounded-full transition-all ease-in-out pointer-events-none blur-[40px]"
            style={{
              width: size,
              height: size,
              left: x,
              top: y,
              transform: "translate(-50%, -50%)",
              boxShadow: "0 0 0 9999px rgba(0,0,0,0.95)", // Tạo màn đen bao quanh, chừa lỗ sáng
              background: "rgba(255, 220, 150, 0.15)", // Sắc vàng ấm áp của ánh đèn
              transitionDuration: "1500ms",
            }}
          />

          {/* Hạt bụi lơ lửng bên trong luồng sáng */}
          <div
            className="absolute rounded-full dust-particles pointer-events-none transition-all ease-in-out"
            style={{
              width: size,
              height: size,
              left: x,
              top: y,
              transform: "translate(-50%, -50%)",
              transitionDuration: "1500ms",
              // Cắt layer bụi sao cho chỉ lọt trong khu vực quầng sáng
              maskImage: "radial-gradient(circle, black 30%, transparent 70%)",
              WebkitMaskImage: "radial-gradient(circle, black 30%, transparent 70%)",
            }}
          />
        </>
      )}
    </div>
  );
}