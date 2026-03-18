package service

import (
	"rewind/api/internal/model"
	"rewind/api/internal/repository"
)

type MemoryService interface {
	GetAll() ([]model.Memory, error)
	GetRandom(excludeID int64) (*model.Memory, error)
	CreateMemory(memory *model.Memory) error
}

type memoryService struct {
	repo repository.MemoryRepo
}

func NewMemoryService(repo repository.MemoryRepo) MemoryService {
	return &memoryService{repo}
}

func (s *memoryService) GetAll() ([]model.Memory, error) {
	// Nếu sau này bạn muốn lọc hay format lại dữ liệu ảnh thì viết code ở đây
	return s.repo.FindAll()
}

func (s *memoryService) GetRandom(excludeID int64) (*model.Memory, error) {
	return s.repo.FindRandom(excludeID) // Sửa dòng này
}

func (s *memoryService) CreateMemory(memory *model.Memory) error {
	return s.repo.CreateMemory(memory)
}
