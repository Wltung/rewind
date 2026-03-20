package handler

import (
	"net/http"
	"rewind/api/internal/model"
	"rewind/api/internal/service"
	"strconv"
	"time"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/gin-gonic/gin"
)

// Đóng gói service vào struct của handler
type MemoryHandler struct {
	service service.MemoryService
}

func NewMemoryHandler(service service.MemoryService) *MemoryHandler {
	return &MemoryHandler{service}
}

func (h *MemoryHandler) GetAllMemories(c *gin.Context) {
	memories, err := h.service.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể lấy dữ liệu ảnh kỷ yếu"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":  memories,
		"total": len(memories),
	})
}

func (h *MemoryHandler) GetRandomMemory(c *gin.Context) {
	excludeIDStr := c.Query("exclude_id")
	var excludeID int64
	if excludeIDStr != "" {
		excludeID, _ = strconv.ParseInt(excludeIDStr, 10, 64)
	}

	memory, err := h.service.GetRandom(excludeID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy ảnh phù hợp (hoặc chỉ có 1 ảnh trong kho)"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": memory,
	})
}

// API Xử lý Upload Ảnh Polaroid hoặc Tờ Note Vàng lên Cloudinary
func (h *MemoryHandler) UploadMemory(c *gin.Context) {
	caption := c.PostForm("caption")
	secretMessage := c.PostForm("secret_message")
	memoryDateStr := c.PostForm("memory_date")

	var memoryDate time.Time
	if memoryDateStr != "" {
		parsedDate, err := time.Parse("2006-01-02", memoryDateStr)
		if err == nil {
			memoryDate = parsedDate
		} else {
			memoryDate = time.Now()
		}
	} else {
		memoryDate = time.Now()
	}

	var imageURL string

	// Thử lấy file ảnh từ Request
	fileHeader, err := c.FormFile("image_file")
	if err == nil && fileHeader != nil {
		// --- CÓ FILE ẢNH: ĐẨY LÊN CLOUDINARY ---
		file, err := fileHeader.Open()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể đọc file ảnh"})
			return
		}
		defer file.Close()

		cld, err := cloudinary.New()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Lỗi cấu hình Cloudinary"})
			return
		}

		uploadResult, err := cld.Upload.Upload(c.Request.Context(), file, uploader.UploadParams{
			Folder: "rewind_project/memories", // Đổi tên thư mục tùy thích
		})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Lỗi khi upload ảnh lên mây"})
			return
		}

		imageURL = uploadResult.SecureURL // Lấy link HTTPS từ Cloudinary
	} else {
		// --- TẠO TỜ NOTE VÀNG (Không có ảnh) ---
		imageURL = ""
		if caption == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Đã không có ảnh thì phải viết vài chữ (caption) chứ!"})
			return
		}
	}

	// Đóng gói data
	memory := model.Memory{
		ImageURL:      imageURL,
		Caption:       caption,
		SecretMessage: secretMessage,
		MemoryDate:    memoryDate,
	}

	if err := h.service.CreateMemory(&memory); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Lỗi khi lưu kỷ niệm vào Database"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Đã thêm kỷ niệm thành công!",
		"data":    memory,
	})
}
