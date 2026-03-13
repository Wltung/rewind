package auth

import (
	"errors"
	"time"

	"rewind/api/internal/config" // Thay bằng tên module của bạn

	"github.com/golang-jwt/jwt/v5"
)

// GenerateToken tạo ra chuỗi JWT có hạn 7 ngày
func GenerateToken() (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"authorized": true,
		"exp":        time.Now().Add(time.Hour * 24 * 7).Unix(),
	})

	return token.SignedString([]byte(config.Cfg.JWTSecret))
}

// ValidateToken kiểm tra tính hợp lệ của token
func ValidateToken(tokenString string) error {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return []byte(config.Cfg.JWTSecret), nil
	})

	if err != nil || !token.Valid {
		return errors.New("token không hợp lệ hoặc đã hết hạn")
	}

	return nil
}
