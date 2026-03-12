package config

import "os"

// GetEnv lấy giá trị từ biến môi trường, nếu không có thì dùng fallback
func GetEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}
