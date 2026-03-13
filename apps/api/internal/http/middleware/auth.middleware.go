package middleware

import (
	"net/http"
	"rewind/api/internal/auth" // Đảm bảo đúng path module của bạn

	"github.com/gin-gonic/gin"
)

func RequireAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		cookie, err := c.Cookie("rewind_auth")
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Vui lòng đăng nhập!"})
			return
		}

		// Sửa lại đoạn này: Giả sử ValidateToken của bạn trả về Claims hoặc UserID
		claims, err := auth.ValidateToken(cookie)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Phiên đăng nhập hết hạn"})
			return
		}

		// Lưu userID vào context để các hàm sau (như tạo hóa đơn) có thể lấy ra dùng
		c.Set("userID", claims.UserID)

		c.Next()
	}
}
