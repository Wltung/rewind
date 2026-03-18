// src/services/song.service.ts
import { http } from "@/lib/http";
import { LyricLine, Song, UploadSongPayload } from "@/types/song";

const BACKEND_DOMAIN = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || "http://127.0.0.1:9001";

export const songService = {
  // 1. Lấy danh sách playlist
  getPlaylist: async (): Promise<Song[]> => {
    const response: any = await http.get("/songs");
    const songs: Song[] = response.data || [];

    // Lặp qua danh sách và gắn domain của Backend vào trước file âm thanh
    return songs.map((song) => {
      // Nếu source bắt đầu bằng "/music" (tức là file upload trên Golang)
      // thì nối thêm "http://127.0.0.1:9001" vào phía trước
      if (song.src && song.src.startsWith("/music")) {
        return { ...song, src: `${BACKEND_DOMAIN}${song.src}` };
      }
      return song;
    });
  },

  // 2. Upload bài hát mới
  uploadSong: async (payload: UploadSongPayload): Promise<Song> => {
    const formData = new FormData();
    formData.append("title", payload.title);
    formData.append("artist", payload.artist);
    formData.append("duration", payload.duration);
    formData.append("lyrics", payload.lyrics);
    formData.append("audio_file", payload.audioFile); // Tên field phải khớp với BE c.FormFile("audio_file")

    // Đẩy thẳng formData vào, http.ts sẽ tự lo liệu phần còn lại
    const response: any = await http.post("/songs/upload", formData);
    
    return response.data;
  },

  // 3. Lấy lời bài hát tự động từ NCT
  fetchNCTLyrics: async (key: string): Promise<LyricLine[]> => {
    const response: any = await http.get(`/songs/nct-lyrics?key=${key}`);
    return response.data;
  },
};