package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"

	"rewind/api/internal/auth" // Thay bằng module của bạn
	"rewind/api/internal/db"
	"rewind/api/internal/model"
)

type LoginRequest struct {
	Password string `json:"password" binding:"required"`
}

func Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Vui lòng nhập mật khẩu"})
		return
	}

	// Kéo chuỗi hash mật khẩu từ DB lên
	var config model.SiteConfig
	if err := db.DB.Where("`key` = ?", "master_password").First(&config).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Hệ thống chưa thiết lập mật khẩu"})
		return
	}

	// So sánh mật khẩu người dùng nhập (ví dụ: 3001) với chuỗi Hash
	if err := bcrypt.CompareHashAndPassword([]byte(config.Value), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Mật khẩu không chính xác!"})
		return
	}

	// Mật khẩu đúng -> Tạo Token
	tokenString, err := auth.GenerateToken()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể tạo phiên đăng nhập"})
		return
	}

	// Nhét Token vào HTTP-Only Cookie
	// Các tham số: name, value, maxAge (giây), path, domain, secure, httpOnly
	c.SetCookie("rewind_auth", tokenString, 3600*24*7, "/", "localhost", false, true)

	c.JSON(http.StatusOK, gin.H{"message": "Mở khóa thành công!"})
}

// CheckAuth dùng để FE gọi mỗi khi load trang xem Cookie còn hạn không
func CheckAuth(c *gin.Context) {
	cookie, err := c.Cookie("rewind_auth")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Chưa xác thực"})
		return
	}

	if err := auth.ValidateToken(cookie); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Phiên đăng nhập hết hạn"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Xác thực thành công"})
}

// Logout dùng để xóa Cookie
func Logout(c *gin.Context) {
	c.SetCookie("rewind_auth", "", -1, "/", "localhost", false, true)
	c.JSON(http.StatusOK, gin.H{"message": "Đã khóa không gian"})
}
