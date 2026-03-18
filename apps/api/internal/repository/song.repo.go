package repository

import (
	"context"

	"rewind/api/internal/model"

	"gorm.io/gorm"
)

type SongRepository interface {
	GetPlaylist(ctx context.Context) ([]model.Song, error)
	GetMaxOrderIndex(ctx context.Context) (int, error)
	CreateSong(ctx context.Context, song *model.Song) error
}

type songRepository struct {
	db *gorm.DB
}

func NewSongRepository(db *gorm.DB) SongRepository {
	return &songRepository{db: db}
}

func (r *songRepository) GetPlaylist(ctx context.Context) ([]model.Song, error) {
	var songs []model.Song
	err := r.db.WithContext(ctx).Order("order_index ASC").Find(&songs).Error
	for i := range songs {
		if songs[i].Lyrics == nil {
			songs[i].Lyrics = make([]model.LyricLine, 0)
		}
	}
	return songs, err
}

// Lấy thứ tự order_index lớn nhất hiện tại
func (r *songRepository) GetMaxOrderIndex(ctx context.Context) (int, error) {
	var maxIndex int
	err := r.db.WithContext(ctx).Model(&model.Song{}).Select("COALESCE(MAX(order_index), 0)").Scan(&maxIndex).Error
	return maxIndex, err
}

// Lưu bài hát mới vào DB
func (r *songRepository) CreateSong(ctx context.Context, song *model.Song) error {
	return r.db.WithContext(ctx).Create(song).Error
}
