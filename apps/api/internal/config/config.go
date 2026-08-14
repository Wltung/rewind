package config

import (
	"log"

	"github.com/joho/godotenv"
)

type AppConfig struct {
	Port           string
	DBHost         string
	DBPort         string
	DBUser         string
	DBPassword     string
	DBName         string
	JWTSecret      string
	AllowedOrigins string
}

var Cfg AppConfig

func LoadConfig() {
	// Đọc file .env, nếu không có file thì hệ thống sẽ đọc từ OS Environment
	if err := godotenv.Load(); err != nil {
		log.Println("Cảnh báo: Không tìm thấy file .env, đang sử dụng OS Environment Variables")
	}

	Cfg = AppConfig{
		Port:           GetEnv("PORT", "8080"),
		DBHost:         GetEnv("DB_HOST", "127.0.0.1"),
		DBPort:         GetEnv("DB_PORT", "3306"),
		DBUser:         GetEnv("DB_USER", "root"),
		DBPassword:     GetEnv("DB_PASSWORD", "abc@123"),
		DBName:         GetEnv("DB_NAME", "rewind_db"),
		JWTSecret:      GetEnv("JWT_SECRET", "default_secret"),
		AllowedOrigins: GetEnv("CORS_ORIGINS", "http://localhost:3070"),
	}
}
