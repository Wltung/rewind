package middleware

import (
	"net/http"

	"rewind/api/internal/auth" // Đổi tên module của bạn

	"github.com/gin-gonic/gin"
)

// RequireAuth là trạm gác chặn các request không có vé (Cookie)
func RequireAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		// 1. Móc Cookie ra từ request
		cookie, err := c.Cookie("rewind_auth")
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Không phận sự miễn vào!"})
			return
		}

		// 2. Nhờ hàm ValidateToken (bạn đã viết ở jwt.go) kiểm tra vé
		if err := auth.ValidateToken(cookie); err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Vé đã hết hạn hoặc không hợp lệ"})
			return
		}

		// 3. Vé hợp lệ, mở cổng cho đi tiếp vào Handler
		c.Next()
	}
}
