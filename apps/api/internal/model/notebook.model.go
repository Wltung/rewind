package model

import "time"

type Notebook struct {
	ID         uint      `gorm:"primaryKey" json:"id"`
	Title      string    `gorm:"type:varchar(255);not null" json:"title"`
	BodyText   string    `gorm:"type:text;not null" json:"body_text"`
	FooterText string    `gorm:"type:varchar(255);not null" json:"footer_text"`
	IconName   string    `gorm:"type:varchar(50);not null" json:"icon_name"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}
