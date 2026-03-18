package model

import "time"

type LyricLine struct {
	Time float64 `json:"time"`
	Text string  `json:"text"`
}

type Song struct {
	ID            int64  `json:"id"`
	Title         string `json:"title"`
	Artist        string `json:"artist"`
	Quote         string `json:"quote"`
	AudioURL      string `json:"src"`
	DurationLabel string `json:"duration"`
	OrderIndex    int    `json:"order_index"`

	Lyrics    []LyricLine `json:"lyrics" gorm:"serializer:json"`
	CreatedAt time.Time   `json:"created_at"`
	UpdatedAt time.Time   `json:"updated_at"`
}
