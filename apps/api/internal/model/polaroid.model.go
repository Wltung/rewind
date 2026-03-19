package model

import "time"

type Polaroid struct {
	ID            int64     `json:"id" gorm:"primaryKey"`
	ImageURL      string    `json:"image_url"`
	Caption       string    `json:"caption"`
	SecretMessage string    `json:"secret_message"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}
