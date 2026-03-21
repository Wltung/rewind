"use client";

import { usePolaroid } from "@/hooks/usePolaroid";

import { Polaroid } from "@/types/polaroid";

import React, { useState, useEffect } from "react";

import { PolaroidUploadModal } from "./PolaroidUploadModal";

import { createPortal } from "react-dom";



interface GachaCard {

  id: string;

  image_url: string;

  caption: string;

  secret_message: string;

  date: string;

}



const BACKEND_URL = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:9001/api").replace('/api', '');



export function PolaroidGacha() {

  const [isGachaOpen, setIsGachaOpen] = useState(false);

  const [isGachaClosing, setIsGachaClosing] = useState(false);



  // ---> SỬ DỤNG TYPE MỚI <---

  const [currentMemory, setCurrentMemory] = useState<Polaroid | null>(null);

  

  const [isLoading, setIsLoading] = useState(true); 

  const [isFlipped, setIsFlipped] = useState(false);

  const [imageError, setImageError] = useState(false); 

  

  const [isUploadOpen, setIsUploadOpen] = useState(false);



  // === THÊM STATE TÍNH TOÁN ĐỘ THU PHÓNG (Copy đoạn này) ===

  const [displayScale, setDisplayScale] = useState(1);



  useEffect(() => {

    const handleResize = () => {

      const screenW = window.innerWidth;

      const screenH = window.innerHeight;

      

      // Kích thước gốc của cụm vật phẩm (Ảnh + Băng dính, chừa lề an toàn)

      const baseW = 400; 

      const baseH = 600; 



      const scaleX = screenW / baseW;

      const scaleY = screenH / baseH;

      

      // Lấy tỷ lệ nhỏ hơn để đảm bảo không bị cắt xén, nhân 0.9 để có viền an toàn

      let finalScale = Math.min(scaleX, scaleY) * 0.9;



      // Không phóng to quá mức thực tế trên màn laptop to

      if (finalScale > 1) finalScale = 1;



      setDisplayScale(finalScale);

    };



    handleResize(); // Chạy ngay khi mở

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);

  }, []);



  // ---> GỌI HOOK <---

  const { getRandomPolaroid } = usePolaroid();



  const handleCloseGacha = () => {

    setIsGachaClosing(true);

    if (isFlipped) setIsFlipped(false);

    setTimeout(() => {

      setIsGachaOpen(false);

      setIsGachaClosing(false);

    }, 500); 

  };



  // ---> HÀM RÚT ẢNH TỪ API <---

  const drawNewPhoto = async () => {

    if (isLoading || isGachaClosing) return;

    setIsFlipped(false);

    setIsLoading(true);

    setImageError(false); 



    // 1. Gọi API rút ảnh (truyền ID hiện tại xuống để tránh bốc trùng)

    const newPolaroid = await getRandomPolaroid(currentMemory?.id);



    // 2. Vẫn dùng setTimeout 1.2s để tạo cảm giác "máy đang in ảnh và đợi mực khô"

    setTimeout(() => {

      if (newPolaroid) {

        setCurrentMemory(newPolaroid);

      } else {

        // Nếu API lỗi hoặc DB chưa có ảnh nào

        setImageError(true); 

      }

      setIsLoading(false);

    }, 1200); 

  };



  // Vừa mở Modal lên là tự động bốc 1 tấm

  useEffect(() => {

    if (isGachaOpen && !isGachaClosing) {

      setCurrentMemory(null);

      setIsLoading(true);

    

      setImageError(false);

      

      const fetchInitialPhoto = async () => {

        const newPolaroid = await getRandomPolaroid();

        setTimeout(() => {

          if (newPolaroid) setCurrentMemory(newPolaroid);

          else setImageError(true);

          

        

          setIsLoading(false);

        }, 1200);

      };



      fetchInitialPhoto();

    }

  }, [isGachaOpen, isGachaClosing]);



  // Hàm format ngày tháng từ DB

  const formatDate = (dateString?: string) => {

    if (!dateString) return "";

    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

  };



  const showDefaultFrame = isLoading || !currentMemory || imageError;



  return (
    <>
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .flip-transition { transition: transform 0.8s cubic-bezier(0.4, 0.2, 0.2, 1); }

        /* ======================================================== */
        /* ---> CÁC CSS ANIMATIONS MỚI CHO VIỆC ĐÓNG/MỞ <--- */
        /* ======================================================== */
        
        /* 1. Animation cho lớp nền đen (Overlay) */
        @keyframes gacha-overlay-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-gacha-overlay-in { animation: gacha-overlay-in 0.5s ease forwards; }

        @keyframes gacha-overlay-out { from { opacity: 1; } to { opacity: 0; } }
        .animate-gacha-overlay-out { animation: gacha-overlay-out 0.5s ease forwards; }

        /* 2. Animation cho nội dung (Bức ảnh + Nút) */
        /* Entry: Bay lên từ dưới, zoom nhẹ (cubic-bezier cho cảm giác bounce nhè nhẹ) */
        @keyframes gacha-content-in { from { opacity: 0; transform: scale(0.8) translateY(50px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        .animate-gacha-content-in { animation: gacha-content-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards; }

        /* Exit: Tụt xuống dưới, mờ dần, scale nhỏ lại (cubic-bezier cho cảm giác rớt xuống nhanh) */
        @keyframes gacha-content-out { from { opacity: 1; transform: scale(1) translateY(0); } to { opacity: 0; transform: scale(0.9) translateY(100px); } }
        .animate-gacha-content-out { animation: gacha-content-out 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards; }

      `}</style>

      {/* ICON MÁY ẢNH TRÊN BÀN */}
      {/* BỎ HIDDEN ĐỂ HIỆN TRÊN MOBILE, DÙNG % ĐỂ ĐỊNH VỊ */}
      <div onClick={() => setIsGachaOpen(true)} className="absolute top-16 left-8 md:top-24 md:left-32 w-28 h-32 md:w-32 md:h-36 z-20 cursor-pointer group">
        <div className="absolute inset-0 bg-white p-2 shadow-md transform -rotate-12 border border-gray-200">
          <div className="w-full h-[75%] bg-gray-200 opacity-50" />
        </div>
        <div className="absolute inset-0 bg-white p-2 shadow-lg transform rotate-6 border border-gray-200 group-hover:rotate-12 group-hover:-translate-y-2 transition-all duration-300">
          <div className="w-full h-[75%] bg-gradient-to-br from-blue-100 to-pink-100 relative overflow-hidden">
             <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/noise.png')]" />
          </div>
          <div className="absolute bottom-2 right-2 text-xl drop-shadow-sm">📸</div>
        </div>
      </div>

      {/* OVERLAY MODAL */}
      {isGachaOpen && typeof window !== "undefined" && createPortal(
        <>
          {/* 1. LỚP NỀN ĐEN: Tách ra độc lập, fix cứng, nhận event đóng và có animation */}
          <div 
            className={`fixed inset-0 bg-black/80 backdrop-blur-md z-[99998] ${isGachaClosing ? 'animate-gacha-overlay-out' : 'animate-gacha-overlay-in'}`} 
            onClick={handleCloseGacha} 
          />

          {/* 2. KHUNG CUỘN CHÍNH: Dùng 100dvh và overflow-y-auto */}
          <div className="fixed inset-0 w-full h-[100dvh] overflow-y-auto overflow-x-hidden z-[99999] pointer-events-none flex flex-col items-center justify-center p-4">

            {/* 3. LỚP BỌC AUTO ZOOM VÀO ĐÂY: Thêm pointer-events-auto và my-auto */}
            <div 
              style={{ transform: `scale(${displayScale})`, transformOrigin: "center center" }} 
              className="relative z-10 flex-shrink-0 pointer-events-auto my-auto transition-transform duration-300"
            >
              {/* CONTAINER CHỨA NỘI DUNG - Chốt cứng kích thước 400x650 */}
              <div className={`relative flex flex-col items-center justify-center perspective-1000 w-[400px] h-[650px] z-10 ${isGachaClosing ? 'animate-gacha-content-out' : 'animate-gacha-content-in'} my-8 md:my-0`}>
                
                {/* CONTAINER BỨC ẢNH PHẢI CÓ z-INDEX ĐỂ ĐÈ LÊN OVERLAY CLIKABLE */}
                <div 
                  onClick={() => { if (currentMemory?.secret_message && !isLoading && !isGachaClosing) setIsFlipped(!isFlipped); }}
                  className={`relative inline-block preserve-3d flip-transition cursor-pointer shadow-2xl z-10 ${
                    isFlipped ? 'rotate-y-180' : ''
                  } `}
                >
                  {/* === MẶT TRƯỚC === */}
                  <div className="relative backface-hidden bg-white p-3 md:p-4 pb-6 md:pb-8 border border-gray-200 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center transition-all duration-300">
                    {showDefaultFrame ? (
                      <div className="w-[320px] md:w-[360px] aspect-square bg-[#1A1A1A] relative flex flex-col items-center justify-center border border-gray-300 shadow-inner overflow-hidden">
                        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/noise.png')]" />
                        {isLoading || !currentMemory ? (
                          <div className="flex flex-col items-center z-10">
                            <span className="material-symbols-outlined text-4xl animate-[spin_3s_linear_infinite] text-white/40 mb-2">autorenew</span>
                            <span className="font-mono text-[10px] uppercase tracking-widest animate-pulse text-white/40">Chờ xíu! Chờ xíu...</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center z-10">
                            <span className="material-symbols-outlined text-4xl text-white/20 mb-2">broken_image</span>
                            <span className="font-mono text-[10px] uppercase tracking-widest text-white/30">Film Damaged</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="relative bg-[#1A1A1A] border border-gray-300 shadow-inner p-[2px]">
                        <img 
                          src={currentMemory.image_url} 
                          alt="Memory" 
                          onError={() => setImageError(true)}
                          className="w-auto h-auto max-w-[85vw] md:max-w-[400px] max-h-[90vh] md:max-h-[400px] object-contain block grayscale-[0.1] animate-in fade-in zoom-in-95 duration-1000" 
                        />
                      </div>
                    )}

                    <div className="relative mt-4 mb-2 w-full flex items-center justify-center min-h-[2rem]">
                      {isLoading || !currentMemory ? (
                        <div className="w-1/2 h-3 bg-gray-200 rounded animate-pulse" />
                      ) : (
                        <p className="text-center font-hand text-2xl md:text-3xl text-ink w-full px-2 break-words whitespace-pre-wrap">
                          {currentMemory.caption}
                        </p>
                      )}
                    </div>

                    {currentMemory?.secret_message && !isLoading && !isGachaClosing && (
                      <div className="absolute bottom-3 right-3 flex items-center gap-1 text-gray-400 opacity-60 animate-bounce">
                        <span className="text-[10px] font-mono uppercase font-bold tracking-widest">Flip</span>
                        <span className="material-symbols-outlined text-sm">360</span>
                      </div>
                    )}
                  </div>

                  {/* === MẶT SAU === */}
                  <div className="absolute inset-0 backface-hidden rotate-y-180 bg-[#FDFBF7] p-6 md:p-8 border border-gray-300 flex flex-col shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/noise.png')]" />
                    <div className="absolute top-4 left-4 w-12 h-12 opacity-[0.03] bg-black rounded-full blur-[2px]" />

                    <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
                      <p className="font-hand text-2xl md:text-4xl text-ink leading-[1.4] text-center whitespace-pre-line break-words rotate-[-2deg]">
                        {currentMemory?.secret_message}
                      </p>
                    </div>

                    <div className="absolute bottom-4 right-6 font-display text-[10px] text-gray-400 tracking-widest">
                      {formatDate(currentMemory?.created_at)}
                    </div>
                  </div>
                </div>

                {/* BẢNG ĐIỀU KHIỂN */}
                <div className={`relative z-10 mt-12 flex items-center gap-6`}>
                  <button onClick={handleCloseGacha} className="pointer-events-auto px-6 py-2 rounded-full border border-white/30 text-white/70 font-mono text-xs uppercase tracking-widest hover:bg-white/10 transition-colors">
                    Cất đi
                  </button>
                  
                  <button onClick={drawNewPhoto} disabled={isLoading || isGachaClosing} className="pointer-events-auto group relative px-8 py-3 bg-white text-ink font-bold font-mono text-sm uppercase tracking-widest rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 transition-all flex items-center gap-2 overflow-hidden disabled:opacity-50 disabled:hover:scale-100">
                    <div className="absolute inset-0 bg-blue-100 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                    <span className={`material-symbols-outlined relative z-10 transition-transform duration-700 ${isLoading ? 'animate-spin' : 'group-hover:rotate-180'}`}>change_circle</span>
                    <span className="relative z-10">{isLoading ? "Đang rửa..." : "Rút tấm khác"}</span>
                  </button>
                </div>
                
                {/* NÚT ẨN DÀNH RIÊNG CHO ADMIN */}
                <div 
                  onClick={() => setIsUploadOpen(true)}
                  className="group absolute bottom-0 right-0 w-16 h-16 z-50 pointer-events-auto flex items-end justify-end p-3 cursor-pointer"
                  title=" " 
                >
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-[5px] h-[5px] rounded-full bg-white/60 border border-black/20 shadow-[inset_0_1px_1px_rgba(0,0,0,0.8)] flex items-center justify-center">
                      <div className="w-full h-[1px] bg-black/50 transform rotate-45"></div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </>,
        document.body
      )}

      {/* ---> THÊM MODAL UPLOAD VÀO ĐÂY <--- */}
      <PolaroidUploadModal
        isOpen={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)} 
      />
    </>
  );

}