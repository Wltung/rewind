package db

import (
	"log"
	"rewind/api/internal/config"
	"rewind/api/internal/model"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func Seed() {
	var siteConfig model.SiteConfig

	// 1. Lấy mật khẩu hiện tại từ biến môi trường (.env)
	currentEnvPassword := config.Cfg.DefaultPassword

	// 2. Tìm cấu hình master_password trong DB
	err := DB.Where("`key` = ?", "master_password").First(&siteConfig).Error

	if err == gorm.ErrRecordNotFound {
		// TRƯỜNG HỢP A: Chưa từng có mật khẩu trong DB -> TẠO MỚI
		log.Println("Đang khởi tạo Master Password từ .env...")

		hashedPassword, hashErr := bcrypt.GenerateFromPassword([]byte(currentEnvPassword), bcrypt.DefaultCost)
		if hashErr != nil {
			log.Fatalf("❌ Lỗi băm mật khẩu: %v", hashErr)
		}

		newConfig := model.SiteConfig{
			Key:   "master_password",
			Value: string(hashedPassword),
		}
		if err := DB.Create(&newConfig).Error; err != nil {
			log.Fatalf("❌ Lỗi lưu Seed data: %v", err)
		}
		log.Println("✅ Tạo mới Master Password thành công!")

	} else if err == nil {
		// TRƯỜNG HỢP B: Đã có mật khẩu trong DB
		// Kiểm tra xem mật khẩu trong .env có khớp với DB không
		errMatch := bcrypt.CompareHashAndPassword([]byte(siteConfig.Value), []byte(currentEnvPassword))

		// Nếu KHÔNG KHỚP (errMatch != nil) hoặc value trong DB bị rỗng
		if errMatch != nil || siteConfig.Value == "" {
			log.Println("⚠️ Phát hiện mật khẩu trong .env đã thay đổi. Đang cập nhật lại DB...")

			hashedPassword, hashErr := bcrypt.GenerateFromPassword([]byte(currentEnvPassword), bcrypt.DefaultCost)
			if hashErr != nil {
				log.Fatalf("❌ Lỗi băm mật khẩu mới: %v", hashErr)
			}

			siteConfig.Value = string(hashedPassword)
			if err := DB.Save(&siteConfig).Error; err != nil {
				log.Fatalf("❌ Lỗi cập nhật Master Password: %v", err)
			}
			log.Println("✅ Cập nhật Master Password mới thành công!")
		} else {
			// Nếu khớp -> Không làm gì cả
			log.Println("⚡ Master Password giữ nguyên, không cần cập nhật.")
		}

	} else {
		// Lỗi truy vấn DB khác (mất kết nối, sai tên bảng...)
		log.Fatalf("❌ Lỗi truy vấn Database: %v", err)
	}

	// ==========================================
	// 2. SEED PLAYLIST (Thêm mới)
	// ==========================================
	var songCount int64
	DB.Model(&model.Song{}).Count(&songCount)

	if songCount == 0 {
		log.Println("Đang khởi tạo danh sách bài hát mặc định...")

		songs := []model.Song{
			{
				Title:         "Test - Mix",
				AudioURL:      "/music/Test.mp3",
				DurationLabel: "90 MIN",
				OrderIndex:    1,
				Lyrics: []model.LyricLine{
					{Time: 0, Text: "(Nhạc dạo...)"},
					{Time: 12.5, Text: "Em có nhớ ngày nắng hạ?"},
					{Time: 16.0, Text: "Sân trường vắng, phượng rơi đầy."},
					{Time: 19.5, Text: "Ta ngồi bên nhau ghế đá,"},
					{Time: 23.0, Text: "Trao nhau ánh mắt thơ ngây."},
					{Time: 27.5, Text: "Thời gian trôi nhanh quá vội,"},
					{Time: 31.0, Text: "Chỉ còn kỷ niệm ở lại."},
				},
			},
			{
				Title:         "Thanh Xuân",
				AudioURL:      "/music/Thanh_Xuan.mp3", // Thay file mp3 thật vào sau
				DurationLabel: "60 MIN",
				OrderIndex:    2,
				Lyrics: []model.LyricLine{
					{Time: 0, Text: "Bài hát chưa có lời..."},
				},
			},
		}

		if err := DB.Create(&songs).Error; err != nil {
			log.Fatalf("❌ Lỗi lưu Seed Songs: %v", err)
		}
		log.Println("✅ Seed Songs thành công!")
	}
}
