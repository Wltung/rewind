package model

import "time"

// Memory đại diện cho một bức ảnh/kỷ niệm trong hệ thống
type Memory struct {
	ID            int64     `gorm:"primaryKey;autoIncrement" json:"id"`
	ImageURL      string    `gorm:"type:varchar(500);not null" json:"image_url"` // Để trống ("") nếu là Note vàng
	Caption       string    `gorm:"type:text" json:"caption"`                    // Mặt trước
	SecretMessage string    `gorm:"type:text" json:"secret_message"`             // Mặt sau (Polaroid)
	MemoryDate    time.Time `gorm:"type:date" json:"memory_date"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}
