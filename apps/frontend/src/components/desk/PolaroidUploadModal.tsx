"use client";
import React, { useEffect, useRef, useState } from "react";
import { polaroidService } from "@/services/polaroid.service";
import { createPortal } from "react-dom";

interface PolaroidUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PolaroidUploadModal({ isOpen, onClose }: PolaroidUploadModalProps) {
  const [caption, setCaption] = useState("");
  const [secretMessage, setSecretMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [toast, setToast] = useState<{ msg: string; type: "error" | "success" } | null>(null);

  // ---> THÊM STATE ĐỂ LƯU TỶ LỆ ZOOM <---
  const [modalScale, setModalScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;
      
      // SỬA Ở ĐÂY: Kích thước form "Load New Film" là dạng dọc, cao tầm 720px
      const baseW = 450; 
      const baseH = 720; 

      const scaleX = screenW / baseW;
      const scaleY = screenH / baseH;
      
      let finalScale = Math.min(scaleX, scaleY) * 0.95;
      if (finalScale > 1) finalScale = 1;

      setModalScale(finalScale);
    };

    if (isOpen) {
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [isOpen]);

  const showToast = (msg: string, type: "error" | "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  if (!isOpen) return null;

  const handleUpload = async () => {
    if (!selectedFile) {
      showToast("Quên bỏ cuộn phim (ảnh) vào kìa Admin!", "error");
      return;
    }

    setIsUploading(true);
    try {
      await polaroidService.uploadPolaroid({
        image: selectedFile,
        caption: caption.trim(),
        secret_message: secretMessage.trim(),
      });
      
      showToast("Nạp phim thành công! 🎞️", "success");
      setTimeout(() => {
        setCaption("");
        setSecretMessage("");
        setSelectedFile(null);
        onClose();
      }, 1200);
    } catch (error: any) {
      showToast(error.message || "Kẹt phim! Lỗi hệ thống.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    createPortal(
      // 1. LỚP BỌC NGOÀI CÙNG: fixed inset-0 z cực cao, flex items-center justify-center
      <div className="fixed inset-0 z-[999999] w-screen h-screen flex items-center justify-center overflow-hidden">
        {/* Lớp nền đen làm mờ */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={!isUploading ? onClose : undefined} />

        {/* ---> LỚP BỌC AUTO ZOOM VỪA THÊM <--- */}
        <div 
          style={{ transform: `scale(${modalScale})`, transformOrigin: "center center" }}
          className="relative z-10 flex-shrink-0"
        >

          <div className="relative w-[420px] bg-[#2C2822] rounded-xl shadow-2xl border-4 border-[#1A1713] flex flex-col animate-in zoom-in-95 duration-300">
            
            {/* Nút X đóng */}
            <button onClick={onClose} disabled={isUploading} className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-[#2C2822] z-50 transition-colors disabled:opacity-50">
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>

            {/* Thông báo (Toast) */}
            {toast && (
              <div className={`absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded shadow-lg border z-50 flex items-center gap-2 ${
                toast.type === "error" ? "bg-red-900 border-red-500 text-red-100" : "bg-green-900 border-green-500 text-green-100"
              }`}>
                <span className="font-mono text-xs tracking-wide whitespace-nowrap">{toast.msg}</span>
              </div>
            )}

            {/* Header giả lập hộp phim */}
            <div className="bg-[#1A1713] px-6 py-4 rounded-t-lg border-b border-white/10 flex items-center gap-3">
              <span className="material-symbols-outlined text-yellow-500">camera_roll</span>
              <h3 className="font-mono font-bold text-white tracking-widest uppercase text-sm">Load New Film</h3>
            </div>

            {/* Nội dung form */}
            <div className="p-6 flex flex-col gap-5">
              
              {/* Chọn ảnh */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-32 border-2 border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center bg-black/20 cursor-pointer hover:bg-white/5 transition-colors group relative overflow-hidden"
              >
                {selectedFile ? (
                  // Bức ảnh mờ mờ làm nền khi đã chọn
                  <img src={URL.createObjectURL(selectedFile)} className="absolute inset-0 w-full h-full object-cover opacity-30" alt="Preview" />
                ) : null}
                
                <span className="material-symbols-outlined text-3xl text-gray-400 group-hover:text-white transition-colors mb-2 z-10">
                  {selectedFile ? 'check_circle' : 'add_photo_alternate'}
                </span>
                <p className="font-mono text-xs text-gray-400 z-10 text-center px-4">
                  {selectedFile ? selectedFile.name : "Click to load image"}
                </p>
                <input 
                  type="file" accept="image/*" className="hidden" ref={fileInputRef}
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                />
              </div>

              {/* Ô nhập Mặt Trước */}
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[10px] text-gray-400 uppercase tracking-widest">Caption (Mặt trước)</label>
                <input 
                  type="text" 
                  value={caption} onChange={(e) => setCaption(e.target.value)}
                  placeholder="e.g. Mèo ngáo..." 
                  className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-white font-hand text-xl outline-none focus:border-yellow-500/50"
                />
              </div>

              {/* Ô nhập Mặt Sau */}
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[10px] text-pink-400/80 uppercase tracking-widest flex items-center gap-1">
                  Secret Message (Mặt sau) <span className="material-symbols-outlined text-[12px]">lock</span>
                </label>
                <textarea 
                  value={secretMessage} onChange={(e) => setSecretMessage(e.target.value)}
                  placeholder="Lời nhắn bí mật..." 
                  className="w-full h-24 bg-black/30 border border-white/10 rounded px-3 py-2 text-white font-hand text-xl outline-none focus:border-pink-500/50 resize-none"
                />
              </div>

            </div>

            {/* Nút Nạp Phim */}
            <div className="p-6 pt-0">
              <button 
                onClick={handleUpload}
                disabled={isUploading}
                className={`w-full py-3 rounded text-white font-mono text-xs font-bold tracking-widest uppercase transition-colors shadow-lg ${
                  isUploading ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-500'
                }`}
              >
                {isUploading ? 'Loading Film...' : 'Insert Film'}
              </button>
            </div>

          </div>
        </div>
      </div>,
    document.body
    )
  );
}