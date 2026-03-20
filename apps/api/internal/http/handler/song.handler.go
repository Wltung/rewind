package handler

import (
	"crypto/rc4"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"regexp"
	"strconv"
	"strings"
	"time"

	"rewind/api/internal/model"
	"rewind/api/internal/service"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/gin-gonic/gin"
)

type SongHandler struct {
	songService service.SongService
}

type NCTResponse struct {
	Data struct {
		TimedLyric      string `json:"timedLyric"`
		KeyDecryptLyric string `json:"keyDecryptLyric"` // Key dùng để phá mã
	} `json:"data"`
}

func NewSongHandler(songService service.SongService) *SongHandler {
	return &SongHandler{songService: songService}
}

// GetPlaylist trả về danh sách bài hát và lời
func (h *SongHandler) GetPlaylist(c *gin.Context) {
	songs, err := h.songService.GetPlaylist(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Lỗi khi lấy danh sách bài hát",
		})
		return
	}

	// Trả về JSON với HTTP status 200
	c.JSON(http.StatusOK, gin.H{
		"data": songs,
	})
}

// API Xử lý Upload Nhạc và Lời
// API Xử lý Upload Nhạc và Lời
func (h *SongHandler) UploadSong(c *gin.Context) {
	// 1. Lấy Text Data từ FormData
	title := c.PostForm("title")
	artist := c.PostForm("artist")
	quote := c.PostForm("quote")
	duration := c.PostForm("duration")
	lyricsJSON := c.PostForm("lyrics")

	if title == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Thiếu tên bài hát"})
		return
	}

	// 2. Lấy File MP3
	fileHeader, err := c.FormFile("audio_file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Thiếu file âm thanh"})
		return
	}

	// =========================================================
	// 3. XỬ LÝ UPLOAD LÊN CLOUDINARY THAY VÌ Ổ CỨNG
	// =========================================================

	// Mở file ra để đọc data (Stream)
	file, err := fileHeader.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể mở file âm thanh"})
		return
	}
	defer file.Close()

	// Khởi tạo Cloudinary client từ biến môi trường CLOUDINARY_URL
	cld, err := cloudinary.New()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Lỗi cấu hình Cloudinary: " + err.Error()})
		return
	}

	// Đẩy file lên Cloudinary
	// Lưu ý: File MP3/Audio trên Cloudinary bắt buộc ResourceType phải là "video" hoặc "auto"
	uploadResult, err := cld.Upload.Upload(c.Request.Context(), file, uploader.UploadParams{
		Folder:       "rewind_project/music", // Tên thư mục trên mây, bạn có thể đổi tùy ý
		ResourceType: "auto",                 // Tự động nhận diện file âm thanh
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Lỗi khi upload lên Cloudinary: " + err.Error()})
		return
	}

	// URL lấy từ Cloudinary trả về (đã bảo mật https)
	audioURL := uploadResult.SecureURL

	// =========================================================

	// 4. Parse chuỗi JSON Lyrics thành Struct
	var lyrics []model.LyricLine
	if lyricsJSON != "" {
		if err := json.Unmarshal([]byte(lyricsJSON), &lyrics); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Sai định dạng JSON Lyrics"})
			return
		}
	} else {
		lyrics = []model.LyricLine{} // Khởi tạo mảng rỗng nếu không có lời
	}

	// 5. Lưu vào Database
	song := model.Song{
		Title:         title,
		Artist:        artist,
		Quote:         quote,
		DurationLabel: duration,
		AudioURL:      audioURL, // Lưu cái link Cloudinary dài thòong vào DB
		Lyrics:        lyrics,
	}

	if err := h.songService.CreateSong(c.Request.Context(), &song); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Lỗi lưu vào database"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Upload thành công!",
		"data":    song,
	})
}

// Hàm fetch và parse Lời bài hát từ NCT
func (h *SongHandler) FetchNCTLyrics(c *gin.Context) {
	songKey := c.Query("key")
	if songKey == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Thiếu NCT Song Key"})
		return
	}

	// 1. Gọi API của NCT (Có gắn Fake User-Agent để chống block)
	timestamp := time.Now().UnixMilli()
	nctAPI := fmt.Sprintf("https://graph.nhaccuatui.com/api/v1/song/lyric/detail?songKey=%s&timestamp=%d", songKey, timestamp)

	req, _ := http.NewRequest("GET", nctAPI, nil)
	req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)")

	resp, err := http.DefaultClient.Do(req)
	if err != nil || resp.StatusCode != 200 {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể kết nối đến máy chủ NCT"})
		return
	}
	defer resp.Body.Close()

	var nctData NCTResponse
	if err := json.NewDecoder(resp.Body).Decode(&nctData); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Lỗi đọc dữ liệu từ JSON NCT"})
		return
	}

	if nctData.Data.TimedLyric == "" {
		c.JSON(http.StatusNotFound, gin.H{"error": "Bài hát này không có lời đồng bộ (TimedLyric)"})
		return
	}

	// 2. Tải nội dung file .lrc bị mã hóa
	lrcReq, _ := http.NewRequest("GET", nctData.Data.TimedLyric, nil)
	lrcReq.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)")

	lrcResp, err := http.DefaultClient.Do(lrcReq)
	if err != nil || lrcResp.StatusCode != 200 {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể tải file LRC"})
		return
	}
	defer lrcResp.Body.Close()

	lrcBytes, _ := io.ReadAll(lrcResp.Body)
	lrcContent := string(lrcBytes)

	// =========================================================
	// 3. BƯỚC GIẢI MÃ RC4 THẦN THÁNH
	// =========================================================
	if nctData.Data.KeyDecryptLyric != "" {
		cipher, err := rc4.NewCipher([]byte(nctData.Data.KeyDecryptLyric))
		if err == nil {
			// NCT thường trả về chuỗi Hex mã hóa
			cipherBytes, hexErr := hex.DecodeString(strings.TrimSpace(lrcContent))
			if hexErr != nil {
				// Nếu không phải Hex, dùng luôn raw byte
				cipherBytes = lrcBytes
			}

			plainBytes := make([]byte, len(cipherBytes))
			cipher.XORKeyStream(plainBytes, cipherBytes)
			lrcContent = string(plainBytes) // Ép lại thành chuỗi Text đọc được
		}
	}

	// 4. Parse chuỗi LRC thành JSON chuẩn của app
	// Bắt định dạng: [00:15.50] Lời bài hát...
	re := regexp.MustCompile(`\[(\d{2}):(\d{2}(?:\.\d+)?)\](.*)`)
	lines := strings.Split(lrcContent, "\n")

	var lyrics []model.LyricLine
	for _, line := range lines {
		matches := re.FindStringSubmatch(line)
		if len(matches) == 4 {
			minutes, _ := strconv.ParseFloat(matches[1], 64)
			seconds, _ := strconv.ParseFloat(matches[2], 64)
			text := strings.TrimSpace(matches[3])

			if text != "" {
				lyrics = append(lyrics, model.LyricLine{
					Time: (minutes * 60) + seconds,
					Text: text,
				})
			}
		}
	}

	// Nếu mảng rỗng thì chứng tỏ thuật toán giải mã có vấn đề với bài này
	if len(lyrics) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":       "Không trích xuất được lời. Có thể file không được mã hóa chuẩn RC4.",
			"raw_content": lrcContent,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Parse lời bài hát thành công",
		"data":    lyrics,
	})
}
