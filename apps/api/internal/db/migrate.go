package db

import (
	"log"

	"rewind/api/internal/config" // Đổi tên module cho đúng với file go.mod của bạn

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/mysql"
	_ "github.com/golang-migrate/migrate/v4/source/file"
)

func Migrate(direction string) {
	// Lấy instance database/sql thuần từ GORM
	sqlDB, err := DB.DB()
	if err != nil {
		log.Fatalf("❌ Lỗi lấy kết nối SQL để migrate: %v", err)
	}

	driver, err := mysql.WithInstance(sqlDB, &mysql.Config{})
	if err != nil {
		log.Fatalf("❌ Lỗi khởi tạo MySQL driver: %v", err)
	}

	// Chỉ định thư mục chứa file .sql (Đường dẫn tương đối từ gốc apps/api)
	m, err := migrate.NewWithDatabaseInstance(
		"file://migrations",
		config.Cfg.DBName,
		driver,
	)
	if err != nil {
		log.Fatalf("❌ Lỗi khởi tạo công cụ Migration: %v", err)
	}

	// XỬ LÝ RẼ NHÁNH UP / DOWN
	if direction == "down" {
		log.Println("⚠️ Đang chạy Rollback Database (Xóa bảng)...")
		err = m.Down()
	} else {
		log.Println("Đang kiểm tra và chạy Database Migration (Up)...")
		err = m.Up()
	}

	if err != nil && err != migrate.ErrNoChange {
		log.Fatalf("❌ Lỗi thực thi Migration: %v", err)
	}

	if err == migrate.ErrNoChange {
		log.Println("✅ Database đã ở phiên bản mới nhất, bỏ qua migrate.")
	} else {
		log.Println("✅ Cập nhật Database thành công!")
	}
}
