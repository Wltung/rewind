package handler

import (
	"net/http"
	"rewind/api/internal/model"
	"rewind/api/internal/service"

	"github.com/gin-gonic/gin"
)

type NotebookHandler struct {
	service service.NotebookService
}

func NewNotebookHandler(s service.NotebookService) *NotebookHandler {
	return &NotebookHandler{service: s}
}

func (h *NotebookHandler) Get(c *gin.Context) {
	notebook, err := h.service.GetNotebook()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể lấy dữ liệu sổ tay"})
		return
	}
	c.JSON(http.StatusOK, notebook)
}

func (h *NotebookHandler) Update(c *gin.Context) {
	var input model.Notebook
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dữ liệu gửi lên không hợp lệ"})
		return
	}

	if err := h.service.UpdateNotebook(&input); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Lỗi khi lưu sổ tay"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Đã lưu sổ tay thành công",
		"data":    input,
	})
}
