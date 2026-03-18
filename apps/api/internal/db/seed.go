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

	// ==========================================
	// 2. SEED PLAYLIST (Thêm mới)
	// ==========================================
	var songCount int64
	DB.Model(&model.Song{}).Count(&songCount)

	if songCount == 0 {
		log.Println("Đang khởi tạo danh sách bài hát mặc định...")

		songs := []model.Song{
			{
				Title:         "In Love - Mix",
				AudioURL:      "/music/In_Love.mp3",
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
