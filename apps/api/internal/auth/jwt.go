package auth

import (
	"errors"
	"time"

	"rewind/api/internal/config" // Thay bằng tên module của bạn

	"github.com/golang-jwt/jwt/v5"
)

type Claims struct {
	UserID   uint   `json:"user_id"`
	Username string `json:"username"`
	// Bạn có thể thêm Role nếu sau này muốn phân quyền Admin/Nhân viên
	jwt.RegisteredClaims
}

// GenerateToken tạo ra chuỗi JWT có hạn 7 ngày
func GenerateToken() (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"authorized": true,
		"exp":        time.Now().Add(time.Hour * 24 * 7).Unix(),
	})

	return token.SignedString([]byte(config.Cfg.JWTSecret))
}

// ValidateToken kiểm tra tính hợp lệ của token
func ValidateToken(tokenString string) (*Claims, error) {
	claims := &Claims{} // 1. Khai báo biến claims để ParseWithClaims đổ dữ liệu vào

	// 2. Sử dụng ParseWithClaims thay vì Parse để lấy dữ liệu UserID, v.v.
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(config.Cfg.JWTSecret), nil
	})

	// 3. Kiểm tra lỗi Parse (Token sai định dạng, hết hạn, v.v.)
	if err != nil {
		return nil, err // Phải trả về 2 giá trị: nil cho *Claims và lỗi err
	}

	// 4. Kiểm tra tính hợp lệ của Token
	if !token.Valid {
		return nil, errors.New("token không hợp lệ")
	}

	// 5. Mọi thứ ổn, trả về claims và nil cho error
	return claims, nil
}
