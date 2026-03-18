package service

import (
	"context"

	"rewind/api/internal/model" // Nhớ đổi 'your_project_name' thành module name của bạn
	"rewind/api/internal/repository"
)

type SongService interface {
	GetPlaylist(ctx context.Context) ([]model.Song, error)
	CreateSong(ctx context.Context, song *model.Song) error
}

type songService struct {
	repo repository.SongRepository
}

func NewSongService(repo repository.SongRepository) SongService {
	return &songService{repo: repo}
}

func (s *songService) GetPlaylist(ctx context.Context) ([]model.Song, error) {
	return s.repo.GetPlaylist(ctx)
}

// Xử lý logic xếp hạng thứ tự bài hát trước khi lưu
func (s *songService) CreateSong(ctx context.Context, song *model.Song) error {
	maxIndex, err := s.repo.GetMaxOrderIndex(ctx)
	if err != nil {
		return err
	}

	song.OrderIndex = maxIndex + 1 // Xếp bài mới xuống cuối playlist
	return s.repo.CreateSong(ctx, song)
}
