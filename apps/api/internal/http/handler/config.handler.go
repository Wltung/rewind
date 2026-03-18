package handler

import (
	"net/http"
	"rewind/api/internal/model"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type ConfigHandler struct {
	db *gorm.DB
}

func NewConfigHandler(db *gorm.DB) *ConfigHandler {
	return &ConfigHandler{db: db}
}

// GetConfig: Trả về value của một key
func (h *ConfigHandler) GetConfig(c *gin.Context) {
	key := c.Param("key")
	var config model.SiteConfig

	if err := h.db.Where("`key` = ?", key).First(&config).Error; err != nil {
		// Không có data thì trả về chuỗi rỗng
		c.JSON(http.StatusOK, gin.H{"data": ""})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": config.Value})
}

// SetConfig: Lưu mới, Cập nhật hoặc Xóa
func (h *ConfigHandler) SetConfig(c *gin.Context) {
	key := c.Param("key")
	value := c.PostForm("value")

	if value == "" {
		// Value rỗng = Xóa
		h.db.Where("`key` = ?", key).Delete(&model.SiteConfig{})
		c.JSON(http.StatusOK, gin.H{"message": "Đã xóa config"})
		return
	}

	// Dùng Upsert: Có thì ghi đè, chưa có thì tạo mới
	config := model.SiteConfig{Key: key, Value: value}
	h.db.Clauses(clause.OnConflict{
		Columns:   []clause.Column{{Name: "key"}},
		DoUpdates: clause.AssignmentColumns([]string{"value"}),
	}).Create(&config)

	c.JSON(http.StatusOK, gin.H{"message": "Đã lưu config"})
}
