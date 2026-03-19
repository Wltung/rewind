package handler

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"time"

	"rewind/api/internal/model"
	"rewind/api/internal/service"

	"github.com/gin-gonic/gin"
)

type PolaroidHandler struct {
	polaroidService service.PolaroidService
}

func NewPolaroidHandler(polaroidService service.PolaroidService) *PolaroidHandler {
	return &PolaroidHandler{polaroidService: polaroidService}
}

func (h *PolaroidHandler) GetRandomPolaroid(c *gin.Context) {
	excludeIDStr := c.Query("excludeId")
	var excludeID int64 = 0
	if excludeIDStr != "" {
		excludeID, _ = strconv.ParseInt(excludeIDStr, 10, 64)
	}

	polaroid, err := h.polaroidService.GetRandomPolaroid(c.Request.Context(), excludeID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy polaroid nào"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": polaroid})
}

func (h *PolaroidHandler) UploadPolaroid(c *gin.Context) {
	caption := c.PostForm("caption")
	secretMsg := c.PostForm("secret_message")

	file, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Thiếu file ảnh"})
		return
	}

	uploadDir := "./uploads/images"
	os.MkdirAll(uploadDir, os.ModePerm)

	filename := fmt.Sprintf("%d_polaroid_%s", time.Now().Unix(), filepath.Base(file.Filename))
	dst := filepath.Join(uploadDir, filename)

	if err := c.SaveUploadedFile(file, dst); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Lỗi lưu file ảnh"})
		return
	}

	polaroid := model.Polaroid{
		ImageURL:      "/images/" + filename,
		Caption:       caption,
		SecretMessage: secretMsg,
	}

	if err := h.polaroidService.CreatePolaroid(c.Request.Context(), &polaroid); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Lỗi lưu database"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Upload thành công!", "data": polaroid})
}
