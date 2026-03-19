package repository

import (
	"context"
	"rewind/api/internal/model"

	"gorm.io/gorm"
)

type PolaroidRepository interface {
	GetRandomPolaroid(ctx context.Context, excludeID int64) (*model.Polaroid, error)
	CreatePolaroid(ctx context.Context, polaroid *model.Polaroid) error
}

type polaroidRepository struct {
	db *gorm.DB
}

func NewPolaroidRepository(db *gorm.DB) PolaroidRepository {
	return &polaroidRepository{db: db}
}

func (r *polaroidRepository) GetRandomPolaroid(ctx context.Context, excludeID int64) (*model.Polaroid, error) {
	var polaroid model.Polaroid
	query := r.db.WithContext(ctx)

	// 1. Cố gắng lấy ảnh ngẫu nhiên và KHÁC ảnh hiện tại
	if excludeID > 0 {
		query = query.Where("id != ?", excludeID)
	}

	err := query.Order("RAND()").First(&polaroid).Error

	// 2. FALLBACK: Nếu bị lỗi "Record Not Found" VÀ đang có dùng excludeID
	// (Tức là DB có quá ít ảnh, trừ ra cái là hết luôn)
	if err != nil && excludeID > 0 {
		// Bỏ điều kiện Where id != ? đi, bốc lại random từ đầu
		err = r.db.WithContext(ctx).Order("RAND()").First(&polaroid).Error
	}

	return &polaroid, err
}

func (r *polaroidRepository) CreatePolaroid(ctx context.Context, polaroid *model.Polaroid) error {
	return r.db.WithContext(ctx).Create(polaroid).Error
}
