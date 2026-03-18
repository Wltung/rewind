// src/types/song.ts

export interface LyricLine {
    time: number; // Mốc thời gian (giây)
    text: string; // Lời bài hát
  }
  
  export interface Song {
    id: number;
    title: string;
    artist: string;
    quote?: string;
    src: string;          // Khớp với AudioURL của BE trả về
    duration: string;     // VD: "90 MIN"
    order_index: number;
    lyrics: LyricLine[];
  }
  
  export interface UploadSongPayload {
    title: string;
    artist: string;
    quote?: string;
    duration: string;
    lyrics: string; // Chuỗi JSON
    audioFile: File;
  }