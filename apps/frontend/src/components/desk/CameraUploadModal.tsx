import React, { useState, useRef, useEffect } from "react";
import { useMemory } from "@/hooks/useMemory";
import { createPortal } from "react-dom"; // ---> THÊM PORTAL

interface CameraUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess?: () => void;
}

export function CameraUploadModal({ isOpen, onClose, onUploadSuccess }: CameraUploadModalProps) {
  const [caption, setCaption] = useState("");
  const [secretMessage, setSecretMessage] = useState("");
  const [memoryDate, setMemoryDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadMemory, isUploading, error } = useMemory();

  const [clickCount, setClickCount] = useState(0);
  const [showSecretMode, setShowSecretMode] = useState(false);

  const [toast, setToast] = useState<{ msg: string; type: "error" | "success" } | null>(null);

  // === THÊM STATE TÍNH TOÁN ZOOM CHO FORM (Y hệt UploadModal) ===
  const [modalScale, setModalScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;
      
      // Chốt cứng kích thước form Camera là 900x600 để 2 cột luôn rộng rãi
      const baseW = 900;
      const baseH = 600;

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
  // ===============================================

  const showToast = (msg: string, type: "error" | "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSecretClick = () => {
    if (clickCount >= 2) {
      setShowSecretMode(!showSecretMode);
      setClickCount(0);
      showToast(showSecretMode ? "Đã khóa mặt sau!" : "Đã mở khóa mặt sau ảnh!", "success");
    } else {
      setClickCount(prev => prev + 1);
      setTimeout(() => setClickCount(0), 1000); 
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = () => {
    if (!caption.trim()) {
      showToast("Ít nhất phải viết vài dòng Caption chứ!", "error");
      return;
    }

    uploadMemory({
      imageFile: selectedFile,
      caption,
      secretMessage,
      memoryDate,
    }, () => {
      showToast("Rửa ảnh thành công! 📸", "success");
      setTimeout(() => {
        setCaption("");
        setSecretMessage("");
        setSelectedFile(null);
        setPreviewUrl(null);
        if (onUploadSuccess) onUploadSuccess();
        onClose();
      }, 1500);
    });
  };

  useEffect(() => {
    if (error) showToast(error, "error");
  }, [error]);

  if (!isOpen) return null;

  // ---> DÙNG createPortal ĐỂ ĐÈ LÊN MỌI THỨ VỚI z-[999999] <---
  return createPortal(
    <div className="fixed inset-0 z-[999999] flex items-center justify-center w-screen h-screen overflow-hidden">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      {/* ---> LỚP BỌC AUTO ZOOM TẠI ĐÂY <--- */}
      <div style={{ transform: `scale(${modalScale})`, transformOrigin: "center center" }} className="relative z-10 flex-shrink-0">
        
        {/* CHỐT CỨNG KÍCH THƯỚC: w-[900px] h-[600px] */}
        <div className="relative w-[900px] h-[600px] bg-[#FDFBF7] p-10 shadow-2xl rounded-sm transform rotate-1 flex flex-col">
          
          <button onClick={onClose} className="absolute -top-4 -right-4 w-12 h-12 bg-[#FF5A5A] rounded-full shadow-lg border-2 border-white flex items-center justify-center text-white hover:scale-110 transition-transform z-50">
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>

          {toast && (
            <div className={`absolute -top-6 left-1/2 -translate-x-1/2 px-6 py-2 rounded shadow-md border animate-fade-in-down z-50 flex items-center gap-2 ${
              toast.type === "error" ? "bg-red-50 border-red-200 text-red-700" : "bg-green-50 border-green-200 text-green-700"
            }`}>
              <span className="material-symbols-outlined text-[18px]">
                {toast.type === "error" ? "error" : "check_circle"}
              </span>
              <span className="font-mono text-sm font-bold tracking-wide">{toast.msg}</span>
            </div>
          )}

          <h3 onClick={handleSecretClick} className="font-hand font-bold text-5xl text-ink mb-8 text-center select-none cursor-default">
            Darkroom Studio
          </h3>

          {/* ÉP CỐ ĐỊNH THÀNH flex-row ĐỂ XẾP NGANG MỌI LÚC */}
          <div className="flex flex-row gap-10 flex-1">
            
            {/* ---> CỘT TRÁI: KHUNG ẢNH (Cố định width 400px) <--- */}
            <div className="w-[400px] flex flex-col items-center justify-center h-full">
              <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
              
              {previewUrl ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="relative p-3 bg-white shadow-[2px_4px_10px_rgba(0,0,0,0.15)] border border-gray-100 cursor-pointer group transform -rotate-1 hover:rotate-0 transition-all inline-block max-w-full"
                >
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="max-w-full h-[360px] w-auto object-contain grayscale-[0.2] group-hover:grayscale-0 transition-all" 
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="text-white font-mono text-sm bg-black/60 px-4 py-2 rounded backdrop-blur-sm">Nhấn để đổi ảnh</span>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); 
                      setSelectedFile(null); 
                      setPreviewUrl(null);   
                      if (fileInputRef.current) fileInputRef.current.value = ""; 
                    }}
                    className="absolute -top-4 -right-4 w-10 h-10 bg-[#FF5A5A] rounded-full text-white flex items-center justify-center shadow-md border-2 border-white hover:bg-red-600 hover:scale-110 transition-transform opacity-0 group-hover:opacity-100 z-10"
                    title="Gỡ ảnh này để tạo Note Vàng"
                  >
                    <span className="material-symbols-outlined text-[18px] font-bold">close</span>
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()} 
                  className="w-full h-[360px] border-2 border-dashed border-gray-300 bg-gray-50/50 rounded-sm flex flex-col items-center justify-center cursor-pointer hover:bg-white hover:border-gray-400 transition-all"
                >
                  <span className="material-symbols-outlined text-5xl text-gray-400 mb-2">add_a_photo</span>
                  <p className="font-hand text-2xl text-gray-500 text-center">Bấm để chọn ảnh<br/><span className="text-sm opacity-70">(Bỏ trống để tạo Note)</span></p>
                </div>
              )}
            </div>

            {/* ---> CỘT PHẢI: NHẬP LIỆU (Chiếm phần còn lại) <--- */}
            <div className="flex-1 flex flex-col justify-between h-full">
              <div className="space-y-6">
                <div className="flex flex-col">
                  <label className="font-mono text-sm font-bold text-gray-500 uppercase mb-2">Ngày lưu</label>
                  <input type="date" value={memoryDate} onChange={(e) => setMemoryDate(e.target.value)} className="w-full bg-transparent border-b-2 border-gray-300 focus:border-ink outline-none py-1 font-mono text-xl" />
                </div>

                <div className="flex flex-col">
                  <label className="font-mono text-sm font-bold text-gray-500 uppercase mb-2">Caption</label>
                  <textarea value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Vài dòng ngắn gọn..." className="w-full h-24 bg-transparent border-2 border-gray-200 rounded p-3 focus:border-ink outline-none resize-none font-hand text-2xl" />
                </div>

                {showSecretMode && (
                  <div className="flex flex-col animate-fade-in">
                    <label className="font-mono text-sm font-bold text-[#D97757] uppercase mb-2 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">lock_open</span> Mặt sau (Bí mật)
                    </label>
                    <textarea 
                      value={secretMessage} onChange={(e) => setSecretMessage(e.target.value)} placeholder="Tâm sự chỉ hiện khi lật ảnh..." 
                      className="w-full h-28 bg-[#FFF9E6] border-2 border-yellow-200 rounded p-3 focus:border-yellow-400 outline-none resize-none font-hand text-2xl shadow-inner"
                    />
                  </div>
                )}
              </div>

              <button onClick={handleUpload} disabled={isUploading} className={`w-full py-4 mt-6 text-white font-mono font-bold tracking-widest text-lg uppercase rounded shadow-md transition-all ${isUploading ? 'bg-gray-400' : 'bg-ink hover:translate-y-[-2px] hover:shadow-lg'}`}>
                {isUploading ? 'Đang rửa ảnh...' : 'Lưu'}
              </button>
            </div>

          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes fade-in-down {
          0% { opacity: 0; transform: translate(-50%, -20px); }
          100% { opacity: 1; transform: translate(-50%, 0); }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.3s ease-out forwards;
        }
      `}</style>
    </div>,
    document.body
  );
}