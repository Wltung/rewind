package model

// SiteConfig lưu trữ các cấu hình chung của web, bao gồm cả Master Password
type SiteConfig struct {
	Key   string `gorm:"primaryKey;type:varchar(50)"`
	Value string `gorm:"type:text"`
}
