package auth

import "golang.org/x/crypto/bcrypt"

// HashPassword băm mật khẩu ra chuỗi loằng ngoằng
func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}

// CheckPassword so sánh mật khẩu FE gửi lên với chuỗi Hash trong DB
func CheckPassword(hash, password string) error {
	return bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
}
