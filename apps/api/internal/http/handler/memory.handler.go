package handler

import (
	"net/http"
	"rewind/api/internal/service"

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
	memory, err := h.service.GetRandom()
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Chưa có bức ảnh nào trong kho"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": memory,
	})
}
