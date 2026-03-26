package auth

import (
	"errors"
	// Đã xóa thư viện "time" vì không cần đếm thời gian nữa

	"rewind/api/internal/config"

	"github.com/golang-jwt/jwt/v5"
)

// GenerateToken tạo ra chuỗi JWT KHÔNG BAO GIỜ HẾT HẠN
func GenerateToken() (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"authorized": true,
		// Đã xóa dòng "exp" (thời gian hết hạn)
	})

	return token.SignedString([]byte(config.Cfg.JWTSecret))
}

// ValidateToken kiểm tra tính hợp lệ và CỨU SỐNG token cũ
func ValidateToken(tokenString string) error {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return []byte(config.Cfg.JWTSecret), nil
	})

	if err != nil {
		// ĐÂY LÀ PHÉP MÀU: Nếu lỗi CHỈ LÀ do hết hạn, ta tha bổng và coi như hợp lệ!
		if errors.Is(err, jwt.ErrTokenExpired) {
			return nil
		}
		// Nếu lỗi do sai chữ ký (bị giả mạo) thì vẫn block thẳng tay
		return errors.New("token không hợp lệ hoặc bị giả mạo")
	}

	if !token.Valid {
		return errors.New("token không hợp lệ")
	}

	return nil
}
