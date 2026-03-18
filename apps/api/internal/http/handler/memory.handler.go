package handler

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"rewind/api/internal/model"
	"rewind/api/internal/service"
	"strconv"
	"time"

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
	// Lấy ID cần loại trừ từ URL
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

// API Xử lý Upload Ảnh Polaroid hoặc Tờ Note Vàng
func (h *MemoryHandler) UploadMemory(c *gin.Context) {
	caption := c.PostForm("caption")
	secretMessage := c.PostForm("secret_message") // Lấy câu bí mật mặt sau
	memoryDateStr := c.PostForm("memory_date")    // VD: 2026-03-08

	// Parse ngày tháng
	var memoryDate time.Time
	if memoryDateStr != "" {
		parsedDate, err := time.Parse("2006-01-02", memoryDateStr)
		if err == nil {
			memoryDate = parsedDate
		} else {
			memoryDate = time.Now() // Nếu lỗi format thì lấy ngày hiện tại
		}
	} else {
		memoryDate = time.Now()
	}

	var imageURL string

	// Thử lấy file ảnh từ Request
	file, err := c.FormFile("image_file")
	if err == nil && file != nil {
		// TẠO POLAROID: Lưu file ảnh vào ổ cứng
		uploadDir := "./uploads/images"
		if err := os.MkdirAll(uploadDir, os.ModePerm); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể tạo thư mục lưu ảnh"})
			return
		}

		filename := fmt.Sprintf("%d_%s", time.Now().Unix(), filepath.Base(file.Filename))
		dst := filepath.Join(uploadDir, filename)

		if err := c.SaveUploadedFile(file, dst); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Lỗi khi lưu file ảnh"})
			return
		}
		imageURL = "/images/" + filename
	} else {
		// TẠO TỜ NOTE VÀNG: Nếu không up ảnh, imageURL rỗng
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

	// Gọi service lưu vào DB
	if err := h.service.CreateMemory(&memory); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Lỗi khi lưu kỷ niệm vào Database"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Đã thêm kỷ niệm thành công!",
		"data":    memory,
	})
}
