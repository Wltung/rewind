"use client";
import React, { useState, useRef, useEffect } from "react";
import { MiniCassette } from "./cassette/MiniCassette";
import { TapePlayer } from "./cassette/TapePlayer";
import { LyricsSheet } from "./cassette/LyricsSheet";
import { UploadModal } from "./cassette/UploadModal";
import { Song } from "@/types/song";
import { songService } from "@/services/song.service";
import { DeskNote } from "@/types/config";
import { configService } from "@/services/config.service";

export function Cassette() {
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  
  // ---> STATE CHO KHAY BĂNG TÌM KIẾM <---
  const [isTrayOpen, setIsTrayOpen] = useState(false);
  const [isTrayClosing, setIsTrayClosing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0); 
  const [trackIndex, setTrackIndex] = useState(0); 
  const [requestedSong, setRequestedSong] = useState<{title: string, artist: string} | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);

  const [deskNote, setDeskNote] = useState<DeskNote | null>(null);

  // ---> 1. VIẾT HÀM LẤY TỜ NOTE RA RIÊNG ĐỂ DÙNG NHIỀU LẦN <---
  const fetchDeskNote = async () => {
    const note = await configService.getDeskNote();
    if (note) {
      const isExpired = Date.now() - note.timestamp > 86400000;
      if (isExpired) {
        await configService.setDeskNote(null);
        setDeskNote(null); // Quá hạn thì set null để ẩn
      } else {
        setDeskNote(note); // Còn hạn thì cập nhật State UI
      }
    } else {
      setDeskNote(null); // Không có trong DB thì set null
    }
  };

  // ---> 2. GỌI HÀM KHI VỪA VÀO WEB (F5) <---
  useEffect(() => {
    fetchDeskNote();
  }, []);

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

  useEffect(() => { fetchPlaylist(); }, []);

  const currentTrack = playlist.length > 0 ? playlist[trackIndex] : {
    id: 0, title: "Empty Tape...", src: "", duration: "00:00", lyrics: []
  };

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

  // ---> HÀM ĐÓNG KHAY <---
  const handleCloseTray = () => {
    setIsTrayClosing(true); // 1. Bật hiệu ứng trượt xuống
    setTimeout(() => {
      setIsTrayOpen(false); // 2. Đợi 400ms trượt xong mới giấu đi
      setIsTrayClosing(false); // 3. Reset trạng thái
    }, 400); 
  };

  // ---> HÀM XỬ LÝ KHI CHỌN BĂNG TỪ KHAY TÌM KIẾM <---
  const handleSelectTrackFromTray = (index: number) => {
    setTrackIndex(index);
    handleCloseTray();
    setIsPlaying(true); // Tự động chạy nhạc
    setTimeout(() => {
      audioRef.current?.play().catch(e => console.log(e));
    }, 100);
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

  const handleRequestSubmit = async (title: string, artist: string) => {
    // Gọi lại hàm lấy dữ liệu từ DB để UI render ngay tờ note mới
    await fetchDeskNote(); 
    
    // Đóng các Modal lại
    setIsUploadOpen(false);
    setIsOpen(false);
  };

  const nextTrack1 = playlist.length > 1 ? playlist[(trackIndex + 1) % playlist.length] : null;
  const nextTrack2 = playlist.length > 2 ? playlist[(trackIndex + 2) % playlist.length] : null;

  // Lọc Playlist theo Search
  const filteredPlaylist = playlist.filter(song => 
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    song.artist?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <div className="absolute bottom-10 left-10 text-white font-mono text-xs opacity-50">Loading mixtape...</div>;
  }

  return (
    <>
      <style>{`
        /* Giữ nguyên các animation cũ */
        @keyframes modal-in { 0% { opacity: 0; transform: scale(0.9); } 100% { opacity: 1; transform: scale(1); } }
        .animate-modal-in { animation: modal-in 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        
        /* Hiệu ứng trượt Lên / Xuống cho khay băng */
        @keyframes slide-up { 0% { transform: translateY(100%); } 100% { transform: translateY(0); } }
        .animate-slide-up { animation: slide-up 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        
        @keyframes slide-down { 0% { transform: translateY(0); } 100% { transform: translateY(100%); } }
        .animate-slide-down { animation: slide-down 0.4s cubic-bezier(0.36, 0, 0.66, -0.56) forwards; }

        /* Hiệu ứng mờ dần cho lớp nền đen */
        @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.4s ease forwards; }
        
        @keyframes fade-out { 0% { opacity: 1; } 100% { opacity: 0; } }
        .animate-fade-out { animation: fade-out 0.4s ease forwards; }

        .tape-scrollbar::-webkit-scrollbar { width: 8px; }
        .tape-scrollbar::-webkit-scrollbar-track { background: #1a1713; border-radius: 4px; }
        .tape-scrollbar::-webkit-scrollbar-thumb { background: #4a453b; border-radius: 4px; }
      `}</style>  

      <audio ref={audioRef} src={currentTrack.src} onTimeUpdate={handleTimeUpdate} onEnded={handleNext} />

      <MiniCassette currentTrack={currentTrack} isPlaying={isPlaying} onOpen={() => setIsOpen(true)} />

      {deskNote && (
        <div 
          onClick={() => setIsUploadOpen(true)}
          className="hover-lift absolute bottom-4 left-[280px] lg:bottom-12 lg:left-[360px] xl:bottom-20 xl:left-[420px] z-10 w-32 lg:w-36 h-32 lg:h-36 bg-[#FCEA7A] shadow-[2px_4px_6px_rgba(0,0,0,0.15)] transform rotate-3 flex flex-col items-center justify-center p-3 text-center cursor-pointer border border-yellow-200/50"
          style={{ '--hover-rotate': '6deg' } as React.CSSProperties}
        >
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-700 rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.4)] border border-red-900/50 flex items-center justify-center">
            <div className="w-1 h-1 bg-white/60 rounded-full translate-x-[-1px] translate-y-[-1px]"></div>
          </div>
          <p className="font-hand text-ink text-sm lg:text-base leading-tight opacity-80 mb-1">Song Request</p>
          <p className="font-hand text-ink font-bold text-base lg:text-lg leading-tight truncate w-full px-2">"{deskNote.title}"</p>
          {deskNote.artist && <p className="font-hand text-ink text-sm lg:text-base leading-tight truncate w-full mt-1">- {deskNote.artist} -</p>}
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-8 overflow-hidden">
          <div className="absolute inset-0 bg-[#4a463e]/80 backdrop-blur-md cursor-pointer transition-opacity duration-1000" onClick={() => setIsOpen(false)} />

          <div className="relative z-10 w-full max-w-6xl flex flex-col animate-modal-in">
            <div className="w-full flex justify-between items-center mb-6 text-white px-4 md:px-0">
              <div className="flex items-center gap-4">
                <h2 className="text-3xl md:text-4xl font-hand font-bold tracking-wide">The Mixtape</h2>
                <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-black/40 rounded-full border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                  <span className="text-[10px] font-mono font-bold tracking-widest text-white/80 uppercase mt-0.5">LIVE FROM DESK</span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="group flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-all text-sm font-bold tracking-wider uppercase border border-white/20">
                <span className="hidden sm:inline">Close</span>
                <span className="material-symbols-outlined text-lg group-hover:rotate-90 transition-transform">close</span>
              </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-20 items-center lg:items-start justify-center relative">
              <TapePlayer 
                currentTrack={currentTrack} isPlaying={isPlaying} progress={progress}
                currentTime={currentTime} audioRef={audioRef} onToggleMusic={toggleMusic}
                onNext={handleNext} onPrev={handlePrev} onRewind={handleRewind}
                onOpenUpload={() => setIsUploadOpen(true)}
                onEject={() => setIsTrayOpen(true)} // ---> TRUYỀN HÀM MỞ KHAY <---
                nextTrack1={nextTrack1} nextTrack2={nextTrack2}
              />
              <LyricsSheet 
                currentTrack={currentTrack} currentTime={currentTime} audioRef={audioRef}
                isPlaying={isPlaying} onToggleMusic={toggleMusic}
              />
            </div>
          </div>

          {/* ========================================================= */}
          {/* KHAY BĂNG CASSETTE (TRAY OVERLAY) HIỆN LÊN KHI BẤM EJECT */}
          {/* ========================================================= */}
          {isTrayOpen && (
            <div className="absolute inset-0 z-[400] flex items-end justify-center pointer-events-none overflow-hidden">
              {/* Lớp nền đen che mờ máy cassette bên dưới */}
              <div 
                className={`absolute inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto ${isTrayClosing ? 'animate-fade-out' : 'animate-fade-in'}`} 
                onClick={handleCloseTray} // Dùng hàm đóng mượt
              />
              
              {/* Hộc khay băng trượt lên */}
              <div className={`relative w-full max-w-4xl h-[75vh] md:h-[65vh] bg-[#2C2822] rounded-t-2xl shadow-[0_-20px_50px_rgba(0,0,0,0.8)] flex flex-col border-t-8 border-[#1A1713] pointer-events-auto ${isTrayClosing ? 'animate-slide-down' : 'animate-slide-up'}`}>
                
                {/* Header khay & Ô Search */}
                <div className="flex flex-col md:flex-row items-center justify-between p-4 md:p-6 border-b border-white/10 bg-[#24201B] rounded-t-xl gap-4">
                  <h3 className="font-hand text-2xl md:text-3xl text-[#E8DCC4] flex items-center gap-2">
                    <span className="material-symbols-outlined text-yellow-500">album</span> Chọn Băng Mới
                  </h3>
                  
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                      <input 
                        type="text" 
                        placeholder="Tìm theo tên hoặc ca sĩ..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#1A1713] border border-white/20 text-[#E8DCC4] px-4 py-2.5 rounded-md font-mono text-sm outline-none focus:border-yellow-500/50 placeholder:text-white/30 shadow-inner"
                      />
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">search</span>
                    </div>
                    {/* Nút X cũng dùng hàm đóng mượt */}
                    <button 
                      onClick={handleCloseTray}
                      className="w-10 h-10 shrink-0 bg-white/10 hover:bg-red-500/80 rounded-md flex items-center justify-center text-white transition-colors"
                    >
                      <span className="material-symbols-outlined text-xl">close</span>
                    </button>
                  </div>
                </div>

                {/* Danh sách các cuộn băng */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-max tape-scrollbar">
                  {filteredPlaylist.map((track) => (
                    <div 
                      key={track.id}
                      onClick={() => handleSelectTrackFromTray(playlist.findIndex(t => t.id === track.id))}
                      className="relative bg-[#DDD5C7] rounded-sm p-2 pb-3 shadow-[4px_4px_10px_rgba(0,0,0,0.5)] border-b-4 border-r-4 border-black/40 cursor-pointer hover:-translate-y-2 hover:shadow-[6px_6px_15px_rgba(0,0,0,0.6)] transition-all group"
                    >
                      <div className="w-full h-full bg-white border border-gray-300 rounded-[1px] p-2 flex flex-col items-center justify-center relative shadow-inner">
                        <div className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-gray-400 border border-gray-500"/>
                        <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-gray-400 border border-gray-500"/>
                        
                        <div className="w-full bg-[#FFE5B4] border border-yellow-400/50 px-2 py-1 mt-3 mb-1 transform -rotate-1 shadow-sm text-center">
                           <p className="font-hand font-bold text-ink text-sm md:text-base leading-tight truncate w-full group-hover:text-[#1877F2] transition-colors">{track.title}</p>
                        </div>
                        <p className="font-hand text-gray-500 text-[10px] md:text-xs truncate w-full text-center">{track.artist || "Unknown"}</p>
                      </div>
                      
                      {/* Băng dính decor nhỏ */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-2 bg-white/40 backdrop-blur-sm -rotate-2" />
                    </div>
                  ))}
                  
                  {filteredPlaylist.length === 0 && (
                    <div className="col-span-full py-10 flex flex-col items-center justify-center text-white/40">
                      <span className="material-symbols-outlined text-4xl mb-2">search_off</span>
                      <p className="font-mono text-sm">Không tìm thấy cuốn băng nào...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {/* ========================================================= */}

        </div>
      )}

      <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} onSubmitRequest={handleRequestSubmit} onUploadSuccess={fetchPlaylist} />
    </>
  );
}