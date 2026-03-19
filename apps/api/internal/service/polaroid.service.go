package service

import (
	"context"
	"rewind/api/internal/model"
	"rewind/api/internal/repository"
)

type PolaroidService interface {
	GetRandomPolaroid(ctx context.Context, excludeID int64) (*model.Polaroid, error)
	CreatePolaroid(ctx context.Context, polaroid *model.Polaroid) error
}

type polaroidService struct {
	repo repository.PolaroidRepository
}

func NewPolaroidService(repo repository.PolaroidRepository) PolaroidService {
	return &polaroidService{repo: repo}
}

func (s *polaroidService) GetRandomPolaroid(ctx context.Context, excludeID int64) (*model.Polaroid, error) {
	return s.repo.GetRandomPolaroid(ctx, excludeID)
}

func (s *polaroidService) CreatePolaroid(ctx context.Context, polaroid *model.Polaroid) error {
	return s.repo.CreatePolaroid(ctx, polaroid)
}
