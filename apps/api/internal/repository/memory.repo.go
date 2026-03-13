package repository

import (
	"rewind/api/internal/model"

	"gorm.io/gorm"
)

// 1. Khai báo Interface để Service gọi
type MemoryRepo interface {
	FindAll() ([]model.Memory, error)
	FindRandom() (*model.Memory, error)
}

// 2. Struct chứa instance của DB
type memoryRepo struct {
	db *gorm.DB
}

// 3. Hàm khởi tạo (Constructor)
func NewMemoryRepo(db *gorm.DB) MemoryRepo {
	return &memoryRepo{db}
}

// 4. Các hàm thực thi query
func (r *memoryRepo) FindAll() ([]model.Memory, error) {
	var memories []model.Memory
	err := r.db.Order("memory_date desc").Find(&memories).Error
	return memories, err
}

func (r *memoryRepo) FindRandom() (*model.Memory, error) {
	var memory model.Memory
	err := r.db.Order("RAND()").First(&memory).Error
	return &memory, err
}
