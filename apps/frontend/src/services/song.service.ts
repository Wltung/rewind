import { http } from "@/lib/http";
import { LyricLine, Song, UploadSongPayload } from "@/types/song";

const ASSET_DOMAIN = "https://rewind-api-2muu.onrender.com";

const getFullUrl = (url?: string) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  const cleanPath = url.startsWith("/") ? url : `/${url}`;
  return `${ASSET_DOMAIN}${cleanPath}`;
};

export const songService = {
  // 1. Lấy danh sách playlist
  getPlaylist: async (): Promise<Song[]> => {
    const response: any = await http.get("/songs");
    const songs: Song[] = response.data || [];

    // Tự động gắn domain cho file âm thanh
    return songs.map((song) => ({ ...song, src: getFullUrl(song.src) }));
  },

  // 2. Upload bài hát mới
  uploadSong: async (payload: UploadSongPayload): Promise<Song> => {
    const formData = new FormData();
    formData.append("title", payload.title);
    formData.append("artist", payload.artist);
    formData.append("quote", payload.quote || "");
    formData.append("duration", payload.duration);
    formData.append("lyrics", payload.lyrics);
    formData.append("audio_file", payload.audioFile);

    const response: any = await http.post("/songs/upload", formData);
    const song: Song = response.data;
    if (song) song.src = getFullUrl(song.src);
    return song;
  },

  // 3. Lấy lời bài hát tự động từ NCT
  fetchNCTLyrics: async (key: string): Promise<LyricLine[]> => {
    const response: any = await http.get(`/songs/nct-lyrics?key=${key}`);
    return response.data;
  },
};