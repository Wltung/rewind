package db

import (
	"log"
	"rewind/api/internal/model"

	"golang.org/x/crypto/bcrypt"
)

func Seed() {
	var count int64
	DB.Model(&model.SiteConfig{}).Where("`key` = ?", "master_password").Count(&count)

	// Nếu chưa có master_password trong DB thì tiến hành tạo
	if count == 0 {
		log.Println("Đang khởi tạo Master Password mặc định...")

		// Băm mật khẩu "3001"
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte("3001"), bcrypt.DefaultCost)
		if err != nil {
			log.Fatalf("❌ Lỗi băm mật khẩu: %v", err)
		}

		// Lưu vào DB
		config := model.SiteConfig{
			Key:   "master_password",
			Value: string(hashedPassword),
		}

		if err := DB.Create(&config).Error; err != nil {
			log.Fatalf("❌ Lỗi lưu Seed data: %v", err)
		}
		log.Println("✅ Seed Master Password thành công!")
	}
}
