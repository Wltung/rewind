package handler

import (
	"net/http"
	"strconv"

	"rewind/api/internal/model"
	"rewind/api/internal/service"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
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

// Upload ảnh trực tiếp lên Cloudinary
func (h *PolaroidHandler) UploadPolaroid(c *gin.Context) {
	caption := c.PostForm("caption")
	secretMsg := c.PostForm("secret_message")

	fileHeader, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Thiếu file ảnh"})
		return
	}

	// Mở file ra chuẩn bị đẩy lên mây
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
		Folder: "rewind_project/polaroids",
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Lỗi khi upload ảnh lên mây"})
		return
	}

	polaroid := model.Polaroid{
		ImageURL:      uploadResult.SecureURL, // Lấy link HTTPS
		Caption:       caption,
		SecretMessage: secretMsg,
	}

	if err := h.polaroidService.CreatePolaroid(c.Request.Context(), &polaroid); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Lỗi lưu database"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Upload thành công!", "data": polaroid})
}
