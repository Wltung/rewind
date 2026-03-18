"use client";
import React, { useState, useRef, useEffect } from "react";
import { MiniCassette } from "./cassette/MiniCassette";
import { TapePlayer } from "./cassette/TapePlayer";
import { LyricsSheet } from "./cassette/LyricsSheet";
import { UploadModal } from "./cassette/UploadModal";
import { Song } from "@/types/song";
import { songService } from "@/services/song.service";

export function Cassette() {
  // === STATE QUẢN LÝ DỮ LIỆU ===
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // === STATE UI ===
  const [isPlaying, setIsPlaying] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0); 
  const [trackIndex, setTrackIndex] = useState(0); 
  const [requestedSong, setRequestedSong] = useState<{title: string, artist: string} | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);

  // ---> HÀM FETCH PLAYLIST TỪ GOLANG BACKEND
  const fetchPlaylist = async () => {
    try {
      setIsLoading(true);
      const data = await songService.getPlaylist();
      setPlaylist(data);
    } catch (error) {
      console.error("Lỗi tải mixtape:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Chạy 1 lần duy nhất khi vừa load trang mặt bàn
  useEffect(() => {
    fetchPlaylist();
  }, []);

  // ---> XỬ LÝ TRƯỜNG HỢP CHƯA CÓ BÀI HÁT NÀO
  const currentTrack = playlist.length > 0 ? playlist[trackIndex] : {
    id: 0, title: "Empty Tape...", src: "", duration: "00:00", lyrics: []
  };

  // Các hàm điều khiển nhạc (có check playlist.length để không bị lỗi nếu mảng rỗng)
  const toggleMusic = (e?: React.SyntheticEvent) => {
    e?.stopPropagation(); 
    if (audioRef.current && playlist.length > 0) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = (e?: React.SyntheticEvent) => {
    e?.stopPropagation();
    if (playlist.length > 0) setTrackIndex((prev) => (prev + 1) % playlist.length);
  };

  const handlePrev = (e?: React.SyntheticEvent) => {
    e?.stopPropagation();
    if (playlist.length > 0) setTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
  };

  const handleRewind = (e?: React.SyntheticEvent) => {
    e?.stopPropagation();
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setProgress(0);
      setCurrentTime(0);
      if (!isPlaying && playlist.length > 0) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  useEffect(() => {
    if (isPlaying && audioRef.current && playlist.length > 0) {
      setTimeout(() => {
        audioRef.current?.play().catch(e => console.log("Play error:", e));
      }, 100);
    }
  }, [trackIndex, playlist]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setCurrentTime(current); 
      if (duration > 0) setProgress((current / duration) * 100);
    }
  };

  const handleRequestSubmit = (title: string, artist: string) => {
    setRequestedSong({ title, artist });
    setIsUploadOpen(false);
    setIsOpen(false);
  };

  const handleCloseAllModals = () => {
    setIsUploadOpen(false);
    setIsOpen(false);
  };

  const nextTrack1 = playlist.length > 1 ? playlist[(trackIndex + 1) % playlist.length] : null;
  const nextTrack2 = playlist.length > 2 ? playlist[(trackIndex + 2) % playlist.length] : null;

  // Nếu đang gọi API thì hiện loading mini trên mặt bàn (tùy chọn)
  if (isLoading) {
    return <div className="absolute bottom-10 left-10 text-white font-mono text-xs opacity-50">Loading mixtape...</div>;
  }

  return (
    <>
      <style>{`
        @keyframes modal-in {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-modal-in {
          animation: modal-in 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; 
        }
      `}</style>

      <audio 
        ref={audioRef} 
        src={currentTrack.src} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
      />

      {/* Component Nút Cuốn Băng Nhỏ */}
      <MiniCassette 
        currentTrack={currentTrack} 
        isPlaying={isPlaying} 
        onOpen={() => setIsOpen(true)} 
      />

      {/* ========================================================= */}
      {/* TỜ NOTE VÀNG (SONG REQUEST) TRÊN MẶT BÀN */}
      {/* ========================================================= */}
      {requestedSong && (
        <div 
          onClick={() => setIsUploadOpen(true)} // Bấm vào để sửa request
          className="hover-lift absolute bottom-4 left-[280px] lg:bottom-12 lg:left-[360px] xl:bottom-20 xl:left-[420px] z-10 w-32 lg:w-36 h-32 lg:h-36 bg-[#FCEA7A] shadow-[2px_4px_6px_rgba(0,0,0,0.15)] transform rotate-3 flex flex-col items-center justify-center p-3 text-center cursor-pointer border border-yellow-200/50"
          style={{ '--hover-rotate': '6deg' } as React.CSSProperties}
        >
          {/* Cái ghim đỏ */}
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-700 rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.4)] border border-red-900/50 flex items-center justify-center">
            <div className="w-1 h-1 bg-white/60 rounded-full translate-x-[-1px] translate-y-[-1px]"></div>
          </div>
          
          <p className="font-hand text-ink text-sm lg:text-base leading-tight opacity-80 mb-1">Song Request</p>
          <p className="font-hand text-ink font-bold text-base lg:text-lg leading-tight truncate w-full px-2">
            "{requestedSong.title}"
          </p>
          {requestedSong.artist && (
            <p className="font-hand text-ink text-sm lg:text-base leading-tight truncate w-full mt-1">
              - {requestedSong.artist} -
            </p>
          )}
        </div>
      )}

      {/* OVERLAY MODAL */}
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-8">
          {/* Lớp Backdrop mờ */}
          <div className="absolute inset-0 bg-[#4a463e]/80 backdrop-blur-md cursor-pointer transition-opacity duration-1000" onClick={() => setIsOpen(false)} />

          {/* SỬA: Đổi max-w-5xl thành max-w-6xl */}
          <div className="relative z-10 w-full max-w-6xl flex flex-col animate-modal-in">
            {/* Header Modal - Sẽ tự động dạt ra 2 bên nhờ max-w-6xl */}
            <div className="w-full flex justify-between items-center mb-6 text-white">
              <div className="flex items-center gap-4">
                <h2 className="text-3xl md:text-4xl font-hand font-bold tracking-wide">The Mixtape</h2>
                {/* Huy hiệu LIVE nhấp nháy */}
                <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-black/40 rounded-full border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                  <span className="text-[10px] font-mono font-bold tracking-widest text-white/80 uppercase mt-0.5">LIVE FROM DESK</span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="group flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-all text-sm font-bold tracking-wider uppercase border border-white/20">
                <span>Close Player</span>
                <span className="material-symbols-outlined text-lg group-hover:rotate-90 transition-transform">close</span>
              </button>
            </div>

            {/* SỬA: Đổi lg:gap-12 thành lg:gap-20 để 2 cột xa nhau hơn */}
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-20 items-center lg:items-center justify-center">
              
              <TapePlayer 
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                progress={progress}
                currentTime={currentTime}
                audioRef={audioRef}
                onToggleMusic={toggleMusic}
                onNext={handleNext}
                onPrev={handlePrev}
                onRewind={handleRewind}
                onOpenUpload={() => setIsUploadOpen(true)}
                nextTrack1={nextTrack1}
                nextTrack2={nextTrack2}
              />

              <LyricsSheet 
                currentTrack={currentTrack}
                currentTime={currentTime}
                audioRef={audioRef}
                isPlaying={isPlaying}
                onToggleMusic={toggleMusic}
              />

            </div>
          </div>
        </div>
      )}

      {/* GỌI COMPONENT UPLOAD MODAL Ở NGOÀI CÙNG */}
      <UploadModal
        isOpen={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)} 
        onSubmitRequest={handleRequestSubmit}
        onUploadSuccess={fetchPlaylist}
      />
    </>
  );
}