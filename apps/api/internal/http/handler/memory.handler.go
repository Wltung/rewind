package handler

import (
	"net/http"
	"rewind/api/internal/db"    // Nhớ thay bằng tên module của bạn
	"rewind/api/internal/model" // Nhớ thay bằng tên module của bạn

	"github.com/gin-gonic/gin"
)

// GetAllMemories trả về danh sách toàn bộ ảnh kỷ yếu, sắp xếp mới nhất lên đầu
func GetAllMemories(c *gin.Context) {
	var memories []model.Memory

	// Lấy tất cả, sắp xếp theo ngày chụp giảm dần
	if err := db.DB.Order("memory_date desc").Find(&memories).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể lấy dữ liệu kỷ niệm"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":  memories,
		"total": len(memories),
	})
}

// GetRandomMemory trả về đúng 1 bức ảnh ngẫu nhiên cho tính năng Gacha Polaroid
func GetRandomMemory(c *gin.Context) {
	var memory model.Memory

	// Query random chuẩn của MySQL: ORDER BY RAND() LIMIT 1
	if err := db.DB.Order("RAND()").First(&memory).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Chưa có bức ảnh nào trong kho"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": memory,
	})
}
