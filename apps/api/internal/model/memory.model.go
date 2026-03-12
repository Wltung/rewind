package model

import "time"

// Memory đại diện cho một bức ảnh/kỷ niệm trong hệ thống
type Memory struct {
	ID         int64     `gorm:"primaryKey;autoIncrement" json:"id"`
	ImageURL   string    `gorm:"type:varchar(500);not null" json:"image_url"`
	Caption    string    `gorm:"type:text" json:"caption"`
	MemoryDate time.Time `gorm:"type:date" json:"memory_date"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}
