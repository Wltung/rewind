import { useSong } from "@/hooks/useSong";
import { configService } from "@/services/config.service";
import { songService } from "@/services/song.service";
import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitRequest: (title: string, artist: string) => void;
  onUploadSuccess: () => void;
}

export function UploadModal({ isOpen, onClose, onSubmitRequest, onUploadSuccess }: UploadModalProps) {
  // State lưu giá trị ô input
  const [songTitle, setSongTitle] = useState("");
  const [artist, setArtist] = useState("");

  // State: Upload Your Own (Trang Phải - Admin)
  const [upTitle, setUpTitle] = useState("");
  const [upDuration, setUpDuration] = useState("90 MIN");
  const [upArtist, setUpArtist] = useState("");
  const [lyricsJSON, setLyricsJSON] = useState(`[\n  {"time": 0, "text": "Intro..."}\n]`);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Lấy hàm upload và trạng thái từ Hook
  const { uploadSong, isUploading, error } = useSong();

  // State CHO NCT API
  const [nctKey, setNctKey] = useState("");
  const [isFetchingLyrics, setIsFetchingLyrics] = useState(false);

  // ---> STATE CHO THÔNG BÁO (TOAST MESSAGE)
  const [toast, setToast] = useState<{ msg: string; type: "error" | "success" } | null>(null);

  // ---> THÊM STATE ĐỂ LƯU TỶ LỆ ZOOM CHO CUỐN SỔ <---
  const [modalScale, setModalScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;
      
      // Kích thước gốc của cuốn sổ (Cộng thêm 50px lề cho an toàn)
      const baseW = 1150; 
      const baseH = 650; 

      const scaleX = screenW / baseW;
      const scaleY = screenH / baseH;
      
      // Lấy tỷ lệ nhỏ hơn để đảm bảo không bị cắt, nhân 0.95 để có viền
      let finalScale = Math.min(scaleX, scaleY) * 0.95;

      // Không phóng to quá kích thước thật trên PC
      if (finalScale > 1) finalScale = 1;

      setModalScale(finalScale);
    };

    if (isOpen) {
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [isOpen]);

  // Hàm hiển thị thông báo
  const showToast = (msg: string, type: "error" | "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Bắt lỗi từ Hook API nếu có để quăng vào Toast
  useEffect(() => {
    if (error) showToast(error, "error");
  }, [error]);

  // HÀM XỬ LÝ AUTO-FILL
  const handleAutoFillLyrics = async () => {
    if (!nctKey.trim()) {
      showToast("Vui lòng nhập NCT Song Key (VD: AT9rsVdeI9yc)", "error");
      return;
    }
    setIsFetchingLyrics(true);
    try {
      const data = await songService.fetchNCTLyrics(nctKey);
      if (data && data.length > 0) {
        setLyricsJSON(JSON.stringify(data, null, 2));
        showToast("Lấy lời bài hát thành công! ✨", "success");
      } else {
        showToast("Không tìm thấy lời hoặc lỗi định dạng!", "error");
      }
    } catch (err: any) {
      showToast(err.message || "Lỗi khi lấy lời bài hát!", "error");
    } finally {
      setIsFetchingLyrics(false);
    }
  };

  if (!isOpen) return null;

  // Xử lý khi bấm nút Pin to Desk
  const handlePinToDesk = async () => {
    if (!songTitle.trim()) {
      showToast("Vui lòng điền tên bài hát muốn yêu cầu nhé!", "error");
      return;
    }
    
    try {
      // Gọi qua Service cực gọn
      await configService.setDeskNote({
        title: songTitle.trim(),
        artist: artist.trim(),
        timestamp: Date.now() // Cắm mốc thời gian lúc tạo
      });

      showToast("Đã ghim yêu cầu lên mặt bàn! 📌", "success");
      setTimeout(() => {
        onSubmitRequest(songTitle, artist);
      }, 1200);
    } catch (error) {
      showToast("Lỗi khi ghim, hãy thử lại!", "error");
    }
  };

  // Xử lý Upload thực tế
  const handleBurnToTape = () => {
    if (!upTitle || !selectedFile || !lyricsJSON) {
      showToast("Vui lòng điền đủ Tên bài, File MP3 và JSON Lyrics!", "error");
      return;
    }

    // XỬ LÝ PARSE TÊN BÀI VÀ CA SĨ
    let finalTitle = upTitle.trim();
    let finalArtist = upArtist;
    let finalQuote = "";

    if (upTitle.includes(" - ")) {
      const parts = upTitle.split(" - ");
      finalTitle = parts[0].trim();
      if (parts.length >= 2) finalArtist = parts[1].trim();
      if (parts.length >= 3) finalQuote = parts.slice(2).join(" - ").trim(); 
    } 
    else if (upTitle.includes("-")) {
      const parts = upTitle.split("-");
      finalTitle = parts[0].trim();
      if (parts.length >= 2) finalArtist = parts[1].trim();
      if (parts.length >= 3) finalQuote = parts.slice(2).join("-").trim();
    }

    uploadSong(
      {
        title: finalTitle,
        artist: finalArtist,
        quote: finalQuote,
        duration: upDuration,
        lyrics: lyricsJSON,
        audioFile: selectedFile,
      },
      () => {
        showToast("Burn (Upload) thành công!", "success");
        onUploadSuccess();
        setTimeout(() => {
          onClose(); // Đóng modal sau khi báo thành công
        }, 1200);
      }
    );
  };

  return createPortal(
    <>
      {/* 1. LỚP NỀN ĐEN: Tách riêng ra, ghim cứng 100% màn hình, không bị cuộn */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99999]" onClick={onClose} />

      {/* 2. KHUNG CUỘN CHÍNH: Dùng h-[100dvh] để trị lỗi Safari, và flex để căn giữa */}
      <div className="fixed inset-0 w-full h-[100dvh] overflow-y-auto overflow-x-hidden z-[99999] pointer-events-none flex flex-col items-center justify-start md:justify-center p-4">
        
        {/* LỚP BỌC AUTO ZOOM (Giữ nguyên logic scale của bạn, THÊM my-auto) */}
        <div 
          style={{ transform: `scale(${modalScale})`, transformOrigin: "center center" }} 
          className="relative pointer-events-auto shrink-0 md:transform-origin-center my-auto transition-transform duration-300"
        >
          
          {/* NỘI DUNG CHÍNH CUỐN SỔ TAY (Đã chốt cứng kích thước 1100x580) */}
          <div className="relative w-[1100px] h-[580px] bg-[#FDFBF7] shadow-2xl rounded-sm flex flex-row animate-pop-bounce transform rotate-1 mt-8 mb-8 md:my-0">
            
            {/* NÚT TẮT ĐỎ GÓC PHẢI */}
            <button onClick={onClose} className="absolute -top-4 -right-4 w-10 h-10 bg-[#FF5A5A] rounded-full shadow-[2px_4px_10px_rgba(0,0,0,0.3)] border-2 border-white flex items-center justify-center text-white hover:scale-110 transition-transform z-50">
              <span className="material-symbols-outlined text-xl font-bold">close</span>
            </button>

            {/* TOAST NOTIFICATION GIAO DIỆN */}
            {toast && (
              <div className={`absolute -top-6 left-1/2 -translate-x-1/2 px-6 py-2 rounded shadow-md border animate-fade-in-down z-50 flex items-center gap-2 ${
                toast.type === "error" ? "bg-red-50 border-red-200 text-red-700" : "bg-green-50 border-green-200 text-green-700"
              }`}>
                <span className="material-symbols-outlined text-[18px]">
                  {toast.type === "error" ? "error" : "check_circle"}
                </span>
                <span className="font-mono text-sm font-bold tracking-wide whitespace-nowrap">{toast.msg}</span>
              </div>
            )}

            {/* Băng dính trang trí */}
            <div className="absolute -top-3 left-[20%] w-16 h-6 bg-blue-200/70 backdrop-blur-sm shadow-sm transform -rotate-2 z-20 border border-blue-100" />
            <div className="absolute -top-3 right-[30%] w-12 h-6 bg-pink-200/70 backdrop-blur-sm shadow-sm transform rotate-3 z-20 border border-pink-100" />
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/noise.png')] pointer-events-none" />

            {/* ======================================= */}
            {/* TRANG TRÁI: REQUEST A SONG (CỦA NGỌC) */}
            {/* ======================================= */}
            <div className="w-[550px] p-12 relative flex flex-col justify-between border-r border-gray-300 border-dashed z-10">
              <div>
                <h3 className="font-hand font-bold text-4xl text-ink mb-8">Request a song</h3>
                
                <div className="space-y-8">
                  <div className="flex flex-col">
                    <label className="font-hand text-xl text-ink mb-1">Tên bài hát...</label>
                    <input 
                      type="text" 
                      value={songTitle}
                      onChange={(e) => setSongTitle(e.target.value)}
                      placeholder="e.g. In love" 
                      className="w-full bg-transparent border-0 border-b-2 border-dashed border-gray-300 focus:border-ink focus:ring-0 px-1 py-1 font-hand text-2xl text-gray-600 placeholder:text-gray-300 transition-colors"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="font-hand text-xl text-ink mb-1">Nghệ sĩ / Nhạc sĩ...</label>
                    <input 
                      type="text" 
                      value={artist}
                      onChange={(e) => setArtist(e.target.value)}
                      placeholder="e.g. Low G, JustaTee" 
                      className="w-full bg-transparent border-0 border-b-2 border-dashed border-gray-300 focus:border-ink focus:ring-0 px-1 py-1 font-hand text-2xl text-gray-600 placeholder:text-gray-300 transition-colors"
                    />
                  </div>
                </div>

                {/* Nút Pin To Desk */}
                <button 
                  onClick={handlePinToDesk}
                  className="mt-10 px-6 py-2 bg-[#2C3A47] text-white font-hand font-bold text-xl rounded-sm shadow-[3px_3px_0_rgba(0,0,0,0.8)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_rgba(0,0,0,0.8)] transition-all"
                >
                  Pin to Desk
                </button>
              </div>

              <p className="font-hand text-gray-400 italic text-lg mt-12 leading-tight">
                *Lưu ý: Đôi khi băng cassette sẽ mất vài giờ để đến tay bạn...
              </p>
            </div>

            {/* ======================================= */}
            {/* TRANG PHẢI: UPLOAD YOUR OWN (ADMIN) */}
            {/* ======================================= */}
            <div className="w-[550px] p-10 relative flex flex-col justify-between bg-gradient-to-l from-gray-50/50 to-transparent z-10">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-hand font-bold text-4xl text-ink">Upload (Phần của tui)</h3>
                  {isUploading && <span className="text-sm font-mono text-blue-500 animate-pulse">Uploading...</span>}
                </div>

                {/* KHỐI GIAO DIỆN AUTO-FILL NCT LYRICS */}
                <div className="flex items-center gap-2 mb-4 bg-white/40 p-2 rounded border border-gray-200 shadow-sm">
                  <span className="material-symbols-outlined text-green-600 text-xl">smart_toy</span>
                  <input 
                    type="text" 
                    value={nctKey} 
                    onChange={(e) => setNctKey(e.target.value)}
                    placeholder="NCT Song Key (e.g. AT9rsV...)" 
                    className="flex-1 bg-transparent border-b border-gray-300 focus:border-ink outline-none px-1 py-0.5 font-mono text-xs text-gray-700 placeholder:text-gray-400"
                  />
                  <button 
                    onClick={handleAutoFillLyrics}
                    disabled={isFetchingLyrics}
                    className="px-3 py-1 bg-green-100 text-green-700 hover:bg-green-200 font-mono text-xs font-bold rounded border border-green-300 transition-colors disabled:opacity-50 whitespace-nowrap"
                  >
                    {isFetchingLyrics ? 'Fetching...' : 'Auto-Fill'}
                  </button>
                </div>
                
                {/* Vùng Drop MP3 */}
                <input 
                  type="file" 
                  accept=".mp3,audio/*"
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                />
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-20 mb-4 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-white/50 cursor-pointer hover:bg-white hover:border-blue-400 transition-colors group"
                >
                  <span className="material-symbols-outlined text-2xl text-gray-400 group-hover:text-blue-500 transition-colors mb-1">
                    {selectedFile ? 'check_circle' : 'audio_file'}
                  </span>
                  <p className="font-hand text-lg text-ink line-clamp-1 px-4 text-center">
                    {selectedFile ? selectedFile.name : "Click to select .MP3"}
                  </p>
                </div>

                {/* Khung nhập Tên bài & Lyrics */}
                <div className="flex gap-4 mb-4">
                  <input 
                    type="text" value={upTitle} onChange={(e) => setUpTitle(e.target.value)}
                    placeholder="Song Title - Artist..." 
                    className="w-2/3 bg-transparent border-0 border-b border-dashed border-gray-300 focus:border-ink focus:ring-0 px-1 py-1 font-hand text-xl text-gray-600 placeholder:text-gray-400"
                  />
                  <input 
                    type="text" value={upDuration} onChange={(e) => setUpDuration(e.target.value)}
                    placeholder="Duration (e.g. 90 MIN)" 
                    className="w-1/3 bg-transparent border-0 border-b border-dashed border-gray-300 focus:border-ink focus:ring-0 px-1 py-1 font-hand text-xl text-gray-600 text-right placeholder:text-gray-400"
                  />
                </div>

                <div className="flex flex-col mb-6">
                  <label className="font-hand text-lg text-ink mb-1">Lyric Metadata (JSON)</label>
                  <div className="relative">
                    <textarea 
                      value={lyricsJSON}
                      onChange={(e) => setLyricsJSON(e.target.value)}
                      className="w-full h-36 bg-[#EFEBE0] rounded-sm shadow-inner p-3 font-mono text-xs text-gray-600 outline-none focus:ring-2 focus:ring-blue-400/50 resize-none border border-gray-200"
                    />
                  </div>
                </div>
              </div>

              <button 
                onClick={handleBurnToTape}
                disabled={isUploading}
                className={`w-full px-6 py-3 text-white font-mono font-bold tracking-widest text-sm uppercase rounded-sm shadow-[4px_4px_0_rgba(0,0,0,0.8)] transition-all z-10 relative ${isUploading ? 'bg-gray-400' : 'bg-[#1877F2] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_rgba(0,0,0,0.8)]'}`}
              >
                {isUploading ? 'Burning...' : 'Burn to Tape'}
              </button>
            </div>

          </div>
        </div>
      </div>
    </>,
    document.body
  );
}