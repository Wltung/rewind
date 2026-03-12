package main

import (
	"flag"
	"log"

	"github.com/gin-gonic/gin"

	"rewind/api/internal/config" // Đổi tên module
	"rewind/api/internal/db"
	"rewind/api/internal/http"
)

func main() {
	isDown := flag.Bool("down", false, "Chạy lệnh down để dọn dẹp database")
	flag.Parse() // Bắt buộc phải gọi hàm này để Go đọc tham số từ terminal

	// 1. Tải cấu hình & Database
	config.LoadConfig()
	db.Connect()

	if *isDown {
		db.Migrate("down")
		log.Println("🧹 Đã dọn dẹp xong Database. Đang thoát chương trình...")
		return
	}

	db.Migrate("up")
	db.Seed() // Chạy seed tạo master_password

	// 2. Khởi tạo Router Gin
	r := gin.Default()

	// 3. Cấu hình CORS cực kỳ quan trọng cho FE Next.js gọi sang
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	// Đấu nối các đường dẫn API
	http.SetupRouter(r)

	// 4. Bật Server
	port := ":" + config.Cfg.Port
	log.Printf("🚀 Rewind Server đang chạy tại http://localhost%s\n", port)
	if err := r.Run(port); err != nil {
		log.Fatalf("❌ Server sập: %v", err)
	}
}
