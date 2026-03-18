import React, { useState, useRef, useEffect } from "react";
import { useMemory } from "@/hooks/useMemory";

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

  // State cho Easter Egg
  const [clickCount, setClickCount] = useState(0);
  const [showSecretMode, setShowSecretMode] = useState(false);

  // ---> STATE CHO THÔNG BÁO (TOAST MESSAGE)
  const [toast, setToast] = useState<{ msg: string; type: "error" | "success" } | null>(null);

  // Hàm hiển thị thông báo trong 3 giây
  const showToast = (msg: string, type: "error" | "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Kích hoạt Admin Mode khi bấm 3 lần
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
      showToast("Ít nhất phải viết vài dòng Caption chứ!", "error"); // Thay thế Alert
      return;
    }

    uploadMemory({
      imageFile: selectedFile,
      caption,
      secretMessage,
      memoryDate,
    }, () => {
      showToast("Rửa ảnh thành công! 📸", "success"); // Thay thế Alert
      
      // Delay một chút để xem kịp thông báo rồi mới đóng
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

  // Bắt lỗi từ Hook API nếu có để quăng vào Toast
  useEffect(() => {
    if (error) showToast(error, "error");
  }, [error]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-[#FDFBF7] p-8 shadow-2xl rounded-sm transform rotate-1 transition-all duration-500">
        
        {/* Nút Đóng */}
        <button onClick={onClose} className="absolute -top-4 -right-4 w-10 h-10 bg-[#FF5A5A] rounded-full shadow-lg border-2 border-white flex items-center justify-center text-white hover:scale-110 transition-transform z-50">
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        {/* ---> TOAST NOTIFICATION GIAO DIỆN <--- */}
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
        {/* ------------------------------------------ */}

        <h3 onClick={handleSecretClick} className="font-hand font-bold text-4xl text-ink mb-6 text-center select-none cursor-default">
          Darkroom Studio
        </h3>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* ---> CỘT TRÁI: KHUNG ẢNH ĐỘNG <--- */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
            
            {previewUrl ? (
              // Trạng thái đã chọn ảnh: Form biến thành viền trắng ôm sát ảnh, max-height 350px để không trôi layout
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="relative p-2 bg-white shadow-[2px_4px_10px_rgba(0,0,0,0.15)] border border-gray-100 cursor-pointer group transform -rotate-1 hover:rotate-0 transition-all inline-block max-w-full"
              >
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="max-w-full max-h-[350px] w-auto h-auto object-contain grayscale-[0.2] group-hover:grayscale-0 transition-all" 
                />
                {/* Overlay Đổi ảnh khi hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="text-white font-mono text-xs bg-black/60 px-3 py-1 rounded backdrop-blur-sm">Nhấn để đổi ảnh</span>
                </div>
                
                {/* ---> NÚT GỠ BỎ ẢNH (MỚI) <--- */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Ngăn không cho mở cửa sổ chọn file
                    setSelectedFile(null); // Xóa file trong state
                    setPreviewUrl(null);   // Xóa ảnh hiển thị
                    if (fileInputRef.current) {
                      fileInputRef.current.value = ""; // Reset input để có thể chọn lại đúng file đó nếu đổi ý
                    }
                  }}
                  className="absolute -top-3 -right-3 w-8 h-8 bg-[#FF5A5A] rounded-full text-white flex items-center justify-center shadow-md border-2 border-white hover:bg-red-600 hover:scale-110 transition-transform opacity-0 group-hover:opacity-100 z-10"
                  title="Gỡ ảnh này để tạo Note Vàng"
                >
                  <span className="material-symbols-outlined text-[16px] font-bold">close</span>
                </button>
              </div>
            ) : (
              // Trạng thái chưa chọn: Khung đứt nét cố định min-height
              <div 
                onClick={() => fileInputRef.current?.click()} 
                className="w-full min-h-[300px] border-2 border-dashed border-gray-300 bg-gray-50/50 rounded-sm flex flex-col items-center justify-center cursor-pointer hover:bg-white hover:border-gray-400 transition-all"
              >
                <span className="material-symbols-outlined text-4xl text-gray-400 mb-2">add_a_photo</span>
                <p className="font-hand text-xl text-gray-500 text-center">Bấm để chọn ảnh<br/><span className="text-sm opacity-70">(Bỏ trống để tạo Note Vàng)</span></p>
              </div>
            )}
          </div>
          {/* -------------------------------------- */}

          {/* Cột Phải: Nhập liệu (Giữ nguyên) */}
          <div className="flex-1 flex flex-col justify-between space-y-4">
            <div className="flex flex-col">
              <label className="font-mono text-xs font-bold text-gray-500 uppercase mb-1">Ngày kỷ niệm</label>
              <input type="date" value={memoryDate} onChange={(e) => setMemoryDate(e.target.value)} className="w-full bg-transparent border-b-2 border-gray-300 focus:border-ink outline-none py-1 font-mono" />
            </div>

            <div className="flex flex-col">
              <label className="font-mono text-xs font-bold text-gray-500 uppercase mb-1">Mặt trước (Caption)</label>
              <textarea value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Vài dòng ngắn gọn..." className="w-full h-20 bg-transparent border-2 border-gray-200 rounded p-2 focus:border-ink outline-none resize-none font-hand text-xl" />
            </div>

            {showSecretMode && (
              <div className="flex flex-col animate-fade-in">
                <label className="font-mono text-xs font-bold text-[#D97757] uppercase mb-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">lock_open</span> Mặt sau (Bí mật)
                </label>
                <textarea 
                  value={secretMessage} onChange={(e) => setSecretMessage(e.target.value)} placeholder="Tâm sự mỏng chỉ hiện khi lật ảnh..." 
                  className="w-full h-28 bg-[#FFF9E6] border-2 border-yellow-200 rounded p-2 focus:border-yellow-400 outline-none resize-none font-hand text-xl shadow-inner"
                />
              </div>
            )}

            <button onClick={handleUpload} disabled={isUploading} className={`w-full py-3 text-white font-mono font-bold tracking-widest text-sm uppercase rounded shadow-md transition-all ${isUploading ? 'bg-gray-400' : 'bg-ink hover:translate-y-[-2px] hover:shadow-lg'}`}>
              {isUploading ? 'Đang rửa ảnh...' : 'Lưu Kỷ Niệm'}
            </button>
          </div>

        </div>
      </div>
      
      {/* Thêm CSS cho Animation Toast */}
      <style>{`
        @keyframes fade-in-down {
          0% { opacity: 0; transform: translate(-50%, -20px); }
          100% { opacity: 1; transform: translate(-50%, 0); }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}